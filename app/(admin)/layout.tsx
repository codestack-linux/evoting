// app/(admin)/dashboard/layout.tsx
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50/50">
      {/* Navigasi Samping */}
      <Sidebar />

      {/* Konten Utama */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
