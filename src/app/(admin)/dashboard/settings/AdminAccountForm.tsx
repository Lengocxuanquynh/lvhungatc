"use client";

import React, { useState } from "react";
import { updateAdminAccountAction } from "@/app/actions/auth";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AdminAccountForm({ adminEmail }: { adminEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await updateAdminAccountAction(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      // Giữ thông báo success 3s
      setTimeout(() => setSuccess(false), 3000);
      
      // Xoá trắng trường mật khẩu
      const form = e.target as HTMLFormElement;
      form.password.value = "";
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 mt-8">
      <div className="border-b border-slate-200 pb-4 mb-4">
        <h3 className="text-lg font-medium text-slate-900">Tài khoản quản trị</h3>
        <p className="text-sm text-slate-500 mt-1">Đổi email đăng nhập và mật khẩu của trang quản trị</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Cập nhật tài khoản quản trị thành công!
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Địa chỉ Email
          </label>
          <input
            name="email"
            type="email"
            required
            defaultValue={adminEmail}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            placeholder="admin@lvhungatc"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mật khẩu
          </label>
          <input
            name="password"
            type="password"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            placeholder="Bỏ trống nếu không muốn đổi"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-70"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Đang lưu..." : "Cập nhật tài khoản"}
        </button>
      </div>
    </form>
  );
}
