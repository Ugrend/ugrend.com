import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";
const inter = Montserrat({ style: "normal", weight: "400", subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Ugrend Starlight",
  description: "meow meow meow meow meow meow meow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
