"use client";

import React, { useState } from "react";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    image?: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const addItem = useCart((state) => state.addItem);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = () => {
    addItem({ ...product, quantity: 1 });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({ ...product, quantity: 1 });
    router.push("/checkout");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-slate-100 pt-8">
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 px-8 rounded-full transition-colors flex items-center justify-center gap-3 shadow-lg shadow-blue-200"
        >
          <ShoppingCart className="w-6 h-6" /> Thêm vào giỏ hàng
        </button>
        <button 
          onClick={handleBuyNow}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-4 px-8 rounded-full transition-colors shadow-lg shadow-slate-200"
        >
          Mua ngay
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="font-medium">Đã thêm vào giỏ hàng</span>
          </div>
        </div>
      )}
    </>
  );
}
