"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction, googleLoginAction } from "@/app/actions/auth";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    setLoading(true);
    setError(null);
    if (credentialResponse.credential) {
      const result = await googleLoginAction(credentialResponse.credential);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        router.push("/"); // Redirect to home on success
      }
    } else {
      setError("Đăng nhập Google thất bại!");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await registerAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Nếu thành công server action sẽ tự redirect
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Điền thông tin bên dưới để đăng ký
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Họ và tên
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Địa chỉ Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mật khẩu
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Hoặc đăng ký nhanh bằng</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 py-2">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Lỗi khi kết nối với Google")}
                shape="rectangular"
                theme="outline"
              />
            </div>
          </div>

          <div className="text-center mt-6 flex flex-col gap-3">
             <p className="text-sm text-slate-600">
                Đã có tài khoản?{" "}
                <Link href="/dang-nhap" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Đăng nhập
                </Link>
             </p>
             <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                &larr; Quay lại trang chủ
             </Link>
          </div>
        </div>
      </div>
    </div>
    </GoogleOAuthProvider>
  );
}
