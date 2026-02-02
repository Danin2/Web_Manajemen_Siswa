import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Manajemen Tugas & Jadwal Siswa SMK",
  description: "Aplikasi untuk mengelola tugas dan jadwal pelajaran siswa SMK",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('smk-theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}