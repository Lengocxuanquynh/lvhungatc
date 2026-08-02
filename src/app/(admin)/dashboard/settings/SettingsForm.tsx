"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSettingsAction } from "@/app/actions/settings";
import { Loader2, CheckCircle2, Upload } from "lucide-react";

export default function SettingsForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData.heroImage || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (!initialData.heroImage) {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateSiteSettingsAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      router.refresh();
      // Giữ thông báo success 3s
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Cập nhật cài đặt thành công!
        </div>
      )}

      {/* Hidden inputs to preserve bank and other settings */}
      <input type="hidden" name="primaryColor" value={initialData?.primaryColor || "#2563eb"} />
      <input type="hidden" name="bankName" value={initialData?.bankName || ""} />
      <input type="hidden" name="bankAccountNumber" value={initialData?.bankAccountNumber || ""} />
      <input type="hidden" name="bankAccountName" value={initialData?.bankAccountName || ""} />
      {initialData?.bankQrCode && (
        <input type="hidden" name="bankQrCode" value={initialData.bankQrCode} />
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tên Website
          </label>
          <input
            name="siteName"
            type="text"
            required
            defaultValue={initialData.siteName}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            placeholder="VD: LVHUNGATC Shop"
          />
          <p className="text-xs text-slate-500 mt-1">Tên này sẽ xuất hiện ở tiêu đề trình duyệt (Title) và các logo trên trang.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Ảnh bìa trang chủ (Hero Image)
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-10">
            <div className="text-center">
              {imagePreview ? (
                <div className="relative w-full max-w-sm mx-auto">
                  <img src={imagePreview} alt="Preview" className="mx-auto h-48 object-cover rounded-lg" />
                  <label htmlFor="hero-upload" className="mt-4 cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 font-medium">
                    Thay đổi ảnh
                  </label>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                    <label
                      htmlFor="hero-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      <span>Tải ảnh lên</span>
                    </label>
                    <p className="pl-1">hoặc kéo thả vào đây</p>
                  </div>
                  <p className="text-xs leading-5 text-slate-500">PNG, JPG, up to 10MB (Khuyên dùng ảnh ngang lớn)</p>
                </>
              )}
              <input id="hero-upload" name="heroImage" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
            </div>
          </div>
        </div>
        <div className="pt-6 border-t border-slate-200">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Thông tin liên hệ</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                name="contactEmail"
                type="email"
                defaultValue={initialData.contactEmail || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="VD: support@lvhungatc.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Số điện thoại
              </label>
              <input
                name="contactPhone"
                type="text"
                defaultValue={initialData.contactPhone || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="VD: 0123 456 789"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Địa chỉ
              </label>
              <input
                name="contactAddress"
                type="text"
                defaultValue={initialData.contactAddress || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="VD: 123 Đường ABC..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </form>
  );
}
