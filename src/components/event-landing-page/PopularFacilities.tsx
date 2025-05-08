// components/PopularFacilities.tsx
import Image from "next/image";
import type { StaticImageData } from "next/image";


import Tshirt from "../../../public/img/event-landing-page/tshirt.png";
import Medal from "../../../public/img/event-landing-page/medal.png";
import Chip from "../../../public/img/event-landing-page/chip.png";
import Gift from "../../../public/img/event-landing-page/souvenir.png";
import Certificate from "../../../public/img/event-landing-page/certificate.png";
import Hidrate from "../../../public/img/event-landing-page/water.png";
import NonTimed from "../../../public/img/event-landing-page/non-timed-bib.png";
import Breakfast from "../../../public/img/event-landing-page/breakfast.png";
import Refreshments from "../../../public/img/event-landing-page/refreshments.png";
import Certificate1 from "../../../public/img/event-landing-page/certificate-1.png";
import Physio from "../../../public/img/event-landing-page/physio.png";
import SelfiBooth from "../../../public/img/event-landing-page/selfi.png";
import OnlinePhotos from "../../../public/img/event-landing-page/onlinephotos.png";
import FinisherShield from "../../../public/img/event-landing-page/shield.png";

const giveAwayImages: Record<string, StaticImageData> = {
  "Race T-shirt": Tshirt,
  "Finisher's Medal": Medal,
  "Bib Number with timing chip": Chip,
  "Goodie Bag": Gift,
  "Finisher e-Certificate": Certificate,
  "Hydration Support": Hidrate,
  "Non Timed BIB": NonTimed,
  "Breakfast": Breakfast,
  "Refreshments": Refreshments,
  "Certificate": Certificate1,
  "Physio": Physio,
  "Selfie Booth": SelfiBooth,
  "Online Photos": OnlinePhotos,
  "Finisher shield": FinisherShield,
  "Race Tshirt (Excluding 3K Majja Run)": Tshirt,
  "Finisher Medal (Excluding 3K Majja Run)": Medal,
  "Bib with Timing Chip (Excluding 3K Majja Run)": Chip,
};

type GiveawayItem = {
  name: string;
};

type EventProps = {
  event?: {
    giveAway?: GiveawayItem[];
  };
};

const PopularFacilities = ({ event }: EventProps) => {
  return (
    <>
      {event?.giveAway?.map((item, index) => {
        const imageSrc = giveAwayImages[item.name];
        return (
          <div key={index} className="col-md-5 d-flex gap-2 items-center">
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={item.name}
                width={80}
                height={80}
                className="mr-2 w-20 h-20"
              />
            )}
            <div className="text-15">{item.name}</div>
          </div>
        );
      })}
    </>
  );
};

export default PopularFacilities;
