import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "./actions/settings";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.siteName;

  return {
    title: {
      default: `${siteName} | Hàng Hiệu Chính Hãng`,
      template: `%s | ${siteName}`
    },
    description: "Trải nghiệm mua sắm trực tuyến hàng đầu với các sản phẩm thời trang, công nghệ và phụ kiện cao cấp chính hãng.",
    keywords: ["thời trang cao cấp", "đồ công nghệ", "phụ kiện", "mua sắm trực tuyến", "hàng hiệu"],
    authors: [{ name: siteName }],
    creator: siteName,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: "https://lvhungatc.com",
      siteName: siteName,
      title: `${siteName} | Mua Sắm Hàng Hiệu Đẳng Cấp`,
      description: "Nơi tôn vinh phong cách cá nhân của bạn với những bộ sưu tập thời thượng nhất.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200",
          width: 1200,
          height: 630,
          alt: `${siteName} Banner`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Mua Sắm Hàng Hiệu Đẳng Cấp`,
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${plusJakartaSans.className} antialiased`}>{children}</body>
    </html>
  );
}
