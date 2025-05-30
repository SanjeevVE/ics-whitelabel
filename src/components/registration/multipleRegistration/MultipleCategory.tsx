"use client";

import React, { useState, useEffect } from "react";
import { FormikProps } from "formik";
import Link from "next/link";
import { useParams } from "next/navigation";
import moment from "moment";

interface Category {
  id: string;
  name: string;
  minimumAge: number;
  maximumAge: number;
  gender: string;
  distance: string;
  amount: number;
  displayAmount?: string;
  ageBracket: AgeBracket[];
  isRelay?: "YES" | "NO";
  teamLimit?: string;
}

interface AgeBracket {
  id: string;
  name: string;
  minimumAge: number;
  maximumAge: number;
  gender: string;
}

interface Event {
  id: string;
  eventName: string;
  eventType: string;
  slug: string;
  regOpenDate: string;
  regCloseDate: string;
  date: string;
  location: string;
  race: string[];
  tag: string;
  status: string;
  category: Category[];
  emailBanner?: string;
  isGroupRegistrations?: boolean;
  isGroupRegistration?: boolean;
  isRelay?: boolean;
  eventPicture?: string;
}

interface Coupon {
  id: string;
  couponCode?: string;
  couponType: string;
  discount: number;
  discountPercentage?: number;
  discountAmount?: number;
  eventId: string;
  expiryDate: string;
  isActive?: boolean;
  expiresAt?: string;
  earlyBird?: boolean;
}

interface MultipleCategoryProps {
  findCoupon: Coupon | null;
  eventIsLoading: boolean;
  event: Event | null;
  formik: FormikProps<any>;
  coupons: Coupon[];
  setTotalAmount: (amount: number) => void;
  handleCouponChange: (couponCode: string) => void;
  handleTeamChange: (teamName: string) => void;
  handleContactChange: (contactNumber: string) => void;
  setTotalRegistrations: (count: number) => void;
  setShow: (show: boolean) => void;
  setNewTotal: (total: number) => void;
  counts: Record<string, number>;
  setCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void; // Added this prop
}

