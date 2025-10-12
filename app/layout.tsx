import { Inter } from "next/font/google";
import "./globals.css";

import SearchBar from "@/components/search-bar.tsx";

const font_header = Inter({
  variable: "--font-header",
  subsets: ["latin"],
  weight: "variable",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-black ${font_header.variable} antialiased`}
      >
        <SearchBar />
        {children}
      </body>
    </html>
  );
}
