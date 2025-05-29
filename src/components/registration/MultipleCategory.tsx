import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import moment from "moment";
import BookingHeader from "../common/Header";
import BlockingLoader from "../common/Loader";
import { FormikProps } from "formik";

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

export interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  dateOfBirth: string;
  eventId: string | null;
  eventName: string;
  eventType: string;
  eventSlug: string;
  registrationOpenDate: string | null;
  registrationCloseDate: string | null;
  eventDate: string | null;
  location: string;
  tShirtSize: string;
  address: string;
  city: string;
  pincode: string;
  state: string;
  country: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  categoryName: string;
  couponCode?: string;
  runnerClub?: string;
  company: string;
  bibDistributionLocation: string;
  nameOfTheBib?: string;
  bloodGroup?: string;
  educationInstitution: string;
  medicalConditions?: string;
  termsAndConditions: boolean;
  hearAboutUs?: string;
  race: string;
  distance: string;
  eventTag: string;
  eventStatus: string;
  age?: number;
  platformFee?: number;
  id?: string;
  key_id?: string;
  amount?: number;
  paymentOrderId?: string;
  orderId?: string;
  paymentId?: string;
  paymentStatus?: string;
  paymentSignature?: string;
  paymentMode?: string;
  isPriorityLineUp?: boolean;
  jatreDistance?: string;
  timingSubmission?: string;
  garminLinks?: string;
  thumbnail?: string;
  membershipId?: string;
  payableAmount?: number;
  applicationFee?: number;
  gst?: number;
  gstOnPlatformCharges?: number;
  whatsAppNumber: string;
  enableWhatsApp: boolean;
  teamName?: string;
  teamContactPersonNumber?: string;
}

