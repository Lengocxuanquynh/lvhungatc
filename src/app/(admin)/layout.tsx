import React from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Users, Settings, LogOut, Package } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-blue-600">[LUXE ADMIN]</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5" />
            Bảng điều khiển
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors">
            <Package className="w-5 h-5" />
            Sản phẩm & SEO
          </Link>
          <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors">
            <ShoppingCart className="w-5 h-5" />
            Đơn hàng
          </Link>
          <Link href="/dashboard/users" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5" />
            Khách hàng
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Cài đặt
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors">
            <LogOut className="w-5 h-5" />
            Về trang web
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-800">Tổng quan</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              Q
            </div>
            <span className="text-sm font-medium text-slate-600">Quản trị viên</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
