import axios from "axios";
import { baseUrl } from "./apiConfig";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchEvents = async ({
  showOnWebsite = true,
}: {
  page?: number;
  perPage?: number;
  showOnWebsite?: boolean;
}) => {
  try {
    const response = await axiosInstance.get("/events/get-resultsascorder", {
      params: {
        status: "OPENFORREGISTRATION,REGISTRATIONCLOSED",
        showOnWebsite,
      },
    });

    const data = response.data;
    const totalCountHeader = response.headers["x-total-count"];

    return {
      data,
      headers: {
        "x-total-count": totalCountHeader ?? data.length.toString(),
      },
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    throw new Error("Failed to fetch events");
  }
};

export const getEventBySlug = async (slug: string) => {
  try {
    const response = await axiosInstance.get("/events/get-eventbyslug", {
      params: { slug },
    });

    const data = response.data;
    console.log("data", data);
    return { data };
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    throw new Error("Failed to fetch event");
  }
};

// export const getAllCoupons = async (eventId: string) => {
//   if (!eventId) return [];
//   try {
//     const response = await fetch(`${baseUrl}/coupons/getcoupons?eventId=${eventId}`);
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching coupons:", error);
//     return [];
//   }
// };

export const registerUserForEvent = async (formData: FormData) => {
  try {
    const response = await axios.post(`${baseUrl}/users/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error registering user:", error);
    throw new Error(error?.response?.data?.error || "Registration failed");
  }
};
