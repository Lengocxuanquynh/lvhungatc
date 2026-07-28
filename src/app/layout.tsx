import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "LUXE & CO. | Hàng Hiệu Chính Hãng",
    template: "%s | LUXE & CO."
  },
  description: "Trải nghiệm mua sắm trực tuyến hàng đầu với các sản phẩm thời trang, công nghệ và phụ kiện cao cấp chính hãng.",
  keywords: ["thời trang cao cấp", "đồ công nghệ", "phụ kiện", "mua sắm trực tuyến", "hàng hiệu"],
  authors: [{ name: "LUXE & CO." }],
  creator: "LUXE & CO.",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://modern-ecommerce.com",
    siteName: "LUXE & CO.",
    title: "LUXE & CO. | Mua Sắm Hàng Hiệu Đẳng Cấp",
    description: "Nơi tôn vinh phong cách cá nhân của bạn với những bộ sưu tập thời thượng nhất.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "LUXE & CO. Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUXE & CO. | Mua Sắm Hàng Hiệu Đẳng Cấp",
    description: "Nơi tôn vinh phong cách cá nhân của bạn với những bộ sưu tập thời thượng nhất.",
    images: ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
