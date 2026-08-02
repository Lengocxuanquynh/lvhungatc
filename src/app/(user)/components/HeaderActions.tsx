"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";

export default function HeaderActions() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  
  // Lấy số lượng từ giỏ hàng (Zustand)
  const items = useCart((state) => state.items);
  // Chỉ tính số lượng sản phẩm duy nhất (hoặc tổng quantity nếu muốn)
  const cartCount = items.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/san-pham?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="flex items-center gap-6 text-slate-600">
      {/* Search Toggle */}
      {isSearchOpen ? (
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            autoFocus
            className="w-48 pl-3 pr-8 py-1 text-sm border border-slate-300 rounded-full focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          />
          <button 
            type="button" 
            onClick={() => setIsSearchOpen(false)}
            className="absolute right-2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="hover:text-blue-600 transition-colors" 
          aria-label="Tìm kiếm"
        >
          <Search className="w-5 h-5" />
        </button>
      )}
      
      {/* Cart Link */}
      <Link href="/checkout" className="hover:text-blue-600 transition-colors relative" aria-label="Giỏ hàng">
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  );
}
