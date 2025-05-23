import { ReactNode } from "react";
import { generateMetadata } from "../../utils/metadata";

export const metadata = generateMetadata({
  title: "Upcoming Events",
  description: "Discover and register for exciting running and cycling events across India. Join our community of fitness enthusiasts!",
  keywords: "running events, cycling events, marathon, fitness events, sports registration, India",
  slug: "events",
  ogImage: "/images/og-events.jpg",
  ogType: "website"
});

export default function EventsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}