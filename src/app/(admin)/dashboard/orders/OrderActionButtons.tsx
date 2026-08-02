"use client";

import React, { useState } from "react";
import { updateOrderStatus } from "@/app/actions/order";
import { Check, X, Loader2 } from "lucide-react";

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

  if (loading) {
    return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
  }

  if (status === "PENDING") {
    return (
      <div className="flex gap-2">
        <button 
          onClick={() => handleUpdate("PAID")}
          title="Xác nhận Đã thanh toán"
          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
        >
          <Check className="w-5 h-5" />
        </button>
        <button 
          onClick={() => handleUpdate("CANCELLED")}
          title="Hủy đơn hàng"
          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      status === "PAID" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
    }`}>
      {status === "PAID" ? "Đã xác nhận" : "Đã hủy"}
    </span>
  );
}
