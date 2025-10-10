import { Inter } from "next/font/google";
import "./globals.css";

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
        className={`${font_header.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
