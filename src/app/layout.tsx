import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_URL ?? "https://neurolearn.ai"
  ),
  title: {
    default: "NeuroLearn AI | Discover Why Students Struggle",
    template: "%s | NeuroLearn AI",
  },
  description:
    "NeuroLearn AI uses artificial intelligence to identify student misconceptions and guide deeper understanding.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    siteName: "NeuroLearn AI",
    title: "NeuroLearn AI | Discover Why Students Struggle",
    description:
      "NeuroLearn AI uses artificial intelligence to identify student misconceptions and guide deeper understanding.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NeuroLearn AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuroLearn AI | Discover Why Students Struggle",
    description:
      "AI-powered diagnostic learning that identifies why students struggle and guides deeper understanding.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a1a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-neuro-950 text-white antialiased font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
