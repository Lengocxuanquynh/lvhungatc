import React from "react";
import { prisma } from "@/lib/prisma";
import OrderActionButtons from "./OrderActionButtons";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Đơn hàng</h1>
          <p className="text-sm text-slate-500 mt-1">
            Xác nhận thanh toán để tự động mở khóa link tải cho khách
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Mã Đơn</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Khách Hàng</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Sản phẩm</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Tổng Tiền</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Trạng Thái</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono font-medium text-slate-900">
                        DH{order.id.slice(-6).toUpperCase()}
                      </span>
                      <div className="text-xs text-slate-500 mt-1">
                        {order.createdAt.toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">{order.customerName}</div>
                      <div className="text-sm text-slate-500">{order.customerEmail}</div>
                    </td>
                    <td className="py-4 px-6">
                      <ul className="text-sm space-y-1">
                        {order.items.map((item: any) => (
                          <li key={item.id} className="text-slate-700 line-clamp-1" title={item.product.title}>
                            - {item.product.title} (x{item.quantity})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 px-6 font-bold text-blue-600">
                      {order.totalAmount.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-4 px-6">
                      {order.status === "PENDING" && (
                        <span className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          Chờ thanh toán
                        </span>
                      )}
                      {order.status === "PAID" && (
                        <span className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Đã thanh toán
                        </span>
                      )}
                      {order.status === "CANCELLED" && (
                        <span className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Đã hủy
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <OrderActionButtons orderId={order.id} status={order.status} />
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
