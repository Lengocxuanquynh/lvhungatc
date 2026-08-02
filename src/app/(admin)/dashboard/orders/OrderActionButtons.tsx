"use client";

import React, { useState } from "react";
import { updateOrderStatus, deleteOrderAction } from "@/app/actions/order";
import { Check, X, Loader2, Trash2 } from "lucide-react";

interface OrderActionButtonsProps {
  orderId: string;
  status: "PENDING" | "PAID" | "CANCELLED";
}

export default function OrderActionButtons({ orderId, status }: OrderActionButtonsProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newStatus: "PENDING" | "PAID" | "CANCELLED") => {
    if (confirm(`Bạn có chắc muốn chuyển trạng thái đơn hàng này thành ${newStatus}?`)) {
      setLoading(true);
      await updateOrderStatus(orderId, newStatus);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xoá vĩnh viễn đơn hàng này? Thao tác này không thể hoàn tác!")) {
      setLoading(true);
      const result = await deleteOrderAction(orderId);
      if (result.error) {
        alert(result.error);
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
  }

  return (
    <div className="flex gap-2 items-center">
      {status === "PENDING" ? (
        <>
          <button 
            onClick={() => handleUpdate("PAID")}
            title="Xác nhận Đã thanh toán"
            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleUpdate("CANCELLED")}
            title="Hủy đơn hàng"
            className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        <span className={`whitespace-nowrap px-2 py-1 rounded-full text-xs font-medium mr-2 ${
          status === "PAID" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
        }`}>
          {status === "PAID" ? "Đã xác nhận" : "Đã hủy"}
        </span>
      )}
      
      <div className="h-6 w-px bg-slate-200 mx-1"></div>
      
      <button 
        onClick={handleDelete}
        title="Xoá vĩnh viễn đơn hàng"
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
