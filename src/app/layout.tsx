import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "fin",
  description: "home assignment",
  icons: {
    icon: [
      { url: "/favicon2/favicon.ico", sizes: "48x48" },
      { url: "/favicon2/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon2/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: { url: "/favicon2/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/favicon2/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={rubik.variable}>
      <body>{children}</body>
    </html>
  );
}
