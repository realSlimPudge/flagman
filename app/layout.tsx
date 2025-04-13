import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/widgets/NavBar";
import { ClientUserIcon } from "@/widgets/ClientUserIcon";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flagman Docx",
  description: "Менеджер документов Flagman",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <ClientUserIcon />
        <main className="min-h-screen max-w-screen  bg-gray-100">
          {children}
        </main>
        <NavBar />
      </body>
    </html>
  );
}
