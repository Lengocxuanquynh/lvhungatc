import React from "react";
import { getSiteSettings } from "@/app/actions/settings";
import SettingsForm from "./SettingsForm";
import AdminAccountForm from "./AdminAccountForm";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function SettingsPage() {
  const settings = await getSiteSettings();
  
  const cookieStore = await cookies();
  const adminId = cookieStore.get("admin_session")?.value;
  
  let adminEmail = "";
  if (adminId) {
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { email: true }
    });
    if (admin) {
      adminEmail = admin.email;
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Cài đặt hệ thống</h1>
        <p className="text-sm text-slate-500 mt-1">Tuỳ chỉnh thông tin và tên hiển thị của toàn bộ trang web</p>
      </div>

      <SettingsForm initialData={settings} />
      
      {adminEmail && (
        <AdminAccountForm adminEmail={adminEmail} />
      )}
    </div>
  );
}
