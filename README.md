# Klub Turystyczny – website + admin panel

Next.js 16 site for a Polish tourist club, hosted on **Vercel** with **Supabase** as the database.

- **Public site** (Polish, white theme): home page, 4 routes (Zwierzęca, Mała, Kopa, Duża) with the number of peaks to climb, a vector illustration and what's included, custom pages, sign-up form.
- **Sign-up flow**: visitor fills the online form → sees bank-transfer details (one club fee, set in Settings) with a unique title (`TK-2026-0001 Kowalski`) → downloads the declaration PDF, signs it, and sends it **by post**.
- **Admin panel** (`/admin`): big tiles, large fonts, autosave, preview, recycle bin. Pages are built from simple blocks (heading, text, photo, PDF file, button, route list, "how to sign up").
- **Sign-ups**: mark as *paid* / *declaration received* / *cancelled*, notes, search, Excel (CSV) export.

## One-time setup (about 20 minutes)

### 1. Supabase
1. Create a free project at <https://supabase.com> (region: **Frankfurt (eu-central-1)**).
2. **SQL Editor → New query** → paste all of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   This creates the tables, security rules, file storage and sample content.
3. **Authentication → Users → Add user**: enter your father's e-mail and a password, tick *Auto confirm*.
4. Back in **SQL Editor**, make that user the admin:
   ```sql
   insert into public.admins select id from auth.users where email = 'tata@example.com';
   ```
5. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up".
6. **Project Settings → API Keys**: copy the *Project URL* and the *publishable* key.

### 2. Vercel
1. At <https://vercel.com> → **Add New → Project** → import this GitHub repository.
2. Add environment variables:
   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | publishable key |
3. **Deploy**. The site is live at `https://<project>.vercel.app`. Every push to the main branch redeploys.

### 3. First login
Open `https://<project>.vercel.app/admin`, log in, and go to **Ustawienia** to fill in the club name, address, bank account, the fee, and upload the declaration PDF.

### Later: own domain
Buy a `.pl` domain, then Vercel → Project → **Settings → Domains** → add it and follow the DNS instructions.

## Good to know
- **Supabase free tier pauses** a project after ~7 days without activity. `vercel.json` defines a daily cron hitting `/api/keepalive` to prevent that.
- **Vercel Hobby** is for non-commercial use; if the club charges money, consider Vercel Pro.
- No e-mails are sent yet (that needs a domain). The confirmation page has all the details and a print button; new sign-ups show as a red badge on the admin dashboard.
- Route pictures are drawn in code (`src/components/Illustration.tsx`); an uploaded photo replaces the drawing.
- The fee and reference numbers are calculated in the database (`create_registration`), so they can't be tampered with in the browser. Visitors can't read sign-ups (RLS).

## Development
```bash
cp .env.example .env.local   # fill in Supabase URL + key
npm install
npm run dev                  # http://localhost:3000
npm run lint && npm run build
```

### Project map
| Path | What |
|---|---|
| `src/app/(site)/` | public pages (home, `[slug]`, `trasy`, `zapisy`) |
| `src/app/admin/(panel)/` | admin panel (strony, trasy, zapisy, ustawienia, pomoc) + server actions |
| `src/app/admin/podglad/` | preview of drafts |
| `src/components/Blocks.tsx` | renders page blocks |
| `src/components/admin/BlockEditor.tsx` | block editor |
| `supabase/schema.sql` | database schema, RLS, storage, sample data (safe to re-run) |
