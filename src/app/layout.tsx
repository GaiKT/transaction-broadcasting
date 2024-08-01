import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Transaction application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
          {children}
          <Toaster />
        </body>
    </html>
  );
}
