import type { Metadata } from "next";
import { Archivo, Atkinson_Hyperlegible_Next } from "next/font/google";
import "./globals.css";

// Nagłówki: wąski krój jak na drogowskazach szlaków.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

// Tekst: krój zaprojektowany dla czytelności, także dla osób słabiej widzących.
const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Klub Turystyczny",
  description: "Wspólne wędrówki po Polsce",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pl" className={`${archivo.variable} ${atkinson.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
