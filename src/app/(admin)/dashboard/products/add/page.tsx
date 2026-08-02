"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProductAction, getCategories } from "@/app/actions/product";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  React.useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newPreviews: string[] = [];
      let loaded = 0;
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews[index] = reader.result as string;
          loaded += 1;
          if (loaded === files.length) {
            setImagePreviews(newPreviews);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setImagePreviews([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createProductAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/dashboard/products");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/products" className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-white border border-slate-200 rounded-lg shadow-sm">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thêm sản phẩm mới</h1>
          <p className="text-sm text-slate-500 mt-1">Điền thông tin bên dưới để tạo sản phẩm</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên sản phẩm
              </label>
              <input
                name="title"
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Giá (VNĐ)
                </label>
                <input
                  name="price"
                  type="number"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phân loại (Danh mục)
              </label>
              <select
                name="categoryName"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all bg-white"
              >
                <option value="">-- Chọn phân loại --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mô tả sản phẩm
              </label>
              <textarea
                name="description"
                rows={5}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                placeholder="Mô tả chi tiết về sản phẩm..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Link tải sản phẩm (Google Drive, v.v.)
              </label>
              <input
                name="downloadUrl"
                type="url"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="https://drive.google.com/..."
              />
              <p className="text-xs text-slate-500 mt-1">Link này sẽ được ẩn và chỉ hiện cho khách sau khi đã thanh toán đơn hàng.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hình ảnh sản phẩm
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10">
              <div className="text-center">
                {imagePreviews.length > 0 ? (
                  <div className="w-full">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="aspect-square relative rounded-lg overflow-hidden border border-slate-200">
                          <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 font-medium">
                      Thay đổi danh sách ảnh
                    </label>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                      >
                        <span>Tải ảnh lên</span>
                      </label>
                      <p className="pl-1">hoặc kéo thả vào đây</p>
                    </div>
                    <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF up to 10MB (Có thể chọn nhiều ảnh)</p>
                  </>
                )}
                <input id="file-upload" name="images" type="file" accept="image/*" multiple className="sr-only" onChange={handleImageChange} required={imagePreviews.length === 0} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
          <Link href="/dashboard/products" className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
            Hủy
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
