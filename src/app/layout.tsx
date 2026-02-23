import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className={cn(syne.variable, dmSans.variable, "bg-[#1A1A2E] text-white font-sans antialiased")}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}