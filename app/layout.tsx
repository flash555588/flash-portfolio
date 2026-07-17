import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Flash — AI × 3D Developer | Lolihost";
const description = "Flash 的个人作品集：探索 AI、3D、工程自动化与开源实验，记录从创意原型到可用工具的实践。";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host");
  const protocol = incoming.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  const base = new URL(host ? `${protocol}://${host}` : "https://lolihost.cn");
  return {
    metadataBase: base,
    title,
    description,
    authors: [{ name: "Flash", url: "https://lolihost.cn" }],
    alternates: { canonical: "/" },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title,
      description,
      siteName: "Flash Portfolio",
      locale: "zh_CN",
      type: "website",
      url: base,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
