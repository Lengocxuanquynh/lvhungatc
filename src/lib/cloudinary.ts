import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(fileBase64: string, folder: string = "modern-ecommerce/products") {
  try {
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder,
      resource_type: "image",
    });
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error(`Failed to upload image to Cloudinary: ${(error as any).message || JSON.stringify(error)}`);
  }
}

export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
}

export default cloudinary;
