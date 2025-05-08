import React, { useState } from "react";
import PopularFacilities from "@/components/event-landing-page/PopularFacilities";
import  Link from "next/link";
import Head from "next/head";


// TypeScript types for props
interface CategoryDetail {
  amount: string;
}

interface Event {
  eventName: string;
  slug: string;
  eventPicture: string;
  category?: CategoryDetail[];
  location: string;
  giveAway?: any[];
  layout?: string;
}

interface GalleryTwoProps {
  event: Event;

}

const GalleryTwo: React.FC<GalleryTwoProps> = ({
  event,

}) => {


  const [isOpen, setOpen] = useState(false);
  let lowestAmount: number | null = null;

  if (event && event.category && Array.isArray(event.category) && event.category.length > 0) {
    const category = event.category;

    const isValidDetails = category.every(
      (detail) => detail && typeof detail === "object" && "amount" in detail
    );

    const findLowestAmount = (details: CategoryDetail[]) => {
      if (details.length === 0) {
        return null;
      }

      lowestAmount = parseFloat(details[0].amount);

      for (let i = 1; i < details.length; i++) {
        const currentAmount = parseFloat(details[i].amount);
        if (!isNaN(currentAmount) && currentAmount < lowestAmount) {
          lowestAmount = currentAmount;
        }
      }

      return lowestAmount;
    };

    if (isValidDetails) {
      findLowestAmount(category);
      console.log("Lowest amount:", lowestAmount);
    } else {
      console.log("category does not have the expected structure.");
    }
  } else {
    console.log("event.category is an empty array.");
  }

  let totalSelectedTickets = 0;
  let imageUrl = `https://www.novarace.in/pages/image?url=${event?.eventPicture}` || null;

  return (
    <>
      <style>
        {`
          .register-button-wrapper {
            margin-bottom: 3px;
            @media (min-width: 991px) {
              visibility: hidden;
            }
          }
        `}
      </style>
      {event && (
  <Head>
    <title>Novarace: {event.eventName}</title>
    <meta
      property="og:url"
      content={`https://www.novarace.in/pages/share/${event.slug}`}
    />
  </Head>
)}


      <section className="pt-40">
        <div className="container">
          <div className="hotelSingleGrid">
            <div className="">
              <div className="row justify-between items-end pt-10 y-gap-10">
                <div className="d-flex justify-end register-button-wrapper">
                  <Link
                    href={`/events/${event.slug}/register${event.layout ? `?layout=${event.layout}` : ""}`}
                    className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
                  >
                    Register <div className="icon-arrow-top-right ml-15" />
                  </Link>
                </div>

                <div className="col-auto">
                  <div className="row x-gap-20 items-center">
                    <div className="col-auto">
                      <h1 className="text-30 sm:text-25 fw-600">{event.eventName}</h1>
                    </div>
                  </div>

                  <div className="row x-gap-20 y-gap-20 items-center">
                    <div className="col-auto">
                      <div className="d-flex items-center text-15">
                        <i className="icon-location-2 text-16 mr-5" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>



                {event.slug === "skinathon-2025" && (
                  <>
                    <div className="col-12 border-top-light">
                      <h3 className="text-center fw-bold">About Organizer</h3>
                      <div className="d-flex justify-center align-items-center flex-column flex-md-row">
                        <div className="row justify-center align-items-center mt-2">
                          <div className="col-6 col-md-3">
                            <img
                              src="/img/general/skinathon4.png"
                              alt="image"
                              className="rounded-4 img-fluid"
                            />
                          </div>
                          <div className="col-6 col-md-3">
                            <img
                              src="/img/general/skinathon1.png"
                              alt="image"
                              className="rounded-4 img-fluid"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="fw-bold">IADVL Karnataka</span>
                        <br />
                        The Indian Association of Dermatologists Venereologists and Leprologists (IADVL)
                        came into existence on the 28th of January 1973 at Udaipur with the merger of
                        the Indian association of dermatologists and Venereologists (IADV) and the
                        dermatological society of India (DSI).
                      </div>
                    </div>
                  </>
                )}

                {event.slug === "toyota-bidadi-half-marathon-second-edition" && (
                  <>
                    <div className="col-12 border-top-light">
                      <h3 className="text-center fw-bold">About Organizer</h3>
                      <div className="d-flex justify-center align-items-center flex-column flex-md-row">
                        <div className="row justify-center align-items-center mt-2">
                          <div className="col-6 col-md-3">
                            <img
                              src="/img/general/BIA_Foundation_Logo2.png"
                              alt="image"
                              className="rounded-4 img-fluid"
                            />
                          </div>
                          <div className="col-4 col-md-2">
                            <img
                              src="/img/general/BIA_Foundation_Logo1.png"
                              alt="image"
                              className="rounded-4 img-fluid"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="fw-bold">Bidadi Industries Association (BIA)</span>
                        <br />
                        The association serves as a non-profit forum for members, addressing industry
                        challenges, advocating with authorities, and fostering solutions.
                      </div>
                      <div className="mt-3">
                        <span className="fw-bold">BIA Foundation</span>
                        <br />
                        Established on 22nd September 2023, the BIA Foundation is dedicated to driving
                        impactful change through initiatives focused on eradicating poverty and
                        malnutrition, promoting healthcare, education, gender equality, and
                        environmental sustainability.
                      </div>
                    </div>
                  </>
                )}

                {event.slug === "moonlight-track-run-2025" && (
                  <>
                    <div className="col-12 border-top-light">
                      <h3 className="text-center fw-bold">About Organizer</h3>
                      <div className="d-flex justify-center align-items-center flex-column flex-md-row">
                        <div className="row justify-center align-items-center mt-2">
                          <div className="col-6 col-md-3">
                            <img
                              src="/img/general/salemrunnerslogo.jpg"
                              alt="image"
                              className="rounded-4 img-fluid"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="fw-bold">Salem Runners Club</span>
                        <br />
                        Founded with the mission to inspire fitness in the community, Salem Runners
                        Club is one of Tamil Nadu’s most passionate running collectives.
                      </div>
                      <div className="mt-3">
                        <span className="fw-bold">Follow us on:</span>
                        <br />
                        Website:{" "}
                        <a
                          href="https://www.salemrunnersclub.com"
                          style={{ color: "#377bf6" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          www.salemrunnersclub.com
                        </a>
                        <br />
                        Instagram:{" "}
                        <a
                          href="https://www.instagram.com/salemrunnersclub"
                          style={{ color: "#377bf6" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          @salemrunnersclub
                        </a>
                        <br />
                        Facebook:{" "}
                        <a
                          href="https://www.facebook.com/salemrunnersindia"
                          style={{ color: "#377bf6" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          /salemrunnersclub
                        </a>
                      </div>
                    </div>
                  </>
                )}

                {event.giveAway && event.giveAway.length > 0 && (
                  <div className="col-12">
                    <h3 className="text-22 fw-500 pt-20 border-top-light">Give Away</h3>
                    <div className="row y-gap-10 pt-20">
                      <PopularFacilities event={event} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>

            </div>
          </div>

      </section>
    </>
  );
};

export default GalleryTwo;
