"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitContactMessage } from "@/app/actions/contact";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const result = await submitContactMessage(formData);

    if (result.error) {
      setErrorMessage(result.error);
      setStatus("error");
    } else {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {status === "success" && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Gửi thành công!</h4>
            <p className="text-sm mt-1">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
          </div>
        </div>
      )}
      
      {status === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Gửi thất bại</h4>
            <p className="text-sm mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Họ và tên</label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            placeholder="Nhập họ tên của bạn"
            required
            disabled={status === "loading"}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email liên hệ</label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            placeholder="example@gmail.com"
            required
            disabled={status === "loading"}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Chủ đề</label>
        <input
          type="text"
          id="subject"
          name="subject"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
          placeholder="Bạn cần hỗ trợ vấn đề gì?"
          required
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Nội dung tin nhắn</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
          placeholder="Nhập nội dung chi tiết..."
          required
          disabled={status === "loading"}
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Đang gửi..." : "Gửi tin nhắn"} <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
