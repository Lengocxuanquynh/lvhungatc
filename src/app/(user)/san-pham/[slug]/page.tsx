import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Star, Download, RefreshCw, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import ProductImageGallery from "./ProductImageGallery";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
    include: { category: true }
  });

  if (!product || !product.published) {
    return notFound();
  }

  // Lấy danh sách ảnh, nếu không có ảnh dùng tạm ảnh mặc định
  const images = product.images.length > 0 ? product.images : [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb / Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Trở về trang chủ
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-2xl p-6 lg:p-10 border border-slate-200 shadow-sm">
        {/* Left Column: Image Gallery */}
        <div className="w-full">
          <ProductImageGallery images={images} alt={product.title} />
        </div>

        {/* Right Column: Product Details */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500 font-medium uppercase tracking-wider">
            {product.category?.name || "Sản phẩm"}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-sm text-slate-500 underline decoration-slate-300">128 Đánh giá</span>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
              Sẵn sàng tải xuống
            </span>
          </div>

          <div className="text-3xl font-bold text-blue-600 mb-8">
            ${product.price.toLocaleString("en-US")}
          </div>

          <p className="text-slate-600 text-lg leading-relaxed mb-8 whitespace-pre-wrap">
            {product.description || "Chưa có thông tin mô tả chi tiết cho sản phẩm này."}
          </p>

          <AddToCartButton 
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              image: images[0]
            }} 
          />

          {/* Features list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm mb-1">Tải xuống ngay lập tức</div>
                <div className="text-xs text-slate-500">Tải file về máy ngay sau khi thanh toán</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-full">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm mb-1">Cập nhật miễn phí</div>
                <div className="text-xs text-slate-500">Nhận bản cập nhật mới nhất trọn đời</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Mô phỏng) */}
      <div className="mt-16 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4">
          <Info className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900">Thông số kỹ thuật</h3>
        </div>
        <ul className="space-y-4 text-slate-600 text-sm lg:text-base max-w-2xl">
          <li className="flex border-b border-slate-100 pb-3"><span className="w-1/3 font-medium text-slate-900">Danh mục:</span> <span className="w-2/3">{product.category?.name || "Khác"}</span></li>
          <li className="flex border-b border-slate-100 pb-3"><span className="w-1/3 font-medium text-slate-900">Mã tham chiếu:</span> <span className="w-2/3 uppercase">{product.slug.split('-').pop()}</span></li>
          <li className="flex border-b border-slate-100 pb-3"><span className="w-1/3 font-medium text-slate-900">Hình thức nhận:</span> <span className="w-2/3">Link tải trực tiếp / Google Drive</span></li>
          <li className="flex border-b border-slate-100 pb-3"><span className="w-1/3 font-medium text-slate-900">Bản quyền:</span> <span className="w-2/3">Sử dụng vĩnh viễn</span></li>
        </ul>
      </div>
    </div>
  );
}
