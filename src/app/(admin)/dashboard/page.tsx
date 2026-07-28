import React from "react";
import { Package, Users, DollarSign, TrendingUp, Plus } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tổng quan hệ thống</h1>
          <p className="text-slate-500 mt-1">Chào mừng trở lại, dưới đây là tình hình kinh doanh hôm nay.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors">
          <Plus className="w-5 h-5" />
          Thêm Sản Phẩm
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Tổng Doanh Thu</h3>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">$24,500</span>
            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +12%
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
            <span className="text-3xl font-bold text-slate-900">142</span>
            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +4 mới
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
            <span className="text-3xl font-bold text-slate-900">892</span>
            <span className="text-sm font-medium text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +18%
            </span>
          </div>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-900">Sản phẩm gần đây</h3>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Xem tất cả</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sản Phẩm</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Điểm SEO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-slate-200"></div>
                  <div>
                    <div className="font-medium text-slate-900">Đồng hồ AURA CHRONOS</div>
                    <div className="text-xs text-slate-500">Đồng hồ</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Đã Xuất Bản
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">$1,499.00</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600">95/100</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-slate-200"></div>
                  <div>
                    <div className="font-medium text-slate-900">Tai nghe NEBULA X</div>
                    <div className="text-xs text-slate-500">Công nghệ</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Bản Nháp
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900 font-medium">$599.00</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-xs font-medium text-slate-600">60/100</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
