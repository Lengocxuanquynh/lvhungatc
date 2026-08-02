"use client";

import React, { useState } from "react";
import { updateSiteSettingsAction } from "@/app/actions/settings";
import { Loader2, CheckCircle2, Upload } from "lucide-react";

export default function BankSettingsForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(initialData.bankQrCode || null);

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (!initialData.bankQrCode) {
      setQrPreview(null);
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

      {/* Hidden inputs to preserve other settings */}
      <input type="hidden" name="siteName" value={initialData?.siteName || "LVHUNGATC"} />
      <input type="hidden" name="primaryColor" value={initialData?.primaryColor || "#2563eb"} />
      <input type="hidden" name="contactEmail" value={initialData?.contactEmail || ""} />
      <input type="hidden" name="contactPhone" value={initialData?.contactPhone || ""} />
      <input type="hidden" name="contactAddress" value={initialData?.contactAddress || ""} />

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Cập nhật thông tin thanh toán thành công!
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-slate-900 mb-4">Thông tin Thanh toán (Chuyển khoản)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên Ngân hàng
              </label>
              <input
                name="bankName"
                type="text"
                defaultValue={initialData.bankName || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="VD: Vietcombank"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Số tài khoản
              </label>
              <input
                name="bankAccountNumber"
                type="text"
                defaultValue={initialData.bankAccountNumber || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="VD: 0123456789"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tên chủ tài khoản
              </label>
              <input
                name="bankAccountName"
                type="text"
                defaultValue={initialData.bankAccountName || ""}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="VD: NGUYEN VAN A"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mã QR Thanh toán
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 px-6 py-6">
              <div className="text-center">
                {qrPreview ? (
                  <div className="relative w-full max-w-[200px] mx-auto">
                    <img src={qrPreview} alt="QR Preview" className="mx-auto h-40 object-contain rounded-lg" />
                    <label htmlFor="qr-upload" className="mt-4 cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-500 font-medium">
                      Thay đổi ảnh QR
                    </label>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                      <label
                        htmlFor="qr-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                      >
                        <span>Tải ảnh QR lên</span>
                      </label>
                    </div>
                    <p className="text-xs leading-5 text-slate-500 mt-1">PNG, JPG, tối đa 5MB</p>
                  </>
                )}
                <input id="qr-upload" name="bankQrCode" type="file" accept="image/*" className="sr-only" onChange={handleQrChange} />
              </div>
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
