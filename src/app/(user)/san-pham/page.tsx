import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const metadata = {
  title: "Sản phẩm | LVHUNGATC",
  description: "Danh sách sản phẩm, thư viện CAD, lisp CAD",
};

export default async function ProductsPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";

  const products = await prisma.product.findMany({
    where: {
      published: true,
      ...(q ? {
        title: {
          contains: q,
          mode: "insensitive"
        }
      } : {})
    },
    orderBy: { createdAt: "desc" },
    include: { category: true }
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">
          {q ? `Kết quả tìm kiếm cho: "${q}"` : "Tất cả sản phẩm"}
        </h1>
        <p className="text-slate-500 mt-2">
          {products.length} sản phẩm được tìm thấy
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
          <Link href="/san-pham" className="mt-4 inline-block text-blue-600 hover:underline font-medium">
            Xem tất cả sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/san-pham/${product.slug}`} className="group relative block bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                <Image
                  src={product.images[0] || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.discountPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Giảm giá
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wider">{product.category.name}</div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                  {product.title}
                </h3>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div>
                    {product.discountPrice ? (
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-400 line-through">
                          {product.price.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="text-lg font-bold text-red-600">
                          {product.discountPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-slate-900">
                        {product.price.toLocaleString("vi-VN")}đ
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