interface MultipleCategoryProps {
  findCoupon: Coupon | null;
  eventIsLoading: boolean;
  event: Event | null;
  formik: FormikProps<FormValues>;
  coupons: Coupon[];
  setTotalAmount: (amount: number) => void;
  handleCouponChange: (value: string) => void;
  handleTeamChange: (value: string) => void;
  handleContactChange: (value: string) => void;
  setTotalRegistrations: (count: number) => void;
  setShow: (show: boolean) => void;
  setNewTotal: (total: number) => void;
  counts: Record<number, number>;
  setCounts: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void; // Add this prop
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
  setSelectedCategory, // Add this prop
}) => {
  console.log(event, "event====");

  const [count, setCount] = useState<number>(0);
  const [showCounter, setShowCounter] = useState<boolean>(false);
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [categoryLimitIndex, setCategoryLimitIndex] = useState<number | null>(
    null
  );
  const [totalLimit, setTotalLimit] = useState<boolean>(false);

  const handleAddClick = (): void => {
    setCount(1);
    setShowCounter(true);
  };

  const handleIncrement = (index: number): void => {
    const category = event?.category?.[index];
    if (!category) return;

    // Set the selected category when user clicks add/increment
    if (!selectedCategory || selectedCategory.id !== category.id) {
      setSelectedCategory(category);
      // Update formik with category details
      formik.setFieldValue('categoryName', category.name);
      formik.setFieldValue('distance', category.distance);
      formik.setFieldValue('race', category.distance);
    }

    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    const currentCount = counts[index] || 0;
    const maxPerCategory = 4;

    setCounts((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + 1,
    }));
  };

  const handleDecrement = (index: number): void => {
    setCounts((prev) => {
      const newCounts = {
        ...prev,
        [index]: prev[index] > 0 ? prev[index] - 1 : 0,
      };
      
      // If all counts are 0, clear selected category
      const totalCount = Object.values(newCounts).reduce((sum, count) => sum + count, 0);
      if (totalCount === 0) {
        setSelectedCategory(null);
        formik.setFieldValue('categoryName', '');
        formik.setFieldValue('distance', '');
        formik.setFieldValue('race', '');
      }
      
      return newCounts;
    });
  };

  useEffect(() => {
    if (selectedCategory?.isRelay === "YES" && event?.category?.length) {
      const catIndex = event?.category?.findIndex(
        (item) => item?.name === selectedCategory?.name
      );
      setCounts({
        [catIndex]: parseInt(selectedCategory.teamLimit || "0", 10),
      });
    }
  }, [selectedCategory, event, setCounts]);

  const totalRegistrations = Object.values(counts).reduce(
    (sum, count) => sum + count,
    0
  );
  const totalAmount =
    event?.category?.reduce(
      (sum, item, index) => sum + (counts[index] || 0) * item.amount,
      0
    ) || 0;

  setTotalAmount(selectedCategory ? selectedCategory?.amount : totalAmount);
  setTotalRegistrations(
    selectedCategory?.isRelay === "YES"
      ? parseInt(selectedCategory?.teamLimit || "0", 10)
      : totalRegistrations
  );

  const applyCoupon = (): void => {
    const couponCode = formik.values.couponCode?.trim() || "";

    let discount = 0;
    if (findCoupon?.discountPercentage) {
      discount =
        ((selectedCategory ? selectedCategory?.amount : totalAmount) *
          findCoupon.discountPercentage) /
        100;
    } else if (findCoupon?.discountAmount) {
      discount = findCoupon.discountAmount;
    }
    setNewTotal(
      (selectedCategory ? selectedCategory?.amount : totalAmount) - discount
    );
    setShow(true);
  };

  return (
    <div>
      {eventIsLoading && <BlockingLoader />}

      <div className='flex justify-center items-center text-gray-800 bg-opacity-10'>
        <div
          className='bg-white border-0 shadow-lg pb-30 rounded-lg w-full max-w-4xl'

        >
          <div style={{ paddingBottom: "2%" }}>
            <h4 className='font-bold pt-5 text-xl text-center uppercase font-sans'>
              {event?.eventName}
            </h4>
            <h5 className='font-bold text-sm p-1 text-center font-sans'>
              {moment(event?.date).format("MMMM DD, YYYY")}
            </h5>
          </div>

          {event?.slug !== "moonlight-track-run-2025" && (
            <>
              <div className='px-3 py-1 grid grid-cols-1 md:grid-cols-12 gap-4 mt-2 justify-center items-end'>
                <div className='md:col-span-7'>
                  <label className='text-base font-bold'>Coupon Code</label>
                  {findCoupon?.earlyBird &&
                    new Date(findCoupon?.expiresAt || "") > new Date() && (
                      <div className='text-blue-600 font-semibold'>
                        {`Apply Early Bird Coupon: ${
                          findCoupon?.couponCode
                        } Valid until ${moment(findCoupon?.expiresAt).format(
                          "MMMM D, YYYY"
                        )}`}
                      </div>
                    )}
                </div>
              </div>

              <div className='px-3 py-1 grid grid-cols-1 md:grid-cols-12 gap-4 mb-2 justify-center items-start'>
                <div className='md:col-span-4'>
                  <input
                    type='text'
                    id='couponCode'
                    name='couponCode'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleCouponChange(e.target.value);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.couponCode || ""}
                  />
                  {formik.touched.couponCode && formik.errors.couponCode && (
                    <div className='text-red-500 font-bold'>
                      {formik.errors.couponCode}
                    </div>
                  )}
                </div>
                <div className='md:col-span-3 text-center md:text-left'>
                  <button
                    className='bg-indigo-700 text-white h-12 rounded px-6 w-full md:w-auto'
                    onClick={applyCoupon}
                    disabled={!formik.values.couponCode}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </>
          )}

          {totalLimit && (
            <div
              className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-1/2 mx-auto text-center font-bold'
              role='alert'
            >
              You can only select 10 tickets in total.
            </div>
          )}

          {event?.category &&
            event?.category?.map((item, index) => {
              const isRelay =
                item?.isRelay === "YES" && selectedCategory?.isRelay === "YES";
              if (!event?.isGroupRegistrations && !isRelay) {
                return null;
              }

              return (
                <div
                  key={index}
                  className='grid grid-cols-1 md:grid-cols-12 gap-4 border rounded-lg mx-4 mb-2 py-4 items-center'
                >
                  <div
                    className='md:col-span-3 text-center font-bold'
                    style={{
                      fontSize: item?.name?.length > 5 ? "1rem" : "1.25rem",
                    }}
                  >
                    {item?.name}
                  </div>

                  <div
                    className='md:col-span-6 text-center'
                    style={{ lineHeight: "26px" }}
                  >
                    <span className='text-lg font-normal'>Ticket Price</span>
                    <br />
                    <span className='font-bold py-2 text-xl'>
                      ₹{" "}
                      {item?.displayAmount &&
                      item?.displayAmount !== "undefined"
                        ? item?.displayAmount
                        : item?.amount}
                    </span>
                    <br />
                    <span className='text-sm'>
                      Minimum Age: <b>{item?.minimumAge}</b> - Age Upto:{" "}
                      <b>{item?.maximumAge}</b>
                    </span>
                    <br />
                    <span className='text-sm'>
                      Gender: <b>{item?.gender}</b>
                    </span>
                  </div>

                  <div className='md:col-span-3 text-center mt-3 md:mt-0'>
                    {counts[index] > 0 && event?.isGroupRegistrations ? (
                      <div className='flex items-center justify-center space-x-4'>
                        <button
                          className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l'
                          onClick={() => handleDecrement(index)}
                        >
                          -
                        </button>
                        <div className='bg-gray-100 py-2 px-4'>
                          <span>{counts[index] || 0}</span>
                        </div>
                        <button
                          className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r'
                          onClick={() => handleIncrement(index)}
                        >
                          +
                        </button>
                      </div>
                    ) : selectedCategory?.isRelay === "YES" && counts ? (
                      <div>
                        <span>Team members: {selectedCategory?.teamLimit}</span>
                      </div>
                    ) : (
                      <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={() => handleIncrement(index)}
                      >
                        Add
                      </button>
                    )}
                    <div className='mt-2 font-bold'>
                      Total - ₹{" "}
                      {selectedCategory?.isRelay === "YES"
                        ? item?.amount
                        : (counts[index] || 0) * item?.amount}
                    </div>
                  </div>

                  {categoryLimitIndex === index && (
                    <div
                      className='col-span-12 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-1/2 mx-auto text-center font-bold'
                      role='alert'
                    >
                      You can only select a maximum of {counts[index]} tickets
                      for this category.
                    </div>
                  )}
                </div>
              );
            })}

          {selectedCategory?.isRelay === "YES" && (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 m-2'>
              <div>
                <label className='text-base font-bold'>
                  Team Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='teamName'
                  name='teamName'
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleTeamChange(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.teamName || ""}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {formik.touched.teamName && formik.errors.teamName && (
                  <div className='text-red-500'>{formik.errors.teamName}</div>
                )}
              </div>

              <div>
                <label className='text-base font-bold'>
                  Team Primary Contact Number{" "}
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='teamContactPersonNumber'
                  name='teamContactPersonNumber'
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleContactChange(e.target.value);
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.teamContactPersonNumber || ""}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
                {formik.touched.teamContactPersonNumber &&
                  formik.errors.teamContactPersonNumber && (
                    <div className='text-red-500'>
                      {formik.errors.teamContactPersonNumber}
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleCategory;