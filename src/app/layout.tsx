import "./globals.css";
import { ReactNode } from "react";
import { generateMetadata } from "@/utils/metadata";

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = generateMetadata({
  title: "Event Management Platform",
  description: "Join the community of runners, cyclists, and fitness enthusiasts across India. Discover and register for exciting upcoming events!",
  keywords: "running, cycling, marathon, events, fitness, sports, India, registration",
  ogImage: "/images/og-default.jpg",
  ogType: "website"
});

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}