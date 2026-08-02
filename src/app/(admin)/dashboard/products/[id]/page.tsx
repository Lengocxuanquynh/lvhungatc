import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import EditProductForm from "./EditProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/products" className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chỉnh sửa sản phẩm</h1>
          <p className="text-sm text-slate-500 mt-1">Cập nhật thông tin cho sản phẩm: {product.title}</p>
        </div>
      </div>

      <EditProductForm product={product} />
    </div>
  );
}
