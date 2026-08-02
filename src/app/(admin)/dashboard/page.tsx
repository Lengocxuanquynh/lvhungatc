import React from "react";
import { Package, Users, DollarSign, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const productsCount = await prisma.product.count();
  const usersCount = await prisma.user.count({ where: { role: 'USER' } });
  
  // Tính tổng số tiền giả lập hoặc nếu có đơn hàng thật thì tính
  // Hiện tại chưa có Order model nên ta cứ để 0
  const totalRevenue = 0;

  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { category: true }
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
          <p className="text-slate-500 mt-1">Chào mừng trở lại, dưới đây là tình hình kinh doanh hôm nay.</p>
        </div>
        <Link 
          href="/dashboard/products/add" 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm Sản Phẩm
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Tổng Doanh Thu</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">${totalRevenue}</span>
            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
              --
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Sản phẩm</h3>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">{productsCount}</span>
            <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
              Đang bán
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Khách Hàng</h3>
            <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">{usersCount}</span>
            <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
              Đăng ký
            </span>
          </div>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Sản phẩm gần đây</h3>
          <Link href="/dashboard/products" className="text-sm font-medium text-blue-600 hover:text-blue-700">Xem tất cả</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sản Phẩm</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              ) : (
                recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-slate-200"></div>
                      )}
                      <div>
                        <div className="font-medium text-slate-900">{product.title}</div>
                        <div className="text-xs text-slate-500">{product.category?.name || "Khác"}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {product.published ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Đã Xuất Bản
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Bản Nháp
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                      {product.price.toLocaleString("vi-VN")} đ
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
