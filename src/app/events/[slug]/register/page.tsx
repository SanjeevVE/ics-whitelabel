"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getEventBySlug } from "@/lib/backendApis";

const StepperBooking = dynamic(
  () => import("@/components/registration/StepperBooking"),
  { ssr: false }
);

const LoadingComponent = () => (
  <div className='w-full flex justify-center items-center py-20'>
    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
  </div>
);

export default function RegisterPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationClosed, setRegistrationClosed] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!slug) return;
        const response = await getEventBySlug(slug);
        if (response && response.data) {
          setEvent(response.data);
          if (response.data.tag === "Closed" || response.data.status !== "OPENFORREGISTRATION") {
            setRegistrationClosed(true);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (registrationClosed) {
    return (
      <div className='container mx-auto md:px-4 md:py-8'>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 text-center">
          <h2 className="text-xl font-bold mb-2">Registrations are now officially closed!</h2>
          <p className="mb-2">Thank you for your incredible interest and overwhelming response.</p>
          <p>Stay tuned for exciting updates and future events—we look forward to seeing you soon!</p>
          <div className="mt-6">
            <Link href={`/events/${slug}`} className="text-blue-600 hover:underline">
              Return to event page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto md:px-4 md:py-8'>
      <h1 className='text-2xl md:text-3xl font-bold text-center mb-8'>
        Event Registration
      </h1>

      <Suspense fallback={<LoadingComponent />}>
        <StepperBooking />
      </Suspense>
    </div>
  );
}
