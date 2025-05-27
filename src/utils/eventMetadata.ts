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

function formatEventDate(dateString: string): string {
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

function getMetaTitle(event: Event | null, isRegisterPage = false): string {
  if (!event) return 'Event - Running Events';

  const suffix = isRegisterPage ? ' - Registration' : '';
  return `${event.eventName}${suffix} - Running Events`;
}

function getMetaDescription(
  event: Event | null,
  isRegisterPage = false
): string {
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

export async function generateEventMetadata(
  { params }: { params: { slug: string } },
  isRegisterPage = false
): Promise<Metadata> {
  try {
    const slug = String(params.slug);
    const event = await getEventData(slug);

    const title = getMetaTitle(event, isRegisterPage);
    const description = getMetaDescription(event, isRegisterPage);
    const keywords = getMetaKeywords(event);

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || 'https://www.novarace.in';
    const canonicalUrl = isRegisterPage
      ? `${baseUrl}/events/${slug}/register`
      : `${baseUrl}/events/${slug}`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
        url: canonicalUrl,
        images: event?.eventPicture
          ? [
              {
                url: event.eventPicture,
                width: 1200,
                height: 630,
                alt: event.eventName || 'Event',
              },
            ]
          : [
              {
                url: `${baseUrl}/images/og-default.jpg`,
                width: 1200,
                height: 630,
                alt: 'Running Events',
              },
            ],
        siteName: 'NovaRace',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: event?.eventPicture
          ? [event.eventPicture]
          : [`${baseUrl}/images/og-default.jpg`],
      },
      alternates: {
        canonical: canonicalUrl,
      },
      other: {
        'event-type': 'sports-event',
        'event:start_time': event?.date
          ? new Date(event.date).toISOString()
          : '',
        'event:location': event?.location || '',
        'geo.region': 'IN',
        'geo.placename': event?.location || '',
      },
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