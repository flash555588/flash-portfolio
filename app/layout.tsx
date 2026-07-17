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
const description = "Flash 的个人作品集，专注 AI、3D 与开发工具。";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host");
  const protocol = incoming.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");
  const base = new URL(host ? `${protocol}://${host}` : "https://www.lolihost.com");
  return {
    metadataBase: base,
    title,
    description,
    authors: [{ name: "Flash", url: "https://www.lolihost.com" }],
    alternates: { canonical: "/" },
    icons: { icon: "https://avatars.githubusercontent.com/u/65298061?v=4" },
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
