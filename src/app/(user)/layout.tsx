import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/actions/auth";
import { getSiteSettings } from "@/app/actions/settings";
import HeaderActions from "./components/HeaderActions";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value || cookieStore.get("admin_session")?.value;
  
  let currentUser = null;
  if (userId) {
    currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, role: true }
    });
  }

  const settings = await getSiteSettings();
  const siteName = settings.siteName || "LVHUNGATC";

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-widest text-slate-900 uppercase">
              {siteName}
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="/san-pham" className="hover:text-blue-600 transition-colors">SẢN PHẨM</Link>
              <Link href="/lien-he" className="hover:text-blue-600 transition-colors">LIÊN HỆ</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-6 text-slate-600">
            <HeaderActions />

            {currentUser ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <Link href={currentUser.role === "ADMIN" ? "/dashboard" : "/profile"} className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1">
                  Hi, <span className="font-bold text-blue-600">{currentUser.name?.split(" ")[0]}</span>
                  {currentUser.role === "ADMIN" && (
                    <span className="ml-1 bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">Admin</span>
                  )}
                </Link>
                <form action={logoutAction}>
                  <button type="submit" className="text-slate-400 hover:text-red-500 transition-colors mt-1" aria-label="Đăng xuất">
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/dang-nhap" className="flex items-center gap-2 text-sm font-medium hover:text-blue-600 transition-colors">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 mt-12 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div>&copy; {new Date().getFullYear()} {siteName}. Bản quyền thuộc về chúng tôi.</div>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-blue-600 font-medium text-slate-700">Quản trị</Link>
            <Link href="/san-pham" className="hover:text-blue-600">Sản phẩm</Link>
            <Link href="/lien-he" className="hover:text-blue-600">Liên hệ</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
