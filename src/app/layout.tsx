import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import "./globals.css";
import { cn } from "@/lib/utils";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['700', '800'], variable: '--font-display' });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "Aditor AI - Tu Director de Performance",
  description: "Auditoría automática de campañas de Meta Ads con IA.",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body className={cn(plusJakarta.variable, dmSans.variable, "bg-[#1A1A2E] text-white font-sans antialiased")}>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}