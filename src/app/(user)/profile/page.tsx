import React from "react";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Hồ sơ của tôi | LVHUNGATC",
  description: "Quản lý hồ sơ và đơn hàng đã mua",
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value || cookieStore.get("admin_session")?.value;

  if (!userId) {
    redirect("/dang-nhap");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, createdAt: true, role: true }
  });

  if (!user) {
    redirect("/dang-nhap");
  }

  // Fetch orders based on user's email
  const orders = await prisma.order.findMany({
    where: { customerEmail: user.email },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Tài khoản của tôi</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Profile Sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
                {user.role === "ADMIN" && (
                  <span className="inline-block mt-1 text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                    Admin
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center text-slate-600">
                <span>Ngày tham gia:</span>
                <span className="font-medium text-slate-900">
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Tổng số đơn hàng:</span>
                <span className="font-medium text-slate-900">{orders.length} đơn</span>
              </div>
            </div>
            
            {user.role === "ADMIN" && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <Link href="/dashboard" className="block w-full text-center bg-slate-900 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
                  Vào trang Quản trị
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="w-full md:w-2/3">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" /> Đơn hàng đã mua
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Bạn chưa có đơn hàng nào.</p>
                <Link href="/san-pham" className="inline-block mt-4 text-blue-600 font-medium hover:underline">
                  Khám phá sản phẩm ngay
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order: any) => (
                  <div key={order.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    {/* Order Header */}
                    <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200">
                      <div>
                        <div className="text-sm text-slate-500 mb-1">
                          Đơn hàng <span className="font-bold text-slate-900">#{order.id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="text-sm text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-slate-900">
                          ${order.totalAmount.toLocaleString()}
                        </span>
                        {order.status === "PAID" ? (
                          <span className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đã thanh toán
                          </span>
                        ) : order.status === "PENDING" ? (
                          <span className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" /> Chờ thanh toán
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                            <AlertCircle className="w-3.5 h-3.5" /> Đã hủy
                          </span>
                        )}
                        <Link href={`/order/${order.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                          Chi tiết &rarr;
                        </Link>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex gap-4 items-center">
                            <div className="relative w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                              {item.product.images && item.product.images[0] ? (
                                <Image src={item.product.images[0]} alt={item.product.title} fill className="object-contain" />
                              ) : (
                                <Package className="w-6 h-6 text-slate-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                              )}
                            </div>
                            <div className="flex-1">
                              <Link href={`/san-pham/${item.product.slug}`} className="font-medium text-slate-900 hover:text-blue-600 transition-colors line-clamp-1">
                                {item.product.title}
                              </Link>
                              <div className="text-sm text-slate-500 mt-1">
                                Số lượng: {item.quantity}
                              </div>
                            </div>
                            <div className="font-medium text-slate-900">
                              ${item.price.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
