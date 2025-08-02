'use client';

import React, { useState, useRef } from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Users,
  Medal,
  Info,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { pacers } from './data';

const raceDetails = [
  {
    title: '10 KM Run',
    reportingTime: '5:00 AM',
    startTime: '5:45 AM',
    distance: '10K',
    participants: '2,500+',
  },
  {
    title: '5 KM Run',
    reportingTime: '5:15 AM',
    startTime: '6:00 AM',
    distance: '5K',
    participants: '1,800+',
  },
  {
    title: '3 KM Fun Run',
    reportingTime: '5:30 AM',
    startTime: '6:15 AM',
    distance: '3K',
    participants: '1,200+',
  },
];

const map = {
  title: 'Complete Route Overview',
  description: 'Full course map showing all race distances and key landmarks',
  pdfPath: 'https://icsevents.in/sapraceinfo/SapRouteMaps2025.pdf',
};
const PacerAbout = ({
  about,
  dataImage,
}: {
  about: string;
  dataImage?: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageClick = () => {
    if (imgRef.current) {
      if (imgRef.current.requestFullscreen) {
        imgRef.current.requestFullscreen();
      } else if ((imgRef.current as any).webkitRequestFullscreen) {
        // Safari support
        (imgRef.current as any).webkitRequestFullscreen();
      } else if ((imgRef.current as any).msRequestFullscreen) {
        // IE11 support
        (imgRef.current as any).msRequestFullscreen();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg w-full text-left p-2 sm:p-4">
      <p
        className={`
          text-sm text-gray-700 leading-relaxed whitespace-pre-line text-justify
          ${expanded ? '' : 'line-clamp-3 sm:line-clamp-6'}
        `}
        dangerouslySetInnerHTML={{ __html: about }}
      />

      {/* Show image and download link when expanded */}
      {expanded && dataImage && (
        <div className="mt-4">
          <img
            ref={imgRef}
            src={dataImage}
            alt="Pacer Data"
            className="w-full max-w-md rounded border border-gray-300 cursor-pointer"
            onClick={handleImageClick}
          />
          <div className="mt-2">
            <a
              href={dataImage}
              target="_blank"
              download
              className="text-blue-600 text-sm hover:underline"
            >
              ⬇️ Open Pacer Info
            </a>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        className="text-green-600 text-xs mt-2 hover:text-green-700"
        onClick={() => setExpanded(!expanded)}
        style={{ color: '#C7CC00' }}
      >
        {expanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

export default function RaceDayInfo() {
  const [enableRaceExpoSection, setEnableRaceExpoSection] = useState(true);
  const [enableRaceDayScheduleSection, setEnableRaceDayScheduleSection] =
    useState(true);
  const [enableMaps, setEnableMaps] = useState(true);

  return (
    <>
      <head>
        <title>
          SAP RUN 2025 - Race Day Information | Official Event Guide
        </title>
        <meta
          name="description"
          content="Complete race day information for SAP RUN 2025. Get route maps, start times, pacer details, and essential race day guidelines for 3K, 5K, and 10K runs."
        />
        <meta
          name="keywords"
          content="SAP RUN 2025, race day info, running event, 5K 10K race, marathon pacers, race route map"
        />
        <meta
          property="og:title"
          content="SAP RUN 2025 - Race Day Information"
        />
        <meta
          property="og:description"
          content="Everything you need for race day success at SAP RUN 2025"
        />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <div className="flex justify-end mt-4 pb-4 pr-4">
        <a
          href="https://sap.icsevents.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-blue-700 border border-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-blue-50 transition"
        >
          About Event
        </a>
      </div>

      <div
        className=""
        style={{
          background:
            'linear-gradient(to bottom, #d0ebff 0%, #60a5fa 50%, #1e3a8a 100%)',
        }}
      >
        {/* Banner Image */}
        <div className="w-full px-4 py-6 flex justify-center">
          <img
            src="https://novarace-events.s3.us-east-2.amazonaws.com/email-attachments/super-admin/c7010ca1-6045-4abd-9087-c08de29e3f75.jpg"
            alt="SAP Run 2025 Banner"
            className="w-full max-w-3xl h-auto object-contain rounded-lg shadow-lg"
          />
        </div>

        {/* Content Section */}
        <div className="relative container mx-auto px-4 py-4 text-center">
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <div className="flex items-center px-3 py-1.5 rounded-full backdrop-blur-md bg-white/30 text-white shadow-sm">
              <Calendar className="w-4 h-4 mr-1" />
              August 3rd, 2025
            </div>
            <a
              href="https://maps.app.goo.gl/r9Y7sZxHcBaytTFM8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center px-3 py-1.5 rounded-full backdrop-blur-md bg-white/30 text-white shadow-sm cursor-pointer">
                <MapPin className="w-4 h-4 mr-1" />
                KPTO, WhiteField, Bengaluru
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 space-y-16">
      {enableRaceDayScheduleSection && (
  <section className="bg-white rounded-2xl shadow-lg px-4 py-6 sm:px-6 md:px-8">
    <div className="text-center mb-6 md:mb-8">
      <h2
        className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4"
        style={{ color: '#2D4A9E' }}
      >
        Race Schedule & Timings
      </h2>
      <p className="text-sm sm:text-base text-gray-600">
        Plan your race day with our detailed timing schedule
      </p>
    </div>

    {/* Responsive Centered Table */}
    <div className="flex justify-center overflow-x-auto mb-6">
      <div className="inline-block min-w-[350px]">
        <table className="table-auto w-full border border-gray-200 rounded-lg text-sm sm:text-base">
          <thead>
            <tr className="bg-[#2D4A9E] text-white text-center">
              <th className="px-4 sm:px-6 py-3">Category</th>
              <th className="px-4 sm:px-6 py-3">Reporting Time</th>
              <th className="px-4 sm:px-6 py-3">Flag Off Time</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-center">
            <tr className="border-t border-gray-200">
              <td className="px-4 sm:px-6 py-3 font-semibold">10 KM</td>
              <td className="px-4 sm:px-6 py-3">4:30 AM</td>
              <td className="px-4 sm:px-6 py-3">5:30 AM</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 sm:px-6 py-3 font-semibold">5 KM</td>
              <td className="px-4 sm:px-6 py-3">5:30 AM</td>
              <td className="px-4 sm:px-6 py-3">6:30 AM</td>
            </tr>
            <tr className="border-t border-gray-200">
              <td className="px-4 sm:px-6 py-3 font-semibold">3 KM</td>
              <td className="px-4 sm:px-6 py-3">5:45 AM</td>
              <td className="px-4 sm:px-6 py-3">6:45 AM</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    {/* Download Button */}
    <div className="text-center">
      <a
        href="https://icsevents.in/sapraceinfo/SAP RUN 2025 - RACE INFORMATION.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full sm:w-auto bg-[#2D4A9E] text-white px-5 py-2 rounded-full font-semibold shadow hover:bg-[#1d3372] transition duration-300 text-center"
      >
        View Race Info (PDF)
      </a>

      <p className="text-sm text-gray-600 mt-3 px-2">
        You can also view all detailed information in the{' '}
        <strong>Race Info</strong> section.
      </p>
    </div>
  </section>
)}

        {/* 4. Route Map Section */}
        {enableMaps && (
          <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <h2
                className="text-3xl font-bold mb-4 text-center"
                style={{ color: '#2D4A9E' }}
              >
                Route Maps
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Explore detailed course maps and key information
              </p>
            </div>
            <div className="px-4 pb-8">
              <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="hidden sm:block w-full h-[60vh] sm:h-[70vh] md:aspect-video border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    <iframe
                      src={map.pdfPath}
                      title="Route Map PDF"
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="block sm:hidden text-center py-8">
                    <p className="text-gray-700 mb-4">
                      Tap below to view the route map:
                    </p>
                    <a
                      href={map.pdfPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 text-white rounded-lg shadow hover:opacity-90 transition"
                      style={{ backgroundColor: '#2D4A9E' }}
                    >
                      Open Route Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 pb-12 space-y-6">
              <div className="text-center pt-6">
                <a
                  href={map.pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors"
                  style={{ backgroundColor: '#2D4A9E' }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Download Full Route Map (PDF)
                </a>
              </div>
            </div>
          </section>
        )}

       {enableRaceExpoSection && (
  <section
    className="rounded-2xl p-4 sm:p-6 md:p-8"
    style={{
      background: 'linear-gradient(135deg, #E6F0FF 0%, #B3D4FF 100%)',
    }}
  >
    <div className="text-center max-w-4xl mx-auto space-y-6">
      <h1 className="text-blue-800 font-bold text-xl sm:text-2xl md:text-3xl">
        🚗 Parking & Arrival Information
      </h1>

      <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-md border border-blue-300 text-left space-y-4 text-sm text-gray-700">
        <h3 className="text-base font-semibold text-blue-800">Event Day: Sunday, August 3rd, 2025</h3>

        <ul className="list-disc pl-5 space-y-1">
          <li>🕓 Parking gates will open from <strong>4:00 AM</strong></li>
          <li>🅿️ Dedicated parking for <strong>SAP Employees</strong> is at the <strong>MLCP building</strong>. Carry your employee ID card for access into the campus.</li>
          <li>🅿️ Dedicated 2-wheeler and 4-wheeler parking is available inside <strong>KTPO</strong> for non-SAP employees.</li>
          <li>➡️ Follow signage for <strong>Gate 1 and Gate 2</strong></li>
          <li>🚖 Entry and cab drop-off is only via <strong>Kundalahalli Main Road</strong></li>
          <li>🙋 On-ground volunteers will assist with directions and parking</li>
          <li>🎒 <strong>Baggage counter</strong> available.</li>
        </ul>

        <p className="pt-4 font-medium">We request you to arrive well in advance to avoid last-minute rush.</p>
      </div>
    </div>
  </section>
)}

        <section className="bg-white rounded-2xl shadow-lg p-2 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h2
              className="text-xl md:text-3xl font-bold mb-2 md:mb-4"
              style={{ color: '#2D4A9E' }}
            >
              Meet Our Official Pacers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-2">
              Join our experienced pacers to achieve your target time. Each
              pacer brings unique strategies and years of running experience to
              help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {pacers.map((pacer) => {
              const dataImage = pacer.dataImage;

              return (
                <div
                  key={pacer.number}
                  className="rounded-xl p-2 sm:p-4 md:p-6 hover:shadow-lg transition-shadow flex flex-col items-center"
                  style={{
                    background:
                      'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className="w-full flex justify-center mb-2">
                    <img
                      src={`/img/pacer/${pacer.image}`}
                      alt={pacer.name}
                      className="w-full max-w-[450px] h-auto object-cover border-2 border-white shadow-md rounded-lg"
                    />
                  </div>
                  <PacerAbout about={pacer.about} dataImage={pacer.dataImage} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
