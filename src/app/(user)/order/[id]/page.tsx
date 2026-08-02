import React from "react";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock, Download, AlertCircle } from "lucide-react";

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const resolvedParams = await params;
  
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  });

  const siteConfig = await prisma.siteConfig.findUnique({
    where: { id: "global" }
  });

  if (!order) {
    return notFound();
  }

  const isPaid = order.status === "PAID";

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className={`p-8 text-center ${isPaid ? 'bg-green-50' : 'bg-blue-50'}`}>
          {isPaid ? (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Thanh toán thành công!</h1>
              <p className="text-slate-600">Cảm ơn bạn đã mua hàng. Link tải đã sẵn sàng bên dưới.</p>
            </>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Chờ thanh toán</h1>
              <p className="text-slate-600">Vui lòng chuyển khoản theo hướng dẫn bên dưới để nhận link tải.</p>
            </>
          )}
        </div>

        <div className="p-8">
          {/* Bank Transfer Instructions for PENDING */}
          {!isPaid && (
            <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" /> Hướng dẫn chuyển khoản
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Ngân hàng</p>
                  <p className="font-bold text-slate-900">{siteConfig?.bankName || "Đang cập nhật..."}</p>
                  
                  <p className="text-sm text-slate-500 mb-1 mt-4">Số tài khoản</p>
                  <p className="font-bold text-slate-900 text-lg">{siteConfig?.bankAccountNumber || "Đang cập nhật..."}</p>
                  
                  <p className="text-sm text-slate-500 mb-1 mt-4">Chủ tài khoản</p>
                  <p className="font-bold text-slate-900">{siteConfig?.bankAccountName || "Đang cập nhật..."}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-500 mb-1">Số tiền cần chuyển</p>
                  <p className="font-bold text-blue-600 text-2xl">${order.totalAmount.toLocaleString()}</p>
                  
                  <p className="text-sm text-slate-500 mb-1 mt-4">Nội dung chuyển khoản (Bắt buộc)</p>
                  <div className="bg-slate-100 p-3 rounded font-mono text-center text-lg font-bold text-slate-800 tracking-wider">
                    DH{order.id.slice(-6).toUpperCase()}
                  </div>
                  
                  {(siteConfig?.bankName && siteConfig?.bankAccountNumber) ? (
                    <div className="mt-6 text-center">
                      <p className="text-sm font-medium text-slate-700 mb-3">Hoặc quét mã QR (Đã tự động nhập số tiền)</p>
                      <img 
                        src={`https://img.vietqr.io/image/${siteConfig.bankName.replace(/\s+/g, '').toLowerCase()}-${siteConfig.bankAccountNumber}-compact2.png?amount=${order.totalAmount}&addInfo=DH${order.id.slice(-6).toUpperCase()}&accountName=${encodeURIComponent(siteConfig.bankAccountName || "")}`}
                        alt="Mã QR Thanh toán" 
                        className="mx-auto w-64 h-64 object-contain border border-slate-200 rounded-xl p-2 bg-white shadow-sm" 
                      />
                    </div>
                  ) : siteConfig?.bankQrCode ? (
                    <div className="mt-6 text-center">
                      <p className="text-sm font-medium text-slate-700 mb-3">Hoặc quét mã QR</p>
                      <img 
                        src={siteConfig.bankQrCode} 
                        alt="Mã QR Thanh toán" 
                        className="mx-auto w-64 h-64 object-contain border border-slate-200 rounded-xl p-2 bg-white shadow-sm" 
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-6 italic">
                * Sau khi chuyển khoản thành công, hệ thống sẽ tự động mở khóa link tải trong vòng 5-10 phút. Bạn vui lòng tải lại trang (F5) để kiểm tra.
              </p>
            </div>
          )}

          {/* Order Details & Download Links */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Chi tiết đơn hàng #{order.id.slice(-6).toUpperCase()}</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-slate-200 rounded-xl gap-4">
                  <div>
                    <h3 className="font-medium text-slate-900">{item.product.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">${item.price.toLocaleString()} x {item.quantity}</p>
                  </div>
                  
                  {isPaid ? (
                    item.product.downloadUrl ? (
                      <a 
                        href={item.product.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" /> Tải Xuống
                      </a>
                    ) : (
                      <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-md">Đang cập nhật link...</span>
                    )
                  ) : (
                    <span className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
                      Link bị khóa
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          &larr; Về trang chủ
        </Link>
      </div>
    </div>
  );
}