const MultipleCategory: React.FC<MultipleCategoryProps> = ({
  findCoupon,
  eventIsLoading,
  event,
  formik,
  coupons,
  setTotalAmount,
  handleCouponChange,
  handleTeamChange,
  handleContactChange,
  setTotalRegistrations,
  setShow,
  setNewTotal,
  counts,
  setCounts,
  selectedCategory,
  setSelectedCategory, // Added this prop
}) => {
  const [categoryLimitIndex, setCategoryLimitIndex] = useState<number | null>(null);
  const [totalLimit, setTotalLimit] = useState<boolean>(false);
  const params = useParams();
  const slug = params?.slug as string;

  // Handle increment with limits
  const handleIncrement = (index: number) => {
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const currentCount = counts[index] || 0;
    const maxPerCategory = 4;
    const category = event?.category?.[index];

    if (!category) return;

    // Check category limit
    if (currentCount >= maxPerCategory) {
      setCategoryLimitIndex(index);
      setTimeout(() => {
        setCategoryLimitIndex(null);
      }, 2000);
      return;
    }

    // Check total limit
    if (total >= 10) {
      setTotalLimit(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        setTotalLimit(false);
      }, 2000);
      return;
    }

    // Set the selected category when incrementing
    if (!selectedCategory || selectedCategory.id !== category.id) {
      setSelectedCategory(category);
      // Also set it in formik for form validation
      formik.setFieldValue('categoryName', category.name);
      formik.setFieldValue('categoryId', category.id);
    }

    setCounts((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + 1,
    }));
  };

  // Handle decrement
  const handleDecrement = (index: number) => {
    const newCount = counts[index] > 0 ? counts[index] - 1 : 0;
    
    setCounts((prev) => ({
      ...prev,
      [index]: newCount,
    }));

    // If count becomes 0 and this was the selected category, clear selection
    if (newCount === 0 && selectedCategory?.id === event?.category?.[index]?.id) {
      // Check if there are other categories with counts > 0
      const hasOtherSelections = Object.entries(counts).some(([key, value]) => 
        parseInt(key) !== index && value > 0
      );
      
      if (!hasOtherSelections) {
        setSelectedCategory(null);
        formik.setFieldValue('categoryName', '');
        formik.setFieldValue('categoryId', '');
      }
    }
  };

  // Handle relay team setup
  useEffect(() => {
    if (selectedCategory?.isRelay === "YES" && event?.category?.length) {
      const catIndex = event?.category?.findIndex(item => item?.name === selectedCategory?.name);
      if (catIndex !== -1) {
        setCounts({ [catIndex]: parseInt(selectedCategory.teamLimit || "1", 10) });
      }
    }
  }, [selectedCategory, event, setCounts]);

  // Calculate totals
  const totalRegistrations = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const totalAmount = event?.category?.reduce(
    (sum, item, index) => sum + (counts[index] || 0) * item.amount,
    0
  ) || 0;

  // Update parent state with memoized values to prevent infinite loops
  useEffect(() => {
    const amount = selectedCategory ? selectedCategory.amount : totalAmount;
    const registrations = selectedCategory?.isRelay === "YES"
      ? parseInt(selectedCategory.teamLimit || "1", 10)
      : totalRegistrations;
      
    setTotalAmount(amount);
    setTotalRegistrations(registrations);
  }, [selectedCategory, totalAmount, totalRegistrations]);

  // Apply coupon
  const applyCoupon = () => {
    const couponCode = formik.values.couponCode?.trim();

    if (!findCoupon) {
      alert("Invalid coupon code!");
      return;
    }

    let discount = 0;
    if (findCoupon.discountPercentage) {
      discount = ((selectedCategory ? selectedCategory?.amount : totalAmount) * findCoupon.discountPercentage) / 100;
    } else if (findCoupon.discountAmount) {
      discount = findCoupon.discountAmount;
    }
    
    setNewTotal((selectedCategory ? selectedCategory?.amount : totalAmount) - discount);
    setShow(true);
  };

  // Loading state
  if (eventIsLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
              {event?.eventName}
            </h1>
            <h2 className="text-lg font-semibold text-gray-600 mt-2">
              {moment(event?.date).format("MMMM DD, YYYY")}
            </h2>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Coupon Section */}
            {event?.slug !== "moonlight-track-run-2025" && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Coupon Code
                    </label>
                    {findCoupon?.earlyBird && new Date(findCoupon?.expiresAt || '') > new Date() && (
                      <div className="text-blue-600 font-semibold text-sm mb-2">
                        Apply Early Bird Coupon: {findCoupon?.couponCode} Valid until{' '}
                        {moment(findCoupon?.expiresAt).format('MMMM D, YYYY')}
                      </div>
                    )}
                    <input
                      type="text"
                      id="couponCode"
                      name="couponCode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        formik.handleChange(e);
                        handleCouponChange(e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.couponCode || ""}
                      placeholder="Enter coupon code"
                    />
                    {formik.touched.couponCode && formik.errors.couponCode && (
                      <div className="text-red-500 text-sm mt-1 font-semibold">
                        {String(formik.errors.couponCode)}
                      </div>
                    )}
                  </div>
                  <div>
                    <button
                      className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={applyCoupon}
                      disabled={!formik.values.couponCode}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Total Limit Alert */}
            {totalLimit && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center font-bold">
                You can only select 10 tickets in total.
              </div>
            )}

            {/* Categories */}
            <div className="space-y-4">
              {event?.category?.map((item, index) => {
                const isRelay = item?.isRelay === "YES" && selectedCategory !== null;
                if (!event?.isGroupRegistrations && !isRelay) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    className={`border rounded-lg p-6 bg-white hover:shadow-md transition-shadow ${
                      selectedCategory?.id === item.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Category Name */}
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg font-bold text-gray-900">
                          {item?.name}
                        </h3>
                        {selectedCategory?.id === item.id && (
                          <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Selected
                          </span>
                        )}
                      </div>

                      {/* Category Details */}
                      <div className="flex-1 text-center">
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">Ticket Price</div>
                          <div className="text-xl font-bold text-green-600">
                            ₹ {item?.displayAmount && item?.displayAmount !== "undefined" 
                                ? item?.displayAmount 
                                : item?.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Age: <span className="font-semibold">{item?.minimumAge}</span> - <span className="font-semibold">{item?.maximumAge}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Gender: <span className="font-semibold">{item?.gender}</span>
                          </div>
                        </div>
                      </div>

                      {/* Counter/Add Button */}
                      <div className="flex-1 flex flex-col items-center gap-2">
                        {counts[index] > 0 && event?.isGroupRegistrations ? (
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                            <button
                              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center font-bold transition-colors"
                              onClick={() => handleDecrement(index)}
                            >
                              -
                            </button>
                            <div className="w-12 text-center font-bold text-lg">
                              {counts[index] || 0}
                            </div>
                            <button
                              className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center font-bold transition-colors"
                              onClick={() => handleIncrement(index)}
                            >
                              +
                            </button>
                          </div>
                        ) : (selectedCategory?.isRelay === "YES" && counts[index]) ? (
                          <div className="text-center">
                            <span className="text-sm text-gray-600">
                              Team members: {selectedCategory?.teamLimit}
                            </span>
                          </div>
                        ) : (
                          <button
                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold transition-colors"
                            onClick={() => handleIncrement(index)}
                          >
                            Add
                          </button>
                        )}
                        
                        <div className="text-sm font-semibold text-gray-700">
                          Total - ₹{(selectedCategory?.isRelay === "YES"
                            ? item?.amount
                            : (counts[index] || 0) * item?.amount
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Category Limit Alert */}
                    {categoryLimitIndex === index && (
                      <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center font-bold">
                        You can only select a maximum of 4 tickets for this category.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Team Details for Relay */}
            {selectedCategory?.isRelay === "YES" && (
              <div className="mt-8 p-6 bg-orange-50 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Team Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Team Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="teamName"
                      name="teamName"
                      onChange={(e) => {
                        formik.handleChange(e);
                        handleTeamChange(e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.teamName || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter team name"
                    />
                    {formik.touched.teamName && formik.errors.teamName && (
                      <div className="text-red-500 text-sm mt-1">{String(formik.errors.teamName)}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Team Primary Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="teamContactPersonNumber"
                      name="teamContactPersonNumber"
                      onChange={(e) => {
                        formik.handleChange(e);
                        handleContactChange(e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.teamContactPersonNumber || ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter contact number"
                    />
                    {formik.touched.teamContactPersonNumber && formik.errors.teamContactPersonNumber && (
                      <div className="text-red-500 text-sm mt-1">{String(formik.errors.teamContactPersonNumber)}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Summary Bar */}
        {totalRegistrations > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 z-50">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{totalRegistrations}</div>
                  <div className="text-sm text-gray-500">Registration(s)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">₹{totalAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Amount</div>
                </div>
                {selectedCategory && (
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600">{selectedCategory.name}</div>
                    <div className="text-xs text-gray-500">Selected Category</div>
                  </div>
                )}
              </div>
              <Link
                href={`/events/${slug}/register`}
                className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
                  totalRegistrations === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultipleCategory;