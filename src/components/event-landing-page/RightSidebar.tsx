import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Event {
  eventName: string;
  slug: string;
  latitude: string;
  location: string;
  date?: string;
  status?: string;
  layout?: string;
  orgEmail?: string;
  contactNum?: string;
  secondaryContactNumber?: string;
  eventPicture?: string;
}

interface RightSidebarProps {
  event: Event;
  latitude: string | null;
  longitude: string | null;
  formatEventDate: (dateString: string) => string;
}

const RightSidebar = ({ event, formatEventDate }: RightSidebarProps) => {
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!event?.location) return;

    setIsMapLoading(true);

    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      event.location
    )}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          setLatitude(data[0].lat);
          setLongitude(data[0].lon);
        }
        setIsMapLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching geocoding data:', error);
        setIsMapLoading(false);
      });
  }, [event?.location]);

  if (!event) return null;

  const buildRegistrationLink = () => {
    return `/events/${event.slug}/register${
      event.layout ? `?layout=${event.layout}` : ''
    }`;
  };

  return (
    <div
      className={`w-full lg:w-1/3 px-4 ${
        isSticky ? 'lg:sticky lg:top-24 transition-all duration-300' : ''
      }`}
    >
      {(event.status === 'OPENFORREGISTRATION' ||
        event.status === 'UPCOMING') && (
        <Link
          href={buildRegistrationLink()}
          className="inline-block mt-4 py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Register now
        </Link>
      )}

      <div className="mt-4 p-6 border border-gray-200 rounded-lg shadow-md bg-white">
        <div className="mb-4 h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
          {isMapLoading ? (
            <div className="text-gray-500">Loading map...</div>
          ) : latitude && longitude ? (
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                event.location
              )}&output=embed&ll=${latitude},${longitude}&z=8&iwloc`}
              width="100%"
              height="100%"
              allowFullScreen
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          ) : (
            <div className="text-gray-500">
              Could not load map for this location
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Location & Date:</h3>
          <div className="flex items-center mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{event.location}</span>
          </div>
          {event.date && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatEventDate(event.date || '')}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <div>
          <h3 className="text-lg font-bold mb-2">Contact Details:</h3>
          {event.orgEmail && (
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                href={`mailto:${event.orgEmail}`}
                className="hover:text-blue-600"
              >
                {event.orgEmail}
              </a>
            </div>
          )}
          {event.contactNum && (
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a
                href={`tel:${event.contactNum}`}
                className="hover:text-blue-600"
              >
                {event.contactNum}
              </a>
            </div>
          )}
          {event.secondaryContactNumber && (
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a
                href={`tel:${event.secondaryContactNumber}`}
                className="hover:text-blue-600"
              >
                {event.secondaryContactNumber}
              </a>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 my-4"></div>

        <div>
          <h3 className="text-lg font-bold mb-2">
            Registration Platform Support:
          </h3>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <a
              href="mailto:support@novarace.in"
              className="hover:text-blue-600"
            >
              support@novarace.in
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-2 mt-4">
        <button
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(
                `Check out ${event.eventName}: ${window.location.href}`
              )}`
            )
          }
          className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
          aria-label="Share on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
          </svg>
        </button>

        <button
          onClick={() =>
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
              )}`
            )
          }
          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          aria-label="Share on Facebook"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
          </svg>
        </button>

        <button
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Check out ${event.eventName}`
              )}&url=${encodeURIComponent(window.location.href)}`
            )
          }
          className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors"
          aria-label="Share on Twitter/X"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
          </svg>
        </button>

        <button
          onClick={() =>
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                window.location.href
              )}`
            )
          }
          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors"
          aria-label="Share on LinkedIn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RightSidebar;
