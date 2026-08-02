import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

import { getSiteSettings } from "@/app/actions/settings";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Liên hệ | LVHUNGATC",
  description: "Trang liên hệ của chúng tôi",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Liên hệ với chúng tôi</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Nếu bạn có bất kỳ câu hỏi nào về thư viện CAD, lisp CAD hay các khóa học, đừng ngần ngại liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Thông tin liên hệ</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Địa chỉ</h4>
                  <p className="text-slate-600 text-sm mt-1">
                    {settings.contactAddress || "Chưa cập nhật địa chỉ"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Điện thoại</h4>
                  <p className="text-slate-600 text-sm mt-1">
                    <a href={`tel:${settings.contactPhone}`} className="hover:text-blue-600 transition-colors">
                      {settings.contactPhone || "Chưa cập nhật SĐT"}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Email</h4>
                  <p className="text-slate-600 text-sm mt-1">
                    <a href={`mailto:${settings.contactEmail}`} className="hover:text-blue-600 transition-colors">
                      {settings.contactEmail || "Chưa cập nhật Email"}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Gửi tin nhắn cho chúng tôi</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
