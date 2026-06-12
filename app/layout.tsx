import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { LocaleProvider } from "@/lib/locale-context";
import { AuthProvider } from "@/lib/auth-context";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  getTranslations,
  isValidLocale,
  type Locale,
} from "@/lib/i18n";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuxeEstate — Premium Real Estate",
  description: "Find your sanctuary.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Resolve locale server-side from cookie to prevent flash
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get(LOCALE_COOKIE)?.value ?? "";
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  // Pre-load translations on the server so the client gets them without extra fetches
  const translations = await getTranslations(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className="bg-background-light font-display selection:bg-mosque selection:text-white"
        suppressHydrationWarning
      >
        <AuthProvider>
          <LocaleProvider initialLocale={locale} initialTranslations={translations}>
            {children}
          </LocaleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
