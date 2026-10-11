-- =====================================================================
-- Klub turystyczny – schemat bazy danych
-- Wklej całość w Supabase → SQL Editor → "Run". Można uruchomić ponownie.
-- =====================================================================

-- ---------- Administratorzy ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Ustawienia (jeden wiersz) ----------
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  club_name text not null default 'Klub Turystyczny',
  tagline text not null default 'Wędrujemy razem po Polsce',
  contact_email text not null default '',
  contact_phone text not null default '',
  postal_address text not null default '',
  bank_recipient text not null default '',
  bank_account text not null default '',
  bank_name text not null default '',
  declaration_pdf_url text not null default '',
  declaration_pdf_name text not null default '',
  footer_text text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.settings (id) values (1) on conflict (id) do nothing;

-- ---------- Strony ----------
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  blocks jsonb not null default '[]'::jsonb,
  is_home boolean not null default false,
  show_in_menu boolean not null default true,
  menu_order int not null default 100,
  published boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists pages_one_home on public.pages (is_home) where is_home;

-- ---------- Trasy (warianty wycieczek) ----------
create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null default '',
  difficulty int not null default 1 check (difficulty between 1 and 4),
  duration text not null default '',
  distance text not null default '',
  price numeric(10, 2) not null default 0 check (price >= 0),
  features text[] not null default '{}',
  image_url text not null default '',
  blocks jsonb not null default '[]'::jsonb,
  sort_order int not null default 100,
  published boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Zapisy ----------
create sequence if not exists public.registration_seq;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  ref_code text not null unique,
  route_id uuid references public.routes (id) on delete set null,
  route_title text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null default '',
  people int not null default 1 check (people between 1 and 50),
  amount numeric(10, 2) not null default 0,
  message text not null default '',
  status text not null default 'nowe' check (status in ('nowe', 'oplacone', 'anulowane')),
  declaration_received boolean not null default false,
  paid_at timestamptz,
  admin_notes text not null default '',
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists registrations_created_idx on public.registrations (created_at desc);

-- Zapis z formularza publicznego. Kwotę i numer zgłoszenia liczy baza,
-- więc nikt nie może ich podmienić w przeglądarce.
create or replace function public.create_registration(
  p_route_id uuid,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_phone text,
  p_people int,
  p_message text
)
returns table (ref_code text, amount numeric, route_title text)
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.routes;
  v_code text;
  v_amount numeric;
begin
  select * into r from public.routes
   where id = p_route_id and published and deleted_at is null;
  if not found then
    raise exception 'Wybrana trasa nie jest dostępna';
  end if;

  if coalesce(trim(p_first_name), '') = '' or coalesce(trim(p_last_name), '') = ''
     or coalesce(trim(p_email), '') = '' then
    raise exception 'Brak wymaganych danych';
  end if;
  if p_people is null or p_people < 1 or p_people > 50 then
    raise exception 'Nieprawidłowa liczba osób';
  end if;

  v_code := 'TK-' || to_char(now(), 'YYYY') || '-'
            || lpad(nextval('public.registration_seq')::text, 4, '0');
  v_amount := r.price * p_people;

  insert into public.registrations
    (ref_code, route_id, route_title, first_name, last_name, email, phone, people, amount, message)
  values
    (v_code, r.id, r.title, left(trim(p_first_name), 100), left(trim(p_last_name), 100),
     left(trim(p_email), 200), left(trim(coalesce(p_phone, '')), 50), p_people, v_amount,
     left(coalesce(p_message, ''), 2000));

  return query select v_code, v_amount, r.title;
end;
$$;

revoke all on function public.create_registration(uuid, text, text, text, text, int, text) from public;
grant execute on function public.create_registration(uuid, text, text, text, text, int, text) to anon, authenticated;

-- ---------- Uprawnienia (RLS) ----------
alter table public.admins enable row level security;
alter table public.settings enable row level security;
alter table public.pages enable row level security;
alter table public.routes enable row level security;
alter table public.registrations enable row level security;

