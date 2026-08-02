import React from "react";
import { prisma } from "@/lib/prisma";
import { MessageSquare, Check, Mail } from "lucide-react";

export const metadata = {
  title: "Tin nhắn Liên hệ | Quản trị",
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tin nhắn Liên hệ</h1>
          <p className="text-slate-500 mt-1">Quản lý các tin nhắn được gửi từ khách hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Chưa có tin nhắn nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-6 transition-colors ${msg.isRead ? "bg-white" : "bg-blue-50/50"}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-lg ${msg.isRead ? "font-semibold text-slate-700" : "font-bold text-slate-900"}`}>
                      {msg.name}
                    </h3>
                    {!msg.isRead && (
                      <span className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                        Mới
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-slate-500 font-medium">
                    {new Date(msg.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {msg.email}</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-2">CĐ: {msg.subject}</h4>
                  <p className="text-slate-700 whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
