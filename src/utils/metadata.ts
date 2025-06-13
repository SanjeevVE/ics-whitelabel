import type { Metadata } from "next";

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  twitterCard?: "summary" | "summary_large_image";
  twitterSite?: string;
  slug?: string;
}

export function generateMetadata({
  title = 'Event Management Platform',
  description = 'Join the community of runners, cyclists, and fitness enthusiasts across India. Discover and register for exciting upcoming events!',
  keywords = 'running, cycling, marathon, events, fitness, sports, India, registration',
  canonical,
  ogImage = '/img/ics/ics-sap-event-poster.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@novarace',
  slug,
}: MetaProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sap.icsevents.in';
  const canonicalUrl = canonical || `https://sap.icsevents.in`;
  
  const fullOgImage = `https://novarace.s3.amazonaws.com/Ics-Sap-Event-Poster-2025.jpg`;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    authors: [{ name: 'ICS Events' }],
    creator: 'ICS Events',
    publisher: 'ICS Events',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    
    openGraph: {
      title,
      description,
      type: ogType,
      url: canonicalUrl,
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: 'ICS Events',
      locale: 'en_IN',
    },
    
    twitter: {
      card: twitterCard,
      site: twitterSite,
      creator: '@icsevents',
      title,
      description,
      images: [fullOgImage],
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  return metadata;
}