drop policy if exists "admins_self" on public.admins;
create policy "admins_self" on public.admins for select to authenticated using (user_id = auth.uid());

drop policy if exists "settings_read" on public.settings;
create policy "settings_read" on public.settings for select using (true);
drop policy if exists "settings_admin" on public.settings;
create policy "settings_admin" on public.settings for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "pages_read" on public.pages;
create policy "pages_read" on public.pages for select
  using ((published and deleted_at is null) or public.is_admin());
drop policy if exists "pages_admin" on public.pages;
create policy "pages_admin" on public.pages for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "routes_read" on public.routes;
create policy "routes_read" on public.routes for select
  using ((published and deleted_at is null) or public.is_admin());
drop policy if exists "routes_admin" on public.routes;
create policy "routes_admin" on public.routes for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Zapisy widzi i zmienia tylko administrator (dodawanie przez create_registration).
drop policy if exists "registrations_admin" on public.registrations;
create policy "registrations_admin" on public.registrations for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Pliki (zdjęcia, PDF) ----------
insert into storage.buckets (id, name, public)
values ('pliki', 'pliki', true)
on conflict (id) do nothing;

drop policy if exists "pliki_admin_insert" on storage.objects;
create policy "pliki_admin_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'pliki' and public.is_admin());
drop policy if exists "pliki_admin_update" on storage.objects;
create policy "pliki_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'pliki' and public.is_admin());
drop policy if exists "pliki_admin_delete" on storage.objects;
create policy "pliki_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'pliki' and public.is_admin());

-- ---------- Przykładowa treść (tylko przy pierwszym uruchomieniu) ----------
insert into public.pages (title, slug, is_home, show_in_menu, menu_order, published, blocks)
select 'Strona główna', 'start', true, false, 0, true, jsonb_build_array(
  jsonb_build_object('id', 'b1', 'type', 'heading', 'text', 'Witamy w naszym klubie turystycznym'),
  jsonb_build_object('id', 'b2', 'type', 'text', 'text',
    'Organizujemy wspólne wędrówki po najpiękniejszych zakątkach Polski. Wybierz jedną z naszych tras i zapisz się już dziś.'),
  jsonb_build_object('id', 'b3', 'type', 'routes')
)
where not exists (select 1 from public.pages);

insert into public.pages (title, slug, show_in_menu, menu_order, published, blocks)
select 'O klubie', 'o-klubie', true, 10, true, jsonb_build_array(
  jsonb_build_object('id', 'b1', 'type', 'heading', 'text', 'O klubie'),
  jsonb_build_object('id', 'b2', 'type', 'text', 'text', 'Tutaj napisz kilka słów o klubie.')
)
where not exists (select 1 from public.pages where slug = 'o-klubie');

insert into public.routes (title, slug, short_description, difficulty, duration, price, sort_order, published, features)
select * from (values
  ('Trasa 1 – dla początkujących', 'trasa-1', 'Spokojna wędrówka dla każdego.', 1, '1 dzień', 100.00, 1, true, array['Przewodnik w formie PDF']),
  ('Trasa 2 – średnio zaawansowana', 'trasa-2', 'Dłuższa trasa z kilkoma podejściami.', 2, '2 dni', 250.00, 2, true, array['Przewodnik PDF', 'Mapa trasy']),
  ('Trasa 3 – zaawansowana', 'trasa-3', 'Wymagająca trasa górska.', 3, '3 dni', 450.00, 3, true, array['Przewodnik PDF', 'Mapa trasy', 'Opieka przewodnika']),
  ('Trasa 4 – ekspercka', 'trasa-4', 'Dla doświadczonych turystów.', 4, '5 dni', 800.00, 4, true, array['Przewodnik PDF', 'Mapa trasy', 'Opieka przewodnika', 'Noclegi'])
) as v(title, slug, short_description, difficulty, duration, price, sort_order, published, features)
where not exists (select 1 from public.routes);
