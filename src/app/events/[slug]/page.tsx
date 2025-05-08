"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

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

import { getEventBySlug } from "@/lib/api";


const giveAwayImages: Record<string, any> = {
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
}

const AvailableRooms2 = ({ event }: { event: Event | null }) => {
  if (!event || !event.category) return null;

  return (
    <>
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
              {event.status === "OPENFORREGISTRATION" ||
              event.status === "UPCOMING" ? (
                <Link
                  href={`/events/${event.slug}/register?name=${item.name}${
                    event.layout ? "&layout=" + event.layout : ""
                  }`}
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
    </>
  );
};

const Overview = ({ event }: { event: Event | null }) => {
  if (!event || !event.aboutEvent) return null;

  const aboutEvent = event.aboutEvent.split("\n").join("<br/>");

  return (
    <div className='mt-5 text-base'>
      <div dangerouslySetInnerHTML={{ __html: aboutEvent }} />
    </div>
  );
};


const TopBreadCrumb = ({
  event,
  breadcrumbName,
  name,
}: {
  event: Event | null;
  breadcrumbName: string;
  name?: string;
}) => {
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
};

export default function EventPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [event, setEvent] = useState<Event | null>(null);

  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const name = searchParams?.get("name");

  useEffect(() => {
    if (!slug) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await getEventBySlug(slug);
        if (response.data) {
          setEvent(response.data);
        } else {
          setError("Event not found");
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Error fetching event data";
        setError(errorMessage);
        console.error("Error fetching event data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  const getDateString = () => {
    const dateString = event?.date || "";
    const date = new Date(dateString);
    return !isNaN(date.getTime())
      ? format(date, "MMMM dd, yyyy - EEEE")
      : dateString;
  };

  const imageUrl = event?.eventPicture
    ? `https://www.novarace.in/pages/image?url=${event.eventPicture}`
    : null;

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

  return (
    <>
      <Head>
        <title>Novarace: {event.eventName}</title>
        <meta
          property='og:url'
          content={`https://www.novarace.in/pages/share/${event.slug}`}
        />
      </Head>

      {event?.tag === "Closed" && (
        <div className='text-center text-red-600 bg-gray-100 p-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='w-8 h-8 mx-auto'
            viewBox='0 0 24 24'
          >
            <g
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
            >
              <path d='M0 0h24v24H0z'></path>
              <path
                fill='currentColor'
                d='M12 1.67c.955 0 1.845.467 2.39 1.247l.105.16l8.114 13.548a2.914 2.914 0 0 1-2.307 4.363l-.195.008H3.882a2.914 2.914 0 0 1-2.582-4.2l.099-.185l8.11-13.538A2.914 2.914 0 0 1 12 1.67M12.01 15l-.127.007a1 1 0 0 0 0 1.986L12 17l.127-.007a1 1 0 0 0 0-1.986zM12 8a1 1 0 0 0-.993.883L11 9v4l.007.117a1 1 0 0 0 1.986 0L13 13V9l-.007-.117A1 1 0 0 0 12 8'
              ></path>
            </g>
          </svg>
          {event?.slug === "mutthu-marathon-2025" ? (
            <>
              <h3 className='my-2 text-red-600 font-bold'>
                Registrations are closed for Mutthu Marathon
              </h3>
              <h5 className='text-lg'>
                {`However, you can still express your interest by filling out this form or contacting the organizer directly at +91-9443057177 and +91-9750943456 for further participation details. See you all on ${getDateString()}`}
              </h5>
              <h5 className='text-lg'>
                Form Link:{" "}
                <a
                  href='https://forms.gle/EdvvAUNRZJkJrs5m8'
                  className='text-blue-600'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  https://forms.gle/EdvvAUNRZJkJrs5m8
                </a>
              </h5>
            </>
          ) : (
            <h5 className='text-lg'>
              {`Registrations for this event is closed. See you all on ${getDateString()}`}
            </h5>
          )}
        </div>
      )}

      <section className='pt-40'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col gap-6'>
            <div className='w-full'>
              <div className='flex justify-between items-end pt-10 gap-3 flex-wrap'>
                <div className='flex justify-end md:hidden w-full'>
                  <Link
                    href={`/events/${event.slug}/register${
                      event.layout ? `?layout=${event.layout}` : ""
                    }`}
                    className='py-3 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center'
                  >
                    Register
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
                          {getDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {imageUrl && (
              <div className='w-full mt-5'>
                <img
                  src={imageUrl}
                  alt={event.eventName}
                  className='w-full h-auto rounded-lg shadow-lg'
                />
              </div>
            )}

            {event.description && (
              <div className='w-full mt-5'>
                <h3 className='text-2xl font-medium'>About This Event</h3>
                <div className='mt-3'>
                  <p>{event.description}</p>
                </div>
              </div>
            )}

            {event.aboutEvent && (
              <div className='w-full mt-5'>
                <h3 className='text-2xl font-medium'>Details</h3>
                <Overview event={event} />
              </div>
            )}

            {event.category && event.category.length > 0 && (
              <div className='w-full mt-8'>
                <h3 className='text-2xl font-medium border-t border-gray-200 pt-5'>
                  Categories
                </h3>
                <div className='mt-5'>
                  <AvailableRooms2 event={event} />
                </div>
              </div>
            )}

            {event.slug === "skinathon-2025" && (
              <div className='w-full mt-8 border-t border-gray-200 pt-5'>
                <h3 className='text-2xl font-bold text-center'>
                  About Organizer
                </h3>
                <div className='flex justify-center items-center flex-col md:flex-row'>
                  <div className='flex justify-center items-center mt-4'>
                    <div className='w-1/2 md:w-1/4 px-3'>
                      <img
                        src='/img/general/skinathon4.png'
                        alt='IADVL Karnataka logo'
                        className='rounded-lg w-full'
                      />
                    </div>
                    <div className='w-1/2 md:w-1/4 px-3'>
                      <img
                        src='/img/general/skinathon1.png'
                        alt='IADVL logo'
                        className='rounded-lg w-full'
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-4'>
                  <span className='font-bold'>IADVL Karnataka</span>
                  <br />
                  The Indian Association of Dermatologists Venereologists and
                  Leprologists (IADVL) came into existence on the 28th of
                  January 1973 at Udaipur with the merger of the Indian
                  association of dermatologists and Venereologists (IADV) and
                  the dermatological society of India (DSI).
                </div>
              </div>
            )}

            {event.slug === "toyota-bidadi-half-marathon-second-edition" && (
              <div className='w-full mt-8 border-t border-gray-200 pt-5'>
                <h3 className='text-2xl font-bold text-center'>
                  About Organizer
                </h3>
                <div className='flex justify-center items-center flex-col md:flex-row'>
                  <div className='flex justify-center items-center mt-4'>
                    <div className='w-1/2 md:w-1/4 px-3'>
                      <img
                        src='/img/general/BIA_Foundation_Logo2.png'
                        alt='BIA Foundation logo'
                        className='rounded-lg w-full'
                      />
                    </div>
                    <div className='w-1/3 md:w-1/6 px-3'>
                      <img
                        src='/img/general/BIA_Foundation_Logo1.png'
                        alt='BIA logo'
                        className='rounded-lg w-full'
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-4'>
                  <span className='font-bold'>
                    Bidadi Industries Association (BIA)
                  </span>
                  <br />
                  The association serves as a non-profit forum for members,
                  addressing industry challenges, advocating with authorities,
                  and fostering solutions.
                </div>
                <div className='mt-3'>
                  <span className='font-bold'>BIA Foundation</span>
                  <br />
                  Established on 22nd September 2023, the BIA Foundation is
                  dedicated to driving impactful change through initiatives
                  focused on eradicating poverty and malnutrition, promoting
                  healthcare, education, gender equality, and environmental
                  sustainability.
                </div>
              </div>
            )}

            {event.slug === "moonlight-track-run-2025" && (
              <div className='w-full mt-8 border-t border-gray-200 pt-5'>
                <h3 className='text-2xl font-bold text-center'>
                  About Organizer
                </h3>
                <div className='flex justify-center items-center flex-col md:flex-row'>
                  <div className='flex justify-center items-center mt-4'>
                    <div className='w-1/2 md:w-1/4 px-3'>
                      <img
                        src='/img/general/salemrunnerslogo.jpg'
                        alt='Salem Runners Club logo'
                        className='rounded-lg w-full'
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-4'>
                  <span className='font-bold'>Salem Runners Club</span>
                  <br />
                  Founded with the mission to inspire fitness in the community,
                  Salem Runners Club is one of Tamil Nadu's most passionate
                  running collectives.
                </div>
                <div className='mt-3'>
                  <span className='font-bold'>Follow us on:</span>
                  <br />
                  Website:{" "}
                  <a
                    href='https://www.salemrunnersclub.com'
                    className='text-blue-600'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    www.salemrunnersclub.com
                  </a>
                  <br />
                  Instagram:{" "}
                  <a
                    href='https://www.instagram.com/salemrunnersclub'
                    className='text-blue-600'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    @salemrunnersclub
                  </a>
                  <br />
                  Facebook:{" "}
                  <a
                    href='https://www.facebook.com/salemrunnersindia'
                    className='text-blue-600'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    /salemrunnersclub
                  </a>
                </div>
              </div>
            )}

            {event.giveAway && event.giveAway.length > 0 && (
              <div className='w-full mt-8'>
                <h3 className='text-2xl font-medium border-t border-gray-200 pt-5'>
                  Give Away
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5'>
                  {event.giveAway.map((item, index) => {
                    const imageSrc = giveAwayImages[item.name];
                    return (
                      <div key={index} className='flex gap-2 items-center mb-2'>
                        {imageSrc && (
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              flexShrink: 0,
                            }}
                          >
                            <Image
                              src={imageSrc}
                              alt={item.name}
                              width={50}
                              height={50}
                              className='mr-2'
                            />
                          </div>
                        )}
                        <div className='text-base'>{item.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className='w-full mt-8 flex justify-center'>
              <Link
                href={`/events/${event.slug}/register${
                  event.layout ? `?layout=${event.layout}` : ""
                }`}
                className='py-4 px-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center text-lg'
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
