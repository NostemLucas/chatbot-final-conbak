import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { AudioProvider } from "../providers/AudioProvider";

import "./globals.css";
export const metadata: Metadata = {
  title: "App Yasta - Educación Financiera",
  description: "Created with love",
  generator: "app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AudioProvider>{children}</AudioProvider>
        <Analytics />
      </body>
    </html>
  );
}

