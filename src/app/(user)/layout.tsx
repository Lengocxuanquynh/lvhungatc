import React from "react";
import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-widest text-slate-900">
              [LUXE & CO.]
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="/hang-moi" className="hover:text-blue-600 transition-colors">HÀNG MỚI</Link>
              <Link href="/thoi-trang" className="hover:text-blue-600 transition-colors">THỜI TRANG</Link>
              <Link href="/cong-nghe" className="hover:text-blue-600 transition-colors">CÔNG NGHỆ</Link>
              <Link href="/phu-kien" className="hover:text-blue-600 transition-colors">PHỤ KIỆN</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-6 text-slate-600">
            <button className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors">
              TÌM KIẾM <Search className="w-4 h-4" />
            </button>
            <Link href="/tai-khoan" className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors">
              TÀI KHOẢN <User className="w-4 h-4" />
            </Link>
            <button className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors">
              GIỎ HÀNG (2) <ShoppingBag className="w-4 h-4" />
            </button>
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
          <div>&copy; {new Date().getFullYear()} [LUXE & CO.]. Bản quyền thuộc về chúng tôi.</div>
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-blue-600 font-medium text-slate-700">Quản trị</Link>
            <Link href="/ve-chung-toi" className="hover:text-blue-600">Về chúng tôi</Link>
            <Link href="/lien-he" className="hover:text-blue-600">Liên hệ</Link>
            <Link href="/chinh-sach" className="hover:text-blue-600">Chính sách bảo mật</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
