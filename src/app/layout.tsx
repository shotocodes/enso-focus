import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "ENSO FOCUS",
  description: "Focus is the ultimate productivity. Build deep concentration habits with the Pomodoro Technique.",
  openGraph: {
    title: "ENSO FOCUS",
    description: "円相：集中する時間を作る",
    siteName: "ENSO FOCUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ENSO FOCUS",
    description: "円相：集中する時間を作る",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ENSO",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
