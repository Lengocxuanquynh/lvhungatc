"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  items: {
    id: string;
    price: number;
    quantity: number;
  }[];
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const { customerName, customerEmail, items } = input;

    if (!items || items.length === 0) {
      throw new Error("Giỏ hàng trống.");
    }

    let finalCustomerEmail = customerEmail;
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value || cookieStore.get("admin_session")?.value;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });
      if (user) {
        finalCustomerEmail = user.email;
      }
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail: finalCustomerEmail,
        totalAmount,
        status: "PENDING",
        items: {
          create: items.map(item => ({
            productId: item.id,
            price: item.price,
            quantity: item.quantity
          }))
        }
      }
    });

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Lỗi tạo đơn hàng:", error);
    return { error: error.message || "Đã xảy ra lỗi khi tạo đơn hàng." };
  }
}

export async function updateOrderStatus(orderId: string, status: "PENDING" | "PAID" | "CANCELLED") {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath("/dashboard/orders");
    revalidatePath(`/order/${orderId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi cập nhật đơn hàng:", error);
    return { error: "Không thể cập nhật đơn hàng" };
  }
}
