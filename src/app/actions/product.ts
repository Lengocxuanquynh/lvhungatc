"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { uploadImage } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

async function getAdminId() {
  const cookieStore = await cookies();
  const adminId = cookieStore.get("admin_session")?.value;
  if (!adminId) throw new Error("Chưa đăng nhập quyền quản trị");
  return adminId;
}

export async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Lỗi lấy danh mục:", error);
    return [];
  }
}

export async function createProductAction(formData: FormData) {
  try {
    const adminId = await getAdminId();
    
    const categoryName = (formData.get("categoryName") as string) || "Khác";
    const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || "khac";

    let category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          slug: categorySlug
        }
      });
    }

    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = (formData.get("description") as string) || "";
    const downloadUrl = (formData.get("downloadUrl") as string) || null;
    
    // Create slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    // Xử lý upload ảnh
    const imageFiles = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    for (const file of imageFiles) {
      if (file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
        const result = await uploadImage(base64);
        imageUrls.push(result.url);
      }
    }

    await prisma.product.create({
      data: {
        title,
        slug,
        price,
        description,
        downloadUrl,
        images: imageUrls,
        published: true,
        authorId: adminId,
        categoryId: category.id
      }
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi tạo sản phẩm:", error);
    return { error: error.message || "Không thể tạo sản phẩm" };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    await getAdminId();
    
    const title = formData.get("title") as string;
    const price = parseFloat(formData.get("price") as string);
    const description = (formData.get("description") as string) || "";
    const downloadUrl = (formData.get("downloadUrl") as string) || null;
    
    // Kiểm tra xem có update ảnh mới không
    const imageFiles = formData.getAll("images") as File[];
    const newImageUrls: string[] = [];
    
    for (const file of imageFiles) {
      if (file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
        const result = await uploadImage(base64);
        newImageUrls.push(result.url);
      }
    }

    const updateData: any = {
      title,
      price,
      description,
      downloadUrl
    };

    if (newImageUrls.length > 0) {
      updateData.images = newImageUrls;
    }

    const categoryName = formData.get("categoryName") as string;
    if (categoryName) {
      const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || "khac";
      let category = await prisma.category.findUnique({
        where: { slug: categorySlug }
      });
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
            slug: categorySlug
          }
        });
      }
      updateData.categoryId = category.id;
    }

    await prisma.product.update({
      where: { id },
      data: updateData
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi cập nhật sản phẩm:", error);
    return { error: error.message || "Không thể cập nhật sản phẩm" };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await getAdminId(); // Ensure admin
    
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id }
    });
    
    if (orderItemsCount > 0) {
      return { error: `Không thể xoá sản phẩm này vì nó đã được đặt mua trong ${orderItemsCount} đơn hàng.` };
    }

    await prisma.product.delete({
      where: { id }
    });
    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi xoá sản phẩm:", error);
    return { error: "Không thể xoá sản phẩm do lỗi hệ thống" };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await getAdminId();
    
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return { error: `Không thể xoá danh mục đang có ${productsCount} sản phẩm` };
    }

    await prisma.category.delete({
      where: { id }
    });
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi xoá danh mục:", error);
    return { error: "Không thể xoá danh mục" };
  }
}

export async function createCategoryAction(formData: FormData) {
  try {
    await getAdminId();
    const name = formData.get("name") as string;
    if (!name) return { error: "Tên danh mục không được để trống" };
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
    await prisma.category.create({
      data: { name, slug }
    });
    
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error: any) {
    return { error: "Lỗi khi tạo danh mục" };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  try {
    await getAdminId();
    const name = formData.get("name") as string;
    if (!name) return { error: "Tên danh mục không được để trống" };
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
    await prisma.category.update({
      where: { id },
      data: { name, slug }
    });
    
    revalidatePath("/dashboard/categories");
    return { success: true };
  } catch (error: any) {
    return { error: "Lỗi khi cập nhật danh mục" };
  }
}

