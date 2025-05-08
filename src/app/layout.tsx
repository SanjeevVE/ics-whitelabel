// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "NovaRace",
  description: "Find and register for marathon events across India.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800">
        
        <main>{children}</main>

    
      </body>
    </html>
  );
}
