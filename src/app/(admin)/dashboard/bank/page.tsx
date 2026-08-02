import React from "react";
import BankSettingsForm from "./BankSettingsForm";
import { getSiteSettings } from "@/app/actions/settings";

export const metadata = {
  title: "Thông tin thanh toán | Admin",
  description: "Cài đặt thông tin tài khoản ngân hàng và mã QR",
};

export default async function BankSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Cài đặt Thanh toán</h1>
      </div>
      
      <BankSettingsForm initialData={settings} />
    </div>
  );
}
