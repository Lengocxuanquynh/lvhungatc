"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Users, Settings, LogOut, Package, Layers, CreditCard, MessageSquare } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "Sản phẩm", icon: Package },
    { href: "/dashboard/categories", label: "Phân loại", icon: Layers },
    { href: "/dashboard/orders", label: "Đơn hàng", icon: ShoppingCart },
    { href: "/dashboard/users", label: "Khách hàng", icon: Users },
    { href: "/dashboard/messages", label: "Tin nhắn", icon: MessageSquare },
    { href: "/dashboard/bank", label: "Thanh toán", icon: CreditCard },
    { href: "/dashboard/settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <span className="text-xl font-bold text-blue-600">LVHUNGATC ADMIN</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = item.href === "/dashboard" 
              ? pathname === "/dashboard" 
              : pathname.startsWith(item.href);
              
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <form action={logoutAction}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg font-medium transition-colors">
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </form>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 mt-2 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-lg font-medium transition-colors">
            Về trang web
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-800">
            {navItems.find(item => item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href))?.label || "Tổng quan"}
          </h2>
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
