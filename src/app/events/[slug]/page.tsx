"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import RightSidebar from "@/components/event-landing-page/RightSidebar";

import Tshirt from "../../../../public/img/event-landing-page/tshirt.png";
import Medal from "../../../../public/img/event-landing-page/medal.png";
import Chip from "../../../../public/img/event-landing-page/chip.png";
import Gift from "../../../../public/img/event-landing-page/souvenir.png";
import Certificate from "../../../../public/img/event-landing-page/certificate.png";
import Hidrate from "../../../../public/img/event-landing-page/water.png";
import NonTimed from "../../../../public/img/event-landing-page/non-timed-bib.png";
import Breakfast from "../../../../public/img/event-landing-page/breakfast.png";
import Refreshments from "../../../../public/img/event-landing-page/refreshments.png";
import Certificate1 from "../../../../public/img/event-landing-page/certificate-1.png";
import Physio from "../../../../public/img/event-landing-page/physio.png";
import SelfiBooth from "../../../../public/img/event-landing-page/selfi.png";
import OnlinePhotos from "../../../../public/img/event-landing-page/onlinephotos.png";
import FinisherShield from "../../../../public/img/event-landing-page/shield.png";

import { getEventBySlug } from "@/lib/backendApi";

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

const giveAwayImages = {
  "Race T-shirt": Tshirt,
  "Finisher's Medal": Medal,
  "Bib Number with timing chip": Chip,
  "Goodie Bag": Gift,
  "Finisher e-Certificate": Certificate,
  "Hydration Support": Hidrate,
  "Non Timed BIB": NonTimed,
  Breakfast: Breakfast,
  Refreshments: Refreshments,
  Certificate: Certificate1,
  Physio: Physio,
  "Selfie Booth": SelfiBooth,
  "Online Photos": OnlinePhotos,
  "Finisher shield": FinisherShield,
  "Race Tshirt (Excluding 3K Majja Run)": Tshirt,
  "Finisher Medal (Excluding 3K Majja Run)": Medal,
  "Bib with Timing Chip (Excluding 3K Majja Run)": Chip,
};

