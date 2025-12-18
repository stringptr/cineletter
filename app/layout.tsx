import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "DBMSATRIA",
  description: "Website project by Satria and Vio for Movies & Tv-Shows Database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased font-sans`}>
        {/* Navbar di semua halaman */}
        <Navbar />

        {/* Halaman utama (Home, Movies, TV-Show, dll) */}
        <main className="min-h-screen pt-20 bg-gradient-to-b from-[#050621] to-[#0b0c40]">
          {children}
        </main>

        {/* Footer di semua halaman */}
        <Footer />
      </body>
    </html>
  );
}