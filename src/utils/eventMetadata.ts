import { Metadata } from 'next';
import { getEventBySlug } from '@/lib/backendApis';
import { format } from 'date-fns';

interface CategoryDetail {
  amount: string;
  name?: string;
  description?: string;
  displayAmount?: string;
  minimumAge?: string;
  maximumAge?: string;
  distance?: string;
}

interface GiveAwayItem {
  name: string;
}

interface Event {
  eventName: string;
  slug: string;
  eventPicture: string;
  category?: CategoryDetail[];
  latitude: string;
  location: string;
  date?: string;
  description?: string;
  aboutEvent?: string;
  giveAway?: GiveAwayItem[];
  layout?: string;
  status?: string;
  tag?: string;
  orgEmail?: string;
  contactNum?: string;
}

export interface EventMetadataParams {
  event?: Event;
  slug?: string;
  isRegisterPage?: boolean;
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
}

async function getEventData(slug: string): Promise<Event | null> {
  try {
    const eventSlug = String(slug);
    console.log('Fetching event with slug:', eventSlug);

    const response = await getEventBySlug(eventSlug);
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching event data for metadata:', error);
    return null;
  }
}

export function formatEventDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime())
      ? format(date, 'MMMM dd, yyyy - EEEE')
      : dateString;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

function getMetaTitle(
  event: Event | null,
  isRegisterPage = false,
  customTitle?: string
): string {
  if (customTitle) return customTitle;
  if (!event) return 'Event - SAP ICS Events';

  const suffix = isRegisterPage ? ' - Registration' : '';
  return `${event.eventName}${suffix} - ICS Events`;
}

function getMetaDescription(
  event: Event | null,
  isRegisterPage = false,
  customDescription?: string
): string {
  if (customDescription) return customDescription;
  if (!event) return 'Join exciting running events.';

  const eventDate = event.date ? ` on ${formatEventDate(event.date)}` : '';
  const location = event.location ? ` in ${event.location}` : '';

  if (isRegisterPage) {
    return `Register for ${event.eventName}${eventDate}${location}. Secure your spot in this exciting running and cycling event!`;
  }

  if (event.description) {
    const plainDescription = event.description
      .replace(/<[^>]*>/g, '')
      .substring(0, 160);
    return `${plainDescription}${plainDescription.length === 160 ? '...' : ''}`;
  }

  return `Join ${event.eventName}${eventDate}${location}. Register now for an exciting running and cycling experience!`;
}

function getMetaKeywords(event: Event | null): string {
  if (!event)
    return 'running, cycling, marathon, events, fitness, sports, India, registration';

  const keywords = [
    'running',
    'cycling',
    'marathon',
    'events',
    'fitness',
    'sports',
    'registration',
  ];

  if (event.location) {
    keywords.push(event.location.toLowerCase());
  }

  if (event.tag) {
    keywords.push(event.tag.toLowerCase());
  }

  if (event.category) {
    event.category.forEach((cat) => {
      if (cat.distance) {
        keywords.push(cat.distance.toLowerCase().replace(' ', ''));
      }
    });
  }

  return keywords.join(', ');
}

export function generateOgImageUrl(
  event: Event | null,
  baseUrl: string,
  customImage?: string
): string {
  let imageUrl =
    customImage ||
    (event?.eventPicture && !event.eventPicture.startsWith('http')
      ? `${baseUrl}${event.eventPicture}`
      : event?.eventPicture ||
        `${baseUrl}/img/ics/ics-sap-event-poster.jpg`);

  return imageUrl;
}

export async function generateMetadata(
  params: EventMetadataParams
): Promise<Metadata> {
  try {
    let event = params.event;
    if (!event && params.slug) {
      event = (await getEventData(params.slug)) || undefined;
    }

    const isRegisterPage = params.isRegisterPage || false;
    const title = getMetaTitle(
      event || null,
      isRegisterPage,
      params.customTitle
    );
    const description = getMetaDescription(
      event || null,
      isRegisterPage,
      params.customDescription
    );
    const keywords = getMetaKeywords(event || null);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://sap.icsevents.in';
    const canonicalUrl = `${baseUrl}${event?.slug ? `/${event.slug}` : ''}`;

    const imageUrl = generateOgImageUrl(
      event || null,
      baseUrl,
      params.customImage
    );

    const jsonLd = event
      ? {
          '@context': 'https://schema.org',
          '@type': 'SportsEvent',
          name: event.eventName,
          description: event.description || event.aboutEvent || description,
          startDate: event.date ? new Date(event.date).toISOString() : '',
          location: {
            '@type': 'Place',
            name: event.location,
            address: {
              '@type': 'PostalAddress',
              addressLocality: event.location,
            },
          },
          image: imageUrl,
          organizer: {
            '@type': 'Organization',
            name: 'SAP ICS Events',
            email: event.orgEmail || '',
            telephone: event.contactNum || '',
          },
          offers:
            event.category?.map((cat) => ({
              '@type': 'Offer',
              name: cat.name || '',
              price: cat.amount || '',
              priceCurrency: 'INR',
              description: cat.description || '',
            })) || [],
        }
      : null;

    return {
      title,
      description,
      keywords,
      authors: [{ name: 'SAP ICS Events' }],
      creator: 'SAP ICS Events',
      publisher: 'SAP ICS Events',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      openGraph: {
        title,
        description,
        type: 'website',
        url: canonicalUrl || undefined,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: event?.eventName || 'SAP ICS Events',
          },
        ],
        siteName: 'SAP ICS Events',
        locale: 'en_IN',
      },
      twitter: {
        card: 'summary_large_image',
        site: '@icsevents',
        creator: '@icsevents',
        title,
        description,
        images: [imageUrl],
      },
      alternates: canonicalUrl
        ? {
            canonical: canonicalUrl,
          }
        : undefined,
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
      other: event
        ? {
            'event-type': 'sports-event',
            'event:start_time': event.date
              ? new Date(event.date).toISOString()
              : '',
            'event:location': event.location || '',
            'geo.region': 'IN',
            'geo.placename': event.location || '',
          }
        : undefined,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);

    return {
      title: 'Event - Running Events',
      description: 'Join exciting running events.',
      keywords:
        'running, cycling, marathon, events, fitness, sports, India, registration',
    };
  }
}

export async function generateEventMetadata(
  { params }: { params: { slug: string } },
  isRegisterPage = false
): Promise<Metadata> {
  return generateMetadata({
    slug: params.slug,
    isRegisterPage,
  });
}
