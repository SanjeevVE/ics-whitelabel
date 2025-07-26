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
    <div className='bg-white rounded-lg w-full text-left p-2 sm:p-4'>
      <p
        className={`
          text-sm text-gray-700 leading-relaxed whitespace-pre-line text-justify
          ${expanded ? '' : 'line-clamp-3 sm:line-clamp-6'}
        `}
        dangerouslySetInnerHTML={{ __html: about }}
      />

      {/* Show image and download link when expanded */}
      {expanded && dataImage && (
        <div className='mt-4'>
          <img
            ref={imgRef}
            src={dataImage}
            alt='Pacer Data'
            className='w-full max-w-md rounded border border-gray-300 cursor-pointer'
            onClick={handleImageClick}
          />
          <div className='mt-2'>
            <a
              href={dataImage}
              target='_blank'
              download
              className='text-blue-600 text-sm hover:underline'
            >
              ⬇️ Open Pacer Info
            </a>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        className='text-green-600 text-xs mt-2 hover:text-green-700'
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

  return (
    <>
      <head>
        <title>
          SAP RUN 2025 - Race Day Information | Official Event Guide
        </title>
        <meta
          name='description'
          content='Complete race day information for SAP RUN 2025. Get route maps, start times, pacer details, and essential race day guidelines for 3K, 5K, and 10K runs.'
        />
        <meta
          name='keywords'
          content='SAP RUN 2025, race day info, running event, 5K 10K race, marathon pacers, race route map'
        />
        <meta
          property='og:title'
          content='SAP RUN 2025 - Race Day Information'
        />
        <meta
          property='og:description'
          content='Everything you need for race day success at SAP RUN 2025'
        />
        <meta property='og:type' content='website' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </head>
      <div className='flex justify-end mt-4 pb-4 pr-4'>
        <a
          href='https://sap.icsevents.in/'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-block bg-white text-blue-700 border border-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow hover:bg-blue-50 transition'
        >
          About Event
        </a>
      </div>

      <div
        className=''
        style={{
          background:
            'linear-gradient(to bottom, #d0ebff 0%, #60a5fa 50%, #1e3a8a 100%)',
        }}
      >
        {/* Banner Image */}
        <div className='w-full px-4 py-6 flex justify-center'>
          <img
            src='https://novarace-events.s3.us-east-2.amazonaws.com/email-attachments/super-admin/c7010ca1-6045-4abd-9087-c08de29e3f75.jpg'
            alt='SAP Run 2025 Banner'
            className='w-full max-w-3xl h-auto object-contain rounded-lg shadow-lg'
          />
        </div>

        {/* Content Section */}
        <div className='relative container mx-auto px-4 py-4 text-center'>
          <div className='flex flex-wrap justify-center gap-3 text-sm'>
            <div className='flex items-center px-3 py-1.5 rounded-full backdrop-blur-md bg-white/30 text-white shadow-sm'>
              <Calendar className='w-4 h-4 mr-1' />
              August 3rd, 2025
            </div>
            <a
              href='https://maps.app.goo.gl/r9Y7sZxHcBaytTFM8'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='flex items-center px-3 py-1.5 rounded-full backdrop-blur-md bg-white/30 text-white shadow-sm cursor-pointer'>
                <MapPin className='w-4 h-4 mr-1' />
                KPTO, WhiteField, Bengaluru
              </div>
            </a>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-6 py-12 space-y-16'>
        {/* 1. Pacers Section */}
        <section className='bg-white rounded-2xl shadow-lg p-2 md:p-8'>
          <div className='text-center mb-6 md:mb-8'>
            <h2
              className='text-xl md:text-3xl font-bold mb-2 md:mb-4'
              style={{ color: '#2D4A9E' }}
            >
              Meet Our Official Pacers
            </h2>
            <p className='text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-2'>
              Join our experienced pacers to achieve your target time. Each
              pacer brings unique strategies and years of running experience to
              help you succeed.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
            {pacers.map((pacer) => {
              const dataImage = pacer.dataImage;

              return (
                <div
                  key={pacer.number}
                  className='rounded-xl p-2 sm:p-4 md:p-6 hover:shadow-lg transition-shadow flex flex-col items-center'
                  style={{
                    background:
                      'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className='w-full flex justify-center mb-2'>
                    <img
                      src={`/img/pacer/${pacer.image}`}
                      alt={pacer.name}
                      className='w-full max-w-[450px] h-auto object-cover border-2 border-white shadow-md rounded-lg'
                    />
                  </div>
                  <PacerAbout about={pacer.about} dataImage={pacer.dataImage} />
                </div>
              );
            })}
          </div>
        </section>

     {/* 2. Bib Collection Section */}
        {enableRaceExpoSection && (
          <section
            className='rounded-2xl p-8'
            style={{
              background: 'linear-gradient(135deg, #E6F0FF 0%, #B3D4FF 100%)',
            }}
          >
            <div className='text-center max-w-6xl mx-auto'>
              <h2
                className='text-3xl font-bold mb-6'
                style={{ color: '#2D4A9E' }}
              >
                Bib Collection & Race Expo
              </h2>
              
              {/* Two column layout for SAP Employees vs Non-SAP */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
                
                {/* Left Side - SAP Employees */}
                <div className='bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200'>
                  <div className='mb-4'>
                    <span
                      className='inline-block text-white px-4 py-2 rounded-full text-sm font-semibold'
                      style={{ backgroundColor: '#2D4A9E' }}
                    >
                      For SAP Employees
                    </span>
                  </div>
                  
                  <div className='space-y-4'>
                    <div className='flex items-center justify-center'>
                      <Calendar
                        className='w-6 h-6 mr-3'
                        style={{ color: '#B23A7D' }}
                      />
                      <div>
                        <h3 className='text-lg font-semibold'>July 30, 2025</h3>
                        <p className='text-sm text-gray-500'>Wednesday</p>
                      </div>
                    </div>
                    
                    <div className='flex items-center justify-center'>
                      <Clock
                        className='w-6 h-6 mr-3'
                        style={{ color: '#B23A7D' }}
                      />
                      <div>
                        <h3 className='text-lg font-semibold'>10:00 AM - 5:00 PM</h3>
                      </div>
                    </div>
                    
                    <div className='bg-gray-50 rounded-lg p-4'>
                      <h4 className='font-semibold mb-2'>Venue:</h4>
                      <p className='text-sm text-gray-600 mb-2'>
                        Whitefield BLR02 Reception Block
                      </p>
                      <a
                        href="https://maps.app.goo.gl/SAPWhitefieldLocation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='inline-flex items-center text-xs text-blue-600 hover:text-blue-800'
                      >
                        📍 View on Google Maps
                      </a>
                    </div>
                    
                    <div className='text-sm text-gray-600 text-left'>
                      <h4 className='font-semibold mb-2'>Notes:</h4>
                      <p>1. You may collect BIBs for registered family members</p>
                      <p>2. Spot registrations are not permitted</p>
                    </div>
                  </div>
                </div>

                {/* Right Side - Non-SAP Employees */}
                <div className='bg-white rounded-xl p-6 shadow-sm border-2 border-purple-200'>
                  <div className='mb-4'>
                    <span
                      className='inline-block text-white px-4 py-2 rounded-full text-sm font-semibold'
                      style={{ backgroundColor: '#B23A7D' }}
                    >
                      For Non-SAP Employees
                    </span>
                  </div>
                  
                  <div className='space-y-4'>
                    <div className='flex items-center justify-center'>
                      <Calendar
                        className='w-6 h-6 mr-3'
                        style={{ color: '#B23A7D' }}
                      />
                      <div>
                        <h3 className='text-lg font-semibold'>August 1 & 2, 2025</h3>
                        <p className='text-sm text-gray-500'>Friday & Saturday</p>
                      </div>
                    </div>
                    
                    <div className='flex items-center justify-center'>
                      <Clock
                        className='w-6 h-6 mr-3'
                        style={{ color: '#B23A7D' }}
                      />
                      <div>
                        <h3 className='text-lg font-semibold'>10:00 AM - 5:00 PM</h3>
                      </div>
                    </div>
                    
                    <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
                      <div>
                        <h4 className='font-semibold mb-1'>Venue 1:</h4>
                        <p className='text-sm text-gray-600 mb-1'>
                          JW Marriott, UB City, Jade Hall @Level 2
                        </p>
                        <a
                          href="https://maps.app.goo.gl/oAaMsnNKUghguCgb8"
                          target="_blank"
                          rel="noopener noreferrer"
                          className='inline-flex items-center text-xs text-blue-600 hover:text-blue-800'
                        >
                          📍 View on Google Maps
                        </a>
                      </div>
                      <div>
                        <h4 className='font-semibold mb-1'>Venue 2:</h4>
                        <p className='text-sm text-gray-600 mb-1'>
                          Sheraton Grand, Whitefield
                        </p>
                        <a
                          href="https://maps.app.goo.gl/oCxbNYFm1uN5vLN8A"
                          target="_blank"
                          rel="noopener noreferrer"
                          className='inline-flex items-center text-xs text-blue-600 hover:text-blue-800'
                        >
                          📍 View on Google Maps
                        </a>
                      </div>
                    </div>
                    
                    <div className='text-sm text-gray-600 text-left'>
                      <h4 className='font-semibold mb-2'>Notes:</h4>
                      <p>1. You can pick up bibs for registered friends & family</p>
                      <p>2. No spot registration available</p>
                      <p>3. T-shirts distributed on first come first served basis</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Bring Section */}
              <div className='bg-white rounded-xl p-6 shadow-sm'>
                <h3 className='text-lg font-semibold mb-4'>What to Bring</h3>
                <div className='flex flex-wrap justify-center gap-4'>
                  <span
                    className='text-white px-4 py-2 rounded-full text-sm'
                    style={{ backgroundColor: '#B23A7D' }}
                  >
                    Registration Confirmation
                  </span>
                  <span
                    className='text-white px-4 py-2 rounded-full text-sm'
                    style={{ backgroundColor: '#B23A7D' }}
                  >
                    Valid ID Proof
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Race Day Schedule */}
        {enableRaceDayScheduleSection && (
          <section className='bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8'>
            <div className='text-center mb-6 md:mb-8'>
              <h2
                className='text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4'
                style={{ color: '#2D4A9E' }}
              >
                Race Schedule & Timings
              </h2>
              <p className='text-sm sm:text-base text-gray-600'>
                Plan your race day with our detailed timing schedule
              </p>
            </div>

            {/* Coming Soon Message */}
            <div className='text-center py-12'>
              <div 
                className='inline-flex items-center justify-center w-16 h-16 rounded-full mb-4'
                style={{ backgroundColor: '#E6F0FF' }}
              >
                <Clock 
                  className='w-8 h-8'
                  style={{ color: '#2D4A9E' }}
                />
              </div>
              <h3 
                className='text-xl sm:text-2xl font-bold mb-3'
                style={{ color: '#2D4A9E' }}
              >
                Race Schedule Coming Soon!
              </h3>
              <p className='text-gray-600 max-w-md mx-auto'>
                Detailed race timings and schedule will be updated soon. 
                Stay tuned for more information about start times and reporting schedules.
              </p>
              <div className='mt-6'>
                <span
                  className='inline-block text-white px-6 py-2 rounded-full text-sm font-semibold'
                  style={{ backgroundColor: '#B23A7D' }}
                >
                  Updates Coming Soon
                </span>
              </div>
            </div>

            {/* Original race details section commented out for when data is available */}
            {/*
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
              {raceDetails.map((race, index) => (
                <div
                  key={index}
                  className='rounded-2xl p-4 sm:p-6'
                  style={{
                    background:
                      'linear-gradient(135deg, #E6F0FF 0%, #B3D4FF 100%)',
                  }}
                >
                  <div className='flex items-center justify-between mb-3 sm:mb-4'>
                    <h3
                      className='text-lg sm:text-xl font-bold'
                      style={{ color: '#2D4A9E' }}
                    >
                      {race.title}
                    </h3>
                    <Medal
                      className='w-5 h-5 sm:w-6 sm:h-6'
                      style={{ color: '#C7CC00' }}
                    />
                  </div>

                  <div className='space-y-2 sm:space-y-3'>
                    <div className='flex items-center text-gray-700'>
                      <Clock
                        className='w-4 h-4 mr-2 sm:mr-3'
                        style={{ color: '#5395B7' }}
                      />
                      <span className='text-xs sm:text-sm'>
                        Reporting: <strong>{race.reportingTime}</strong>
                      </span>
                    </div>
                    <div className='flex items-center text-gray-700'>
                      <Clock
                        className='w-4 h-4 mr-2 sm:mr-3'
                        style={{ color: '#C7CC00' }}
                      />
                      <span className='text-xs sm:text-sm'>
                        Start Time: <strong>{race.startTime}</strong>
                      </span>
                    </div>
                  </div>

                  <div className='mt-3 pt-3 border-t border-gray-200'>
                    <span
                      className='inline-block text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-semibold'
                      style={{ backgroundColor: '#2D4A9E' }}
                    >
                      {race.distance} Distance
                    </span>
                  </div>
                </div>
              ))}
            </div>
            */}
          </section>
        )}
        {/* 4. Route Map Section */}
        <section className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='p-8'>
            <h2
              className='text-3xl font-bold mb-4 text-center'
              style={{ color: '#2D4A9E' }}
            >
              Interactive Route Maps
            </h2>
            <p className='text-gray-600 text-center mb-8'>
              Explore detailed course maps and key information
            </p>
          </div>
          <div className='px-4 pb-8'>
            <div className='relative bg-gray-50 rounded-xl overflow-hidden'>
              <div className='bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                <div className='hidden sm:block w-full h-[60vh] sm:h-[70vh] md:aspect-video border border-gray-300 rounded-lg shadow-lg overflow-hidden'>
                  <iframe
                    src={map.pdfPath}
                    title='Route Map PDF'
                    className='w-full h-full'
                    loading='lazy'
                  />
                </div>
                <div className='block sm:hidden text-center py-8'>
                  <p className='text-gray-700 mb-4'>
                    Tap below to view the route map:
                  </p>
                  <a
                    href={map.pdfPath}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-block px-6 py-3 text-white rounded-lg shadow hover:opacity-90 transition'
                    style={{ backgroundColor: '#2D4A9E' }}
                  >
                    Open Route Map
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className='px-4 pb-12 space-y-6'>
            <div className='text-center pt-6'>
              <a
                href={map.pdfPath}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors'
                style={{ backgroundColor: '#2D4A9E' }}
              >
                <MapPin className='w-4 h-4 mr-2' />
                Download Full Route Map (PDF)
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
