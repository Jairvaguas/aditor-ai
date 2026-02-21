import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - Aditor AI",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-sans antialiased">
      {children}
    </div>
  );
}