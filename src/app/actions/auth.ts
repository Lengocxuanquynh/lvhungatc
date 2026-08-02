"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vui lòng nhập đủ email và mật khẩu!" };
  }

  // Tự động tạo user admin nếu chưa tồn tại
  const adminEmail = "admin@lvhungatc";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: "Admin",
        role: "ADMIN"
      }
    });
  }

  // Tìm user trong database
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.password) {
    return { error: "Email hoặc mật khẩu không chính xác!" };
  }

  // Nếu là ADMIN, không cho đăng nhập ở trang User
  if (user.role === "ADMIN") {
    return { error: "Vui lòng đăng nhập tại trang Quản trị!" };
  }

  // Kiểm tra quyền và điều hướng
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (isMatch) {
    const cookieStore = await cookies();
    cookieStore.set("user_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    redirect("/");
  } else {
    return { error: "Email hoặc mật khẩu không chính xác!" };
  }
}

export async function adminLoginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vui lòng nhập đủ email và mật khẩu!" };
  }

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !user.password || user.role !== "ADMIN") {
    return { error: "Bạn không có quyền truy cập trang quản trị!" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  if (isMatch) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    redirect("/dashboard");
  } else {
    return { error: "Mật khẩu không chính xác!" };
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Vui lòng nhập đầy đủ thông tin!" };
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập!" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER",
    },
  });

  // Set user session cookie
  const cookieStore = await cookies();
  cookieStore.set("user_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/");
}

export async function googleLoginAction(token: string) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return { error: "Không thể lấy thông tin từ Google." };
    }

    const { email, name, picture } = payload;

    // Tìm hoặc tạo User
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || "User",
          image: picture || null,
          role: "USER",
        },
      });
    }

    // Đặt cookie cho khách hàng
    const cookieStore = await cookies();
    cookieStore.set("user_session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Lỗi đăng nhập Google:", error);
    return { error: "Xác thực Google thất bại!" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  cookieStore.delete("user_session");
  redirect("/dang-nhap");
}
