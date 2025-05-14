import { baseUrl } from './apiConfig';

export const fetchEvents = async ({
  showOnWebsite = true,
}: {
  page?: number;
  perPage?: number;
  showOnWebsite?: boolean;
}) => {
  const queryParams = new URLSearchParams({
    showOnWebsite: String(showOnWebsite),
  });

  const response = await fetch(`${baseUrl}/events/get-resultsascorder?status=OPENFORREGISTRATION,REGISTRATIONCLOSED`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await response.json();
  const totalCountHeader = response.headers.get("x-total-count");

  return {
    data,
    headers: {
      "x-total-count": totalCountHeader ?? data.length.toString(), 
    },
  };
};


export const getEventBySlug = async (slug: string) => {
  const response = await fetch(`${baseUrl}/events/get-eventbyslug?slug=${slug}`);

  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }

  const data = await response.json();
  console.log("data", data);
  return { data };
};
