"use client";

import React, { useState } from "react";
import { useCart } from "@/store/useCart";
import { CheckCircle2 } from "lucide-react";

interface HomeAddToCartButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    image?: string;
  };
}

export default function HomeAddToCartButton({ product }: HomeAddToCartButtonProps) {
  const addItem = useCart((state) => state.addItem);
  const [showToast, setShowToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Ngăn chặn sự kiện click lan ra Link cha
    e.stopPropagation(); 
    
    addItem({ ...product, quantity: 1 });
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <button 
        onClick={handleAddToCart}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors z-10 relative"
      >
        THÊM VÀO GIỎ
      </button>

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
