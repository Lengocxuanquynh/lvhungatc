"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { error: "Vui lòng điền đầy đủ thông tin!" };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn:", error);
    return { error: "Đã xảy ra lỗi, vui lòng thử lại sau." };
  }
}