export default function EventPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [event, setEvent] = useState<Event | null>(null);
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const name = searchParams?.get("name");

  function isRegistrationOpen(eventData: Event) {
    return (
      eventData.status === "OPENFORREGISTRATION" ||
      eventData.status === "UPCOMING"
    );
  }

  function buildRegistrationLink(eventData: Event, itemName?: string) {
    return `/events/${eventData.slug}/register${
      itemName ? `?name=${encodeURIComponent(itemName)}` : ""
    }${
      eventData.layout
        ? (itemName ? "&" : "?") + "layout=" + eventData.layout
        : ""
    }`;
  }

  function formatEventDate(dateString: string) {
    const date = new Date(dateString);
    return !isNaN(date.getTime())
      ? format(date, "MMMM dd, yyyy - EEEE")
      : dateString;
  }

  function getFormattedDate() {
    const dateString = event?.date || "";
    return formatEventDate(dateString);
  }

  async function fetchEventData(slug: string) {
    try {
      setLoading(true);
      const response = await getEventBySlug(slug);

      if (response.data) {
        setEvent(response.data);

        if (response.data.location) {
          await fetchLocationCoordinates(response.data.location);
        }
      } else {
        setError("Event not found");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching event data";
      setError(errorMessage);
      console.error("Error fetching event data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLocationCoordinates(location: string) {
    try {
      const geocodeResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          location
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.results && geocodeData.results.length > 0) {
        const { lat, lng } = geocodeData.results[0].geometry.location;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
      }
    } catch (geocodeErr) {
      console.error("Error geocoding:", geocodeErr);
    }
  }

  useEffect(() => {
    if (!slug) return;
    fetchEventData(slug);
  }, [slug]);

  function EventCategories({ event }: { event: Event }) {
    if (!event || !event.category) return null;

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {event.category.map((item, index) => (
          <div key={index} className='flex flex-col'>
            <div className='border-t-8 border-blue-600 rounded-lg flex-1 bg-blue-50 p-5 text-center shadow-lg transition-transform hover:scale-105'>
              <div className='flex flex-col gap-2 h-44'>
                <h5 className='font-bold text-lg'>
                  {item.name || `Category ${index + 1}`}
                </h5>
                <div className='font-bold flex items-center justify-center gap-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='currentColor'
                      d='M13.725 21L7 14v-2h3.5q1.325 0 2.288-.862T13.95 9H6V7h7.65q-.425-.875-1.263-1.437T10.5 5H6V3h12v2h-3.25q.35.425.625.925T15.8 7H18v2h-2.025q-.2 2.125-1.75 3.563T10.5 14h-.725l6.725 7z'
                    ></path>
                  </svg>
                  {item.displayAmount && item.displayAmount !== "undefined"
                    ? item.displayAmount
                    : item.amount}
                </div>
                {item.minimumAge && (
                  <div>
                    Minimum Age:{" "}
                    <span className='font-bold'>{item.minimumAge}</span>
                  </div>
                )}
                {item.maximumAge && (
                  <div>
                    Maximum Age:{" "}
                    <span className='font-bold'>{item.maximumAge}</span>
                  </div>
                )}
                {item.distance && (
                  <div>
                    Distance: <span className='font-bold'>{item.distance}</span>
                  </div>
                )}
              </div>

              {isRegistrationOpen(event) ? (
                <Link
                  href={buildRegistrationLink(event, item.name)}
                  className='inline-block mt-4 py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
                >
                  Register
                </Link>
              ) : (
                <span className='inline-block mt-4 py-2 px-6 bg-blue-600 text-white rounded opacity-70 cursor-not-allowed'>
                  Register
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function EventOverview({ event }: { event: Event }) {
    if (!event || !event.aboutEvent) return null;

    const aboutEvent = event.aboutEvent.split("\n").join("<br/>");

    return (
      <div className='mt-5 text-base'>
        <div dangerouslySetInnerHTML={{ __html: aboutEvent }} />
      </div>
    );
  }

  function BreadcrumbNavigation({
    event,
    breadcrumbName,
    name,
  }: {
    event: Event | null;
    breadcrumbName: string;
    name?: string;
  }) {
    return (
      <section className='py-3 px-3 flex items-center bg-white'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex gap-2 items-center text-sm'>
            <div>{event?.eventName}</div>
            <div>&gt;</div>
            <div>{name || breadcrumbName}</div>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <div className='container pt-40'>
        <div className='text-center'>
          <div className='spinner-border text-primary' role='status'>
            <div className='w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto'></div>
          </div>
          <p className='mt-3'>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container pt-40'>
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative'
          role='alert'
        >
          <h4 className='font-bold'>Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className='container pt-40'>
        <div
          className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative'
          role='alert'
        >
          <h4 className='font-bold'>Event Not Found</h4>
          <p>Sorry, we couldn't find the event you're looking for.</p>
        </div>
      </div>
    );
  }

  function renderClosedEventNotification() {
    if (event && event.status === "CLOSED") {
      return (
        <div className='bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4'>
          <p className='font-bold'>Registration Closed</p>
          <p>Registration for this event is currently closed.</p>
        </div>
      );
    }
    return null;
  }

  function renderEventImage() {
    if (!event?.eventPicture) return null;

    return (
      <div className='mt-4 rounded-lg overflow-hidden'>
        <Image
          src={event.eventPicture}
          alt={event.eventName}
          width={1200}
          height={600}
          className='w-full h-auto rounded-lg'
        />
      </div>
    );
  }

  function renderEventDescription() {
    if (!event?.description) return null;

    return (
      <div className='mt-6'>
        <h2 className='text-2xl font-semibold mb-3'>About This Event</h2>
        <div className='prose max-w-none'>
          <div dangerouslySetInnerHTML={{ __html: event.description }} />
        </div>
      </div>
    );
  }

  function renderCategoriesSection() {
    if (!event?.category || event.category.length === 0) return null;

    return (
      <div className='mt-8'>
        <h2 className='text-2xl font-semibold mb-4'>Registration Categories</h2>
        <EventCategories event={event} />
      </div>
    );
  }

  function renderGiveawaySection() {
    if (!event?.giveAway || event.giveAway.length === 0) return null;

    return (
      <div className='mt-8'>
        <h2 className='text-2xl font-semibold mb-4'>What You Get</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {event.giveAway.map((item, index) => (
            <div
              key={index}
              className='flex flex-col items-center p-4 bg-blue-50 rounded-lg shadow-sm text-center'
            >
              {giveAwayImages[item.name as keyof typeof giveAwayImages] && (
                <div className='mb-2'>
                  <Image
                    src={
                      giveAwayImages[item.name as keyof typeof giveAwayImages]
                    }
                    alt={item.name}
                    width={60}
                    height={60}
                  />
                </div>
              )}
              <span className='text-sm font-medium'>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderEventDetails() {
    if (!event?.aboutEvent) return null;

    return (
      <div className='mt-6'>
        <h2 className='text-2xl font-semibold mb-3'>Event Details</h2>
        <EventOverview event={event} />
      </div>
    );
  }

  function renderMobileRegistrationButton() {
    if (!event || !isRegistrationOpen(event)) return null;

    return (
      <div className='mt-8 md:hidden'>
        <Link
          href={buildRegistrationLink(event)}
          className='block w-full py-3 px-6 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors'
        >
          Register Now
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Novarace: {event.eventName}</title>
        <meta
          property='og:url'
          content={`https://www.novarace.in/pages/share/${event.slug}`}
        />
      </Head>

      {renderClosedEventNotification()}

      <section className='pt-40'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='w-full lg:w-2/3'>
              <div className='flex justify-between items-end pt-10 gap-3 flex-wrap'>
                <div className='flex justify-end md:hidden w-full'>
                  {isRegistrationOpen(event) ? (
                    <Link
                      href={buildRegistrationLink(event)}
                      className='py-3 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center'
                    >
                      Register Now
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 ml-2'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </Link>
                  ) : (
                    <span className='py-3 px-6 bg-blue-600 text-white rounded opacity-70 cursor-not-allowed flex items-center'>
                      Register Now2
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 ml-2'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </span>
                  )}
                </div>

                <div>
                  <div className='flex gap-5 items-center'>
                    <div>
                      <h1 className='text-3xl sm:text-4xl font-semibold'>
                        {event.eventName}
                      </h1>
                    </div>
                  </div>

                  <div className='flex flex-wrap gap-5 items-center mt-2'>
                    <div>
                      <div className='flex items-center text-base'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5 mr-1'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                        </svg>
                        {event.location}
                      </div>
                    </div>
                    {event.date && (
                      <div>
                        <div className='flex items-center text-base'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5 mr-1'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                            />
                          </svg>
                          {getFormattedDate()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {renderEventImage()}
              {renderEventDescription()}
              {renderEventDetails()}
              {renderGiveawaySection()}
              {renderCategoriesSection()}

            </div>

            <RightSidebar
              event={event}
              latitude={latitude}
              longitude={longitude}
              formatEventDate={formatEventDate}
            />
          </div>
        </div>
      </section>
    </>
  );
}
