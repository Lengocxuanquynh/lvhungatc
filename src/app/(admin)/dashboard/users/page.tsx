import React from "react";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  // Lấy danh sách khách hàng từ đơn hàng
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      customerName: true,
      customerEmail: true,
      totalAmount: true,
      createdAt: true
    }
  });

  // Gom nhóm theo email
  const customersMap = new Map();
  orders.forEach(order => {
    if (customersMap.has(order.customerEmail)) {
      const existing = customersMap.get(order.customerEmail);
      existing.orderCount += 1;
      existing.totalSpent += order.totalAmount;
      if (order.createdAt > existing.lastOrder) {
        existing.lastOrder = order.createdAt;
      }
    } else {
      customersMap.set(order.customerEmail, {
        name: order.customerName,
        email: order.customerEmail,
        orderCount: 1,
        totalSpent: order.totalAmount,
        lastOrder: order.createdAt
      });
    }
  });

  const customers = Array.from(customersMap.values()).sort((a, b) => b.lastOrder.getTime() - a.lastOrder.getTime());

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Khách hàng</h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách khách hàng đã mua sản phẩm
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Tên Khách Hàng</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Email</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Số Đơn Hàng</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Tổng Chi Tiêu</th>
                <th className="py-4 px-6 text-sm font-semibold text-slate-700">Lần Cuối Mua</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Chưa có khách hàng nào
                  </td>
                </tr>
              ) : (
                customers.map((customer, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-900">{customer.name}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {customer.email}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {customer.orderCount}
                    </td>
                    <td className="py-4 px-6 font-bold text-blue-600">
                      ${customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-500">
                      {customer.lastOrder.toLocaleDateString('vi-VN')}
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
