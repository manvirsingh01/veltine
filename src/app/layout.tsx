import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import MusicPlayer from "@/components/MusicPlayer";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Will You Be My Valentine? 💝",
  description: "A special Valentine's Day message for you 💕",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}
