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
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@novarace',
  slug,
}: MetaProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.novarace.in/';
  const canonicalUrl = canonical || `${baseUrl}${slug ? `/${slug}` : ''}`;
  
  const fullOgImage = ogImage.startsWith('http') 
    ? ogImage 
    : `${baseUrl}${ogImage}`;

  return {
    title,
    description,
    keywords,
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
    },
    
    twitter: {
      card: twitterCard,
      site: twitterSite,
      title,
      description,
      images: [fullOgImage],
    },
  };
}

