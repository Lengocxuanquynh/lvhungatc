"use client";

import React, { useState } from "react";
import { useCart } from "@/store/useCart";
import { useRouter } from "next/navigation";
import { createOrder } from "@/app/actions/order";
import { Loader2, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart, updateQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const result = await createOrder({
      customerName: name,
      customerEmail: email,
      items: items.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity
      }))
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      clearCart();
      router.push(`/order/${result.orderId}`);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-slate-500 mb-8">Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Thanh toán đơn hàng</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Thông tin khách hàng</h2>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Họ và tên
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="Nhập họ tên của bạn"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email nhận file
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="example@gmail.com"
              />
              <p className="text-xs text-slate-500 mt-1">Vui lòng nhập đúng email để nhận thông tin đơn hàng.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl mt-6 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Đang xử lý..." : "Đặt hàng & Chuyển khoản"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Đơn hàng của bạn</h2>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill className="object-contain" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-2">{item.title}</h3>
                    <div className="text-sm font-medium text-slate-900 mt-1">
                      {item.price.toLocaleString("vi-VN")}đ
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-4 mt-6">
              <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{getCartTotal().toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
