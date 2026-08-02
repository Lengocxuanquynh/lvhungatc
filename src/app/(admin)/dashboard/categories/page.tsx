import React from "react";
import { getCategories } from "@/app/actions/product";
import CategoryListClient from "./CategoryListClient";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Phân loại (Danh mục)</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý các danh mục sản phẩm trong hệ thống</p>
        </div>
      </div>

      <CategoryListClient categories={categories} />
    </div>
  );
}
