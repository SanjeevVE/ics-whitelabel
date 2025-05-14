import { baseUrl } from "@/lib/apiConfig";

export const getAllCoupons = async (eventId: string) => {
  if (!eventId) return [];
  try {
    const response = await fetch(
      `${baseUrl}/coupons/getcoupons?eventId=${eventId}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }
};

import { useState, useEffect } from "react";

export const useCoupons = (eventId?: string) => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [findEarlyBirdCoupon, setFindEarlyBirdCoupon] = useState<any>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      const data = await getAllCoupons(eventId!);
      setCoupons(data);

      const earlyBird = data.find(
        (coupon: any) => coupon.couponType === "EARLY_BIRD"
      );
      setFindEarlyBirdCoupon(earlyBird || null);
    };

    if (eventId) fetchCoupons();
  }, [eventId]);

  return { coupons, findEarlyBirdCoupon };
};
