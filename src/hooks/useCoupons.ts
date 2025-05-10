import { useState, useEffect } from "react";

export const useCoupons = (eventId?: string) => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [findEarlyBirdCoupon, setFindEarlyBirdCoupon] = useState<any>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        if (!eventId) return;
        // Replace with your actual API call
        const response = await fetch(`/api/coupons?eventId=${eventId}`);
        const data = await response.json();
        setCoupons(data);
        
        // Find early bird coupon if any
        const earlyBird = data.find((coupon: any) => coupon.couponType === "EARLY_BIRD");
        setFindEarlyBirdCoupon(earlyBird || null);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, [eventId]);

  return { coupons, findEarlyBirdCoupon };
};