import "./globals.css";
import { ReactNode } from "react";
import { generateMetadata } from "@/utils/metadata";
import ThirdPartyScripts from '@/components/ThirdPartyScripts';

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata = generateMetadata({
  title: "SAP ICS Events - Event Management Platform",
  description: "Join the community of runners, cyclists, and fitness enthusiasts across India. Discover and register for exciting upcoming events!",
  keywords: "running, cycling, marathon, events, fitness, sports, India, registration",
  canonical: "https://sap.icsevents.in",
  ogType: "website"
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}