"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/cloudinary";

export async function getSiteSettings() {
  try {
    const settings = await prisma.siteConfig.findUnique({
      where: { id: "global" }
    });
    
    if (!settings) {
      return await prisma.siteConfig.create({
        data: {
          id: "global",
          siteName: "LVHUNGATC",
          primaryColor: "#2563eb",
          heroImage: null,
          contactEmail: "support@lvhungatc.com",
          contactPhone: "0123 456 789",
          contactAddress: "123 Đường ABC, Quận XYZ, TP.HCM",
          bankName: "Vietcombank",
          bankAccountNumber: "0123456789",
          bankAccountName: "LE VAN HUNG",
          bankQrCode: null
        }
      });
    }
    
    return settings;
  } catch (error) {
    console.error("Lỗi lấy cấu hình:", error);
    return {
      siteName: "LVHUNGATC",
      primaryColor: "#2563eb",
      heroImage: null,
      contactEmail: "support@lvhungatc.com",
      contactPhone: "0123 456 789",
      contactAddress: "123 Đường ABC, Quận XYZ, TP.HCM",
      bankName: "Vietcombank",
      bankAccountNumber: "0123456789",
      bankAccountName: "LE VAN HUNG",
      bankQrCode: null
    };
  }
}

export async function updateSiteSettingsAction(formData: FormData) {
  try {
    const existing = await prisma.siteConfig.findUnique({ where: { id: "global" } });
    
    const siteName = formData.get("siteName") as string;
    const primaryColor = (formData.get("primaryColor") as string) || existing?.primaryColor || "#2563eb";
    const contactEmail = formData.get("contactEmail") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const contactAddress = formData.get("contactAddress") as string;
    
    const bankName = formData.get("bankName") as string;
    const bankAccountNumber = formData.get("bankAccountNumber") as string;
    const bankAccountName = formData.get("bankAccountName") as string;
    
    let heroImage = existing?.heroImage || null;
    let bankQrCode = existing?.bankQrCode || null;

    if (!siteName) {
      return { error: "Vui lòng điền tên website" };
    }

    // Xử lý upload ảnh heroImage
    const file = formData.get("heroImage") as File;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      const result = await uploadImage(base64);
      heroImage = result.url;
    }
    
    // Xử lý upload ảnh bankQrCode
    const qrFile = formData.get("bankQrCode") as File;
    if (qrFile && qrFile.size > 0) {
      const arrayBuffer = await qrFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = `data:${qrFile.type};base64,${buffer.toString("base64")}`;
      const result = await uploadImage(base64);
      bankQrCode = result.url;
    }

    await prisma.siteConfig.upsert({
      where: { id: "global" },
      update: {
        siteName,
        primaryColor,
        heroImage,
        contactEmail,
        contactPhone,
        contactAddress,
        bankName,
        bankAccountNumber,
        bankAccountName,
        bankQrCode
      },
      create: {
        id: "global",
        siteName,
        primaryColor,
        heroImage,
        contactEmail,
        contactPhone,
        contactAddress,
        bankName,
        bankAccountNumber,
        bankAccountName,
        bankQrCode
      }
    });

    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi cập nhật cấu hình:", error);
    return { error: `Không thể lưu cài đặt. Lỗi: ${error?.message || JSON.stringify(error)}` };
  }
}
