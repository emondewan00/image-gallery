import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Toaster } from "react-hot-toast";
import ResponsiveAppBar from "@/components/Header";
import { SearchProvider } from "@/provider/SearchProvider";
import { ImageGalleryProvider } from "@/provider/ImageGalleryContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Image Gallery",
  description:
    "Explore and share your favorite images with our interactive gallery. Filter, search, and enjoy a seamless visual experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SearchProvider>
          <ImageGalleryProvider>
            <AppRouterCacheProvider>
              <div className="container mx-auto relative">
                <ResponsiveAppBar />
                {children}
              </div>
            </AppRouterCacheProvider>
          </ImageGalleryProvider>
        </SearchProvider>
        <Toaster />
      </body>
    </html>
  );
}
