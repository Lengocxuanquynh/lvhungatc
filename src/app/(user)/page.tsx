import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

import { getSiteSettings } from "@/app/actions/settings";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const settings = await getSiteSettings();
  const heroImage = settings.heroImage || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000";

  // Fetch real products from database
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 8
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="flex flex-col gap-16 pb-16 bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] bg-slate-50 overflow-hidden">
        {/* Light gradient for hero background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-0" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 z-0" 
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        
        <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center items-start md:items-end text-left md:text-right">
          <div className="max-w-2xl p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-100 shadow-xl">
            <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-2">Bộ Sưu Tập Mới</h2>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
              NÂNG TẦM <br /> PHONG CÁCH
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-md ml-auto">
              Trải nghiệm sự kết hợp hoàn hảo giữa thiết kế thời trang cao cấp và công nghệ hiện đại.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors">
              MUA SẮM NGAY
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-8 text-slate-900">DANH MỤC SẢN PHẨM</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/san-pham?category=${cat.slug}`} className="group relative h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 hover:border-blue-400 transition-colors">
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-xl font-bold tracking-wider text-slate-800 uppercase group-hover:text-blue-600 group-hover:scale-105 transition-all">{cat.name}</span>
              </div>
            </Link>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-500">
              Chưa có danh mục nào.
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-slate-900">SẢN PHẨM NỔI BẬT</h3>
          <Link href="/san-pham" className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">
            Tất cả sản phẩm &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/san-pham/${product.slug}`} key={product.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col group hover:shadow-xl transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">Mới</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
              </div>
              
              <div className="relative w-full h-56 mb-6 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <Image 
                  src={product.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"} 
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="mt-auto">
                <h4 className="font-bold text-lg mb-1 text-slate-900 line-clamp-1">{product.title}</h4>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description || "Chưa có mô tả"}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xl text-slate-900">${product.price.toLocaleString("en-US")}</span>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-full transition-colors">
                    THÊM VÀO GIỎ
                  </button>
                </div>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              Chưa có sản phẩm nào được đăng bán.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
