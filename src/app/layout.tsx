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
      default: `${siteName} | Thư viện CAD & Công cụ Triển khai Nhanh`,
      template: `%s | ${siteName}`
    },
    description: "Khám phá các công cụ triển khai nhanh, thư viện CAD khổng lồ và bộ Lisp chuyên dụng giúp bạn tối ưu hóa 100% hiệu suất thiết kế.",
    keywords: ["thư viện cad", "khóa học autocad", "autocad m&e", "lisp cad", "thiết kế kiến trúc", "bản vẽ kỹ thuật"],
    authors: [{ name: siteName }],
    creator: siteName,
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: "https://lvhungatc.vercel.app",
      siteName: siteName,
      title: `${siteName} | Thư viện CAD & Công cụ Triển khai Nhanh`,
      description: "Khám phá các công cụ triển khai nhanh, thư viện CAD khổng lồ và bộ Lisp chuyên dụng giúp bạn tối ưu hóa 100% hiệu suất thiết kế.",
      images: [
        {
          url: settings.heroImage || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200", // architectural fallback image
          width: 1200,
          height: 630,
          alt: `${siteName} Banner`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} | Thư viện CAD & Công cụ Triển khai Nhanh`,
      description: "Khám phá các công cụ triển khai nhanh, thư viện CAD khổng lồ và bộ Lisp chuyên dụng giúp bạn tối ưu hóa 100% hiệu suất thiết kế.",
      images: [settings.heroImage || "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1200"],
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
