"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import CustomerInfo from "@/components/registration/CustomerInfo";
import PaymentInfo from "../registration/PaymentInfo";
import BlockingLoader from "@/components/common/Loader";
import {
  getEventBySlug,
  getEarlyBirdCoupon,
  registerUserForEvent,
} from "@/lib/backendApis";
import MultipleCustomerInfo from "./MultipleCustomerInfo";
import MultipleCategory from "./MultipleCategory";

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

const useEvent = (eventSlug: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!eventSlug) return;

        const response = await getEventBySlug(eventSlug);
        if (response && response.data) {
          setEvent({
            ...response.data,
            emailBanner: response.data.emailBanner,
          });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setError("Failed to load event data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventSlug]);

  return { event, isLoading, error };
};

const useEarlyBirdCoupon = (eventId: string | undefined) => {
  const [earlyBirdCoupon, setEarlyBirdCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEarlyBirdCoupon = async () => {
      try {
        if (!eventId) return;

        setIsLoading(true);
        const response = await getEarlyBirdCoupon(eventId);

        if (!response || Array.isArray(response) || !("data" in response)) {
          throw new Error("Failed to fetch early bird coupon data");
        }

        if (
          response.data &&
          response.data.isActive === true &&
          response.data.expiresAt &&
          new Date(response.data.expiresAt) > new Date()
        ) {
          setEarlyBirdCoupon(response.data);
        } else {
          setEarlyBirdCoupon(null);
        }
      } catch (error) {
        console.log("Error fetching early bird coupon:", error);
        setEarlyBirdCoupon(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarlyBirdCoupon();
  }, [eventId]);

  return { earlyBirdCoupon, isLoading };
};

const calculateAge = (
  dateOfBirth: string,
  eventDate: string | undefined
): number => {
  if (!dateOfBirth) return 0;
  const birthDate = new Date(dateOfBirth);
  const compareDate = eventDate ? new Date(eventDate) : new Date();
  let age = compareDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = compareDate.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && compareDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const registerUser = async (
  formData: FormData,
  setFormValues: React.Dispatch<React.SetStateAction<FormValues | null>>,
  setFormSubmitted: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
  currentStep: number,
  formik: any,
  setCouponError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  try {
    const response = await registerUserForEvent(formData);

    if (!response) {
      throw new Error("No response received from server");
    }

    let responseData: any;

    try {
      if (typeof response.json === "function") {
        if (!response.ok) {
          const errorData = await response.json();
          if (
            errorData.error &&
            errorData.error.toLowerCase().includes("coupon")
          ) {
            setCouponError(errorData.error);
            throw new Error(errorData.error);
          }
          throw new Error(
            errorData.error ||
              `Registration failed with status: ${response.status}`
          );
        }
        responseData = await response.json();
      } else {
        responseData = response;

        if (
          responseData.error &&
          responseData.error.toLowerCase().includes("coupon")
        ) {
          setCouponError(responseData.error);
          throw new Error(responseData.error);
        }
      }
    } catch (jsonError: any) {
      if (
        jsonError.message &&
        jsonError.message.toLowerCase().includes("coupon")
      ) {
        setCouponError(jsonError.message);
        throw jsonError;
      }
      throw new Error("Failed to parse server response");
    }

    if (!responseData) {
      throw new Error("No data received from server");
    }

    setCouponError(null);

    if (responseData?.data) {
      setFormValues(responseData.data);
      setFormSubmitted(true);
      setCurrentStep(currentStep + 1);

      const updatedValues = {
        ...formik.values,
        ...responseData.data,
      };

      formik.setValues(updatedValues);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      if (responseData.id || responseData.orderId) {
        setFormValues({ ...formik.values, ...responseData });
        setFormSubmitted(true);
        setCurrentStep(currentStep + 1);
        formik.setValues({ ...formik.values, ...responseData });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error("Invalid response format from server");
      }
    }
    return responseData;
  } catch (error: any) {
    if (!error.message?.toLowerCase().includes("coupon")) {
      toast.error(error?.message || "Registration failed");
    }
    throw error;
  }
};

const MultipleBooking: React.FC = () => {
  const params = useParams();
  const slug = params?.slug;
  const eventSlug = typeof slug === "string" ? slug : "";
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formValues, setFormValues] = useState<FormValues | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [categoryMinimumAge, setCategoryMinimumAge] = useState<number>(0);
  const [categoryMaximumAge, setCategoryMaximumAge] = useState<number>(0);
  const [gender, setGender] = useState<string>("");
  const [matchedAgeBracket, setMatchedAgeBracket] = useState<string>("");
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Missing state variables
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastVariant, setToastVariant] = useState<string>("success");
  const [totalParticipants, setTotalParticipants] = useState<number>(0);

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [totalRegistrations, setTotalRegistrations] = useState<number>(0);
  const [newTotal, setNewTotal] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const [counts, setCounts] = useState<Record<string, any>>({});
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [registeredParticipants, setRegisteredParticipants] = useState<any[]>(
    []
  );
  const [findCoupon, setFindCoupon] = useState<Coupon | null>(null);

  const { event, isLoading: isEventLoading, error } = useEvent(eventSlug);
  const { earlyBirdCoupon } = useEarlyBirdCoupon(event?.id);

  const getInitialFormValues = (
    event: Event | null,
    earlyBirdCoupon: Coupon | null
  ): FormValues => ({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    gender: "",
    dateOfBirth: "",
    eventId: event?.id || null,
    eventName: event?.eventName || "",
    eventType: event?.eventType || "",
    eventSlug: event?.slug || "",
    registrationOpenDate: event?.regOpenDate || null,
    registrationCloseDate: event?.regCloseDate || null,
    eventDate: event?.date || null,
    location: event?.location || "",
    tShirtSize: "",
    address: "",
    city: "",
    pincode: "",
    state: "",
    country: event?.location?.split(", ").pop() || "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    categoryName: "",
    couponCode: earlyBirdCoupon?.couponCode || "",
    runnerClub: "None",
    company: "None",
    bibDistributionLocation: "",
    nameOfTheBib: "",
    bloodGroup: "",
    educationInstitution: "",
    medicalConditions: "",
    termsAndConditions: false,
    hearAboutUs: "",
    race: event?.race?.[0] || "",
    distance: "",
    eventTag: event?.tag || "",
    eventStatus: event?.status || "",
    platformFee: 0,
    whatsAppNumber: "",
    enableWhatsApp: false,
    teamName: "",
    teamContactPersonNumber: "",
  });

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: Yup.string()
      .required("Mobile Number is required")
      .matches(/^(?!0|(\+91))\d{10}$/, {
        message: "Mobile Number should be 10 digits without 0 or +91 prefix",
      }),
    gender: Yup.string().required("Gender is required"),
    dateOfBirth: Yup.date()
      .max(new Date(), "Date of Birth must be in the past")
      .required("Date of Birth is required"),
    tShirtSize: Yup.string().required("T-Shirt Size is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    pincode: Yup.string().required("Pincode is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    emergencyContactName: Yup.string().required(
      "Emergency Contact Name is required"
    ),
    emergencyContactNumber: Yup.string()
      .required("Emergency Contact Number is required")
      .test(
        "not-same-as-mobile",
        "Contact number and emergency contact number cannot be the same.",
        function (value) {
          return value !== this.parent.mobileNumber;
        }
      ),
    categoryName: Yup.string().required("Category Name is required"),
    termsAndConditions: Yup.boolean()
      .oneOf([true], "You must agree to the terms")
      .required("Terms acceptance is required"),

    teamName: Yup.string().when("categoryName", {
      is: (categoryName: string) => {
        const category = event?.category?.find(
          (cat) => cat.name === categoryName
        );
        return category?.isRelay === "YES";
      },
      then: () =>
        Yup.string().required("Team Name is required for relay events"),
      otherwise: () => Yup.string(),
    }),
    teamContactPersonNumber: Yup.string().when("categoryName", {
      is: (categoryName: string) => {
        const category = event?.category?.find(
          (cat) => cat.name === categoryName
        );
        return category?.isRelay === "YES";
      },
      then: () =>
        Yup.string()
          .required("Team Contact Number is required for relay events")
          .matches(/^(?!0|(\+91))\d{10}$/, {
            message:
              "Contact Number should be 10 digits without 0 or +91 prefix",
          }),
      otherwise: () => Yup.string(),
    }),
  });

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: getInitialFormValues(event, earlyBirdCoupon),
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setLoading(true);
        setCouponError(null);

        const age = calculateAge(values.dateOfBirth, event?.date);
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          if (
            value !== null &&
            value !== undefined &&
            ![
              "eventId",
              "eventName",
              "eventType",
              "eventSlug",
              "registrationOpenDate",
              "registrationCloseDate",
              "eventDate",
              "location",
              "race",
              "eventTag",
              "eventStatus",
              "nameOfTheBib",
            ].includes(key)
          ) {
            formData.append(key, String(value));
          }
        });

        formData.append("age", age.toString());
        formData.append(
          "nameOfTheBib",
          values.nameOfTheBib || `${values.firstName} ${values.lastName}`
        );

        if (event) {
          formData.append("eventId", String(event.id));
          formData.append("eventName", String(event.eventName));
          formData.append("eventType", String(event.eventType || ""));
          formData.append("eventSlug", String(event.slug));
          formData.append(
            "registrationOpenDate",
            String(event.regOpenDate || "")
          );
          formData.append(
            "registrationCloseDate",
            String(event.regCloseDate || "")
          );
          formData.append("eventDate", String(event.date || ""));
          formData.append("location", String(event.location || ""));
          formData.append("race", String(values.race || event.race?.[0] || ""));
          formData.append("eventTag", String(event.tag || ""));
          formData.append("eventStatus", String(event.status || ""));
        }

        try {
          const response = await registerUser(
            formData,
            setFormValues,
            setFormSubmitted,
            setCurrentStep,
            currentStep,
            formik,
            setCouponError
          );

          if (response) {
            const responseData = response.data || response;
            const updatedValues: FormValues = {
              ...values,
              ...responseData,
              couponCode: responseData.couponCode || values.couponCode || "",
              runnerClub:
                responseData.runnerClub || values.runnerClub || "None",
              company: responseData.company || values.company || "None",
              nameOfTheBib:
                responseData.nameOfTheBib ||
                values.nameOfTheBib ||
                `${values.firstName} ${values.lastName}`,
              bibDistributionLocation:
                responseData.bibDistributionLocation ||
                values.bibDistributionLocation ||
                "",
              bloodGroup: responseData.bloodGroup || values.bloodGroup || "",
              educationInstitution:
                responseData.educationInstitution ||
                values.educationInstitution ||
                "",
              medicalConditions:
                responseData.medicalConditions ||
                values.medicalConditions ||
                "",
              hearAboutUs: responseData.hearAboutUs || values.hearAboutUs || "",
              platformFee: responseData.platformFee || 0,
              eventId: event?.id || null,
              eventName: event?.eventName || "",
              eventType: event?.eventType || "",
              eventSlug: event?.slug || "",
              registrationOpenDate: event?.regOpenDate || null,
              registrationCloseDate: event?.regCloseDate || null,
              eventDate: event?.date || null,
              location: event?.location || "",
              race: event?.race?.[0] || "",
              eventTag: event?.tag || "",
              eventStatus: event?.status || "",
            };

            setFormValues(updatedValues);
            setFormSubmitted(true);
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });

            formik.setValues(updatedValues);
          }
        } catch (registerError: any) {
          if (registerError.message?.toLowerCase().includes("coupon")) {
            setCouponError(registerError.message);
            toast.error(registerError.message || "Invalid coupon code");
          } else {
            toast.error(
              registerError?.message || "Registration process failed"
            );
          }
        }
      } catch (error: any) {
        toast.error(error?.message || "Registration failed");
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Add the missing handleClickStep function
  const handleClickStep = (index: number) => {
    setCurrentStep(index);
  };

  // FIXED: Updated handleRegisterClick function with better validation
  const handleRegisterClick = () => {
    setButtonClicked(true);

    // If it's group registration or relay event and we're on step 0 (category selection)
    if (
      (event?.isGroupRegistrations || selectedCategory?.isRelay === "YES") &&
      currentStep === 0
    ) {
      // Validate the form for step 0 (category selection step)
      const categoryErrors = [];

      // Check if a category is selected
      if (!formik.values.categoryName) {
        categoryErrors.push("Please select a category");
      }

      // Check if any participants are added
      const totalCount = Object.values(counts).reduce((sum: number, count: any) => {
        return sum + (typeof count === 'number' ? count : (count?.count || 0));
      }, 0);

      if (totalCount === 0) {
        categoryErrors.push("Please add at least one participant");
      }

      // Relay-specific validations
      if (selectedCategory?.isRelay === "YES") {
        if (!formik.values.teamName?.trim()) {
          categoryErrors.push("Team name is required for relay events");
        }
        if (!formik.values.teamContactPersonNumber?.trim()) {
          categoryErrors.push("Team contact number is required for relay events");
        }
      }

      if (categoryErrors.length > 0) {
        setToastMessage(categoryErrors.join(", "));
        setToastVariant("danger");
        setShowToast(true);
        return;
      }

      // Move to next step (personal details)
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // For personal details step, validate and submit
      handleCustomerInfoSubmit();
    }
  };

  // FIXED: Updated category change handlers
  const handleCouponChange = (couponCode: string) => {
    formik.setFieldValue("couponCode", couponCode);
  };

  const handleTeamChange = (teamName: string) => {
    console.log("Team changed:", teamName);
    formik.setFieldValue("teamName", teamName);
  };

  const handleContactChange = (contactNumber: string) => {
    console.log("Contact changed:", contactNumber);
    formik.setFieldValue("teamContactPersonNumber", contactNumber);
  };

  // FIXED: Updated participants update handler
  const handleParticipantsUpdate = (
    totalParticipants: number,
    allEmpty: boolean
  ) => {
    console.log("Participants updated:", { totalParticipants, allEmpty });
    setTotalRegistrations(totalParticipants);
    setTotalParticipants(totalParticipants);
  };

  const handleStoreParticipants = (participants: any[]) => {
    console.log("Storing participants:", participants);
    setRegisteredParticipants(participants);
  };

  const handleFindCoupon = (couponCode: string) => {
    if (earlyBirdCoupon && earlyBirdCoupon.couponCode === couponCode) {
      setFindCoupon(earlyBirdCoupon);
    } else {
      setFindCoupon(null);
    }
  };


  const handleCategorySelect = (category: Category | null) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
    formik.setFieldValue("categoryName", category?.name || "");
    formik.setFieldValue("distance", category?.distance || "");

    setCounts({});
    setTotalAmount(0);
    setTotalRegistrations(0);
  };

  const handleCountUpdate = (categoryName: string, count: number, amount: number) => {
    console.log("Count updated:", { categoryName, count, amount });
    
    setCounts(prev => ({
      ...prev,
      [categoryName]: { count, amount }
    }));
    
    // Calculate total amount and registrations
    const newCounts = { ...counts, [categoryName]: { count, amount } };
    const totalCount = Object.values(newCounts).reduce((sum: number, item: any) => {
      return sum + (item?.count || 0);
    }, 0);
    
    const totalAmt = Object.values(newCounts).reduce((sum: number, item: any) => {
      return sum + ((item?.count || 0) * (item?.amount || 0));
    }, 0);
    
    setTotalRegistrations(totalCount);
    setTotalAmount(totalAmt);
    setTotalParticipants(totalCount);
  };

  const handleCustomerInfoSubmit = async () => {
    setButtonClicked(true);

    if (
      earlyBirdCoupon?.couponCode &&
      formik.values.couponCode !== earlyBirdCoupon.couponCode
    ) {
      formik.setFieldValue("couponCode", earlyBirdCoupon.couponCode);
    }

    const errors = await formik.validateForm();

    if (Object.keys(errors).length === 0) {
      formik.handleSubmit();
    } else {
      formik.setTouched(
        Object.keys(errors).reduce((acc, key) => {
          acc[key as keyof FormValues] = true;
          return acc;
        }, {} as Record<keyof FormValues, boolean>)
      );
    }
  };

  // Add effect for scrolling on loading
  useEffect(() => {
    if (isEventLoading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isEventLoading]);

  // Add effect to track currentStep changes
  useEffect(() => {
    console.log("Updated currentStep:", currentStep);
  }, [currentStep]);

  useEffect(() => {
    setNewTotal(totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    if (couponError) {
      setCouponError(null);
    }
  }, [formik.values.couponCode]);

  useEffect(() => {
    if (event && event.category) {
      const names = event.category.map((cat) => cat.name);
      setCategoryNames(names);
    }
  }, [event]);

  useEffect(() => {
    if (event && formik.values.categoryName) {
      const selectedCategory = event.category?.find(
        (cat) => cat.name === formik.values.categoryName
      );
      if (selectedCategory) {
        setCategoryMinimumAge(selectedCategory.minimumAge);
        setCategoryMaximumAge(selectedCategory.maximumAge);
        setGender(selectedCategory.gender);
        setSelectedCategory(selectedCategory);
        formik.setFieldValue("distance", selectedCategory.distance || "");
      }
    }
  }, [event, formik.values.categoryName]);

  useEffect(() => {
    const age = formik.values.dateOfBirth
      ? calculateAge(formik.values.dateOfBirth, event?.date)
      : 0;
    const gender = formik.values.gender;

    if (
      event?.category &&
      formik.values.categoryName &&
      formik.values.dateOfBirth
    ) {
      const selectedCategory = event.category.find(
        (cat) => cat.name === formik.values.categoryName
      );

      if ((selectedCategory?.ageBracket ?? []).length > 0) {
        const matchedBracket = selectedCategory?.ageBracket?.find((bracket) => {
          const isAgeInRange =
            age >= bracket.minimumAge && age <= bracket.maximumAge;
          const isGenderMatch =
            bracket.gender === "BOTH" ||
            bracket.gender === gender.toUpperCase();
          return isAgeInRange && isGenderMatch;
        });

        if (matchedBracket) {
          setMatchedAgeBracket(
            `You are registering in the ${matchedBracket.name} category of ${formik.values.categoryName}`
          );
        } else {
          setMatchedAgeBracket(
            `You are ineligible for ${formik.values.categoryName}. Please choose another category.`
          );
        }
      }
    }
  }, [
    formik.values.dateOfBirth,
    formik.values.gender,
    formik.values.categoryName,
    event,
  ]);

  useEffect(() => {
    setMatchedAgeBracket("");
  }, [formik.values.categoryName]);

  useEffect(() => {
    if (earlyBirdCoupon?.couponCode) {
      formik.setFieldValue("couponCode", earlyBirdCoupon.couponCode);
      setFindCoupon(earlyBirdCoupon);
    }
  }, [earlyBirdCoupon, formik]);

  useEffect(() => {
    setErrorList(Object.keys(formik.errors));
  }, [formik.errors]);

  const isMatched = matchedAgeBracket.startsWith("You are registering");

  const steps = [
    ...(event?.isGroupRegistrations || selectedCategory?.isRelay === "YES"
      ? [
          {
            title: "Group Registration",
            stepNo: "1",
            content: (
              <MultipleCategory
                findCoupon={findCoupon}
                eventIsLoading={isEventLoading}
                event={event}
                formik={formik as any}
                coupons={findCoupon ? [findCoupon] : []}
                setTotalAmount={setTotalAmount}
                handleCouponChange={handleCouponChange}
                handleTeamChange={handleTeamChange}
                handleContactChange={handleContactChange}
                setTotalRegistrations={setTotalRegistrations}
                setShow={setShow}
                setNewTotal={setNewTotal}
                counts={counts}
                setCounts={setCounts}
                selectedCategory={selectedCategory}
                setSelectedCategory={handleCategorySelect}
              />
            ),
          },
        ]
      : []),

    {
      title: "Personal Details",
      stepNo:
        event?.isGroupRegistrations || selectedCategory?.isRelay === "YES"
          ? "2"
          : "1",
      content: event ? (
        <MultipleCustomerInfo
          eventCategory={event}
          categoryMinimumAge={{ default: categoryMinimumAge }}
          formik={formik}
          categoryNames={categoryNames}
          customSlug={event.slug}
          matchedAgeBracket={matchedAgeBracket}
          isMatched={isMatched}
          findCoupon={handleFindCoupon}
          onParticipantsUpdate={handleParticipantsUpdate}
          handleStore={handleStoreParticipants}
          registeredParticipants={registeredParticipants}
          setRegisteredParticipants={setRegisteredParticipants}
          counts={counts}
        />
      ) : null,
    },

    {
      title: "Payment Details",
      stepNo:
        event?.isGroupRegistrations || selectedCategory?.isRelay === "YES"
          ? "3"
          : "2",
      content:
        event && formValues ? (
          <PaymentInfo
            formValues={formValues}
            payAmount={selectedCategory?.amount || event.category?.[0]?.amount}
            event={event}
          />
        ) : null,
    },
  ];
  if (isEventLoading) {
    return <BlockingLoader />;
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>Error</h2>
          <p className='text-gray-600'>{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>
            Event Not Found
          </h2>
          <p className='text-gray-600'>
            The requested event could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {loading && <BlockingLoader />}

      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            toastVariant === "danger" ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          <div className='flex items-center justify-between'>
            <span>{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className='ml-4 text-white hover:text-gray-200'
            >
              ×
            </button>
          </div>
        </div>
      )}

              <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <div className='flex items-center justify-between'>
            {steps.map((step, index) => (
              <div
                key={index}
                className='flex items-center cursor-pointer'
                onClick={() => handleClickStep(index)}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.stepNo}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    currentStep >= index
                      ? "text-blue-600 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 w-8 ${
                      currentStep > index ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          {steps[currentStep]?.content}

          <div className='flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200'>
            {currentStep > 0 && (
              <button
                type='button'
                onClick={() => setCurrentStep(currentStep - 1)}
                className='px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
              >
                Previous
              </button>
            )}

            {currentStep < steps.length - 1 && (
              <button
                type='button'
                onClick={handleRegisterClick}
                disabled={loading}
                className='px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            )}

            {currentStep === steps.length - 1 && !formSubmitted && (
              <button
                type='button'
                onClick={handleCustomerInfoSubmit}
                disabled={loading}
                className='px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {loading ? "Processing Payment..." : "Complete Registration"}
              </button>
            )}
          </div>
        </div>

        {(event?.isGroupRegistrations || selectedCategory?.isRelay === "YES") &&
          currentStep > 0 && (
            <div className='bg-white rounded-lg shadow-md p-6 mt-8'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                Registration Summary
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-blue-50 p-4 rounded-lg'>
                  <p className='text-sm text-blue-600 font-medium'>
                    Total Participants
                  </p>
                  <p className='text-2xl font-bold text-blue-800'>
                    {totalRegistrations}
                  </p>
                </div>
                <div className='bg-green-50 p-4 rounded-lg'>
                  <p className='text-sm text-green-600 font-medium'>Category</p>
                  <p className='text-lg font-semibold text-green-800'>
                    {formik.values.categoryName || "Not Selected"}
                  </p>
                </div>
                <div className='bg-purple-50 p-4 rounded-lg'>
                  <p className='text-sm text-purple-600 font-medium'>
                    Total Amount
                  </p>
                  <p className='text-2xl font-bold text-purple-800'>
                    ₹{totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedCategory?.isRelay === "YES" &&
                formik.values.teamName && (
                  <div className='mt-4 p-4 bg-yellow-50 rounded-lg'>
                    <p className='text-sm text-yellow-600 font-medium'>
                      Team Details
                    </p>
                    <p className='text-lg font-semibold text-yellow-800'>
                      {formik.values.teamName}
                    </p>
                    {formik.values.teamContactPersonNumber && (
                      <p className='text-sm text-yellow-600'>
                        Contact: {formik.values.teamContactPersonNumber}
                      </p>
                    )}
                  </div>
                )}
            </div>
          )}

        {earlyBirdCoupon && (
          <div className='bg-gradient-to-r from-orange-100 to-red-100 rounded-lg shadow-md p-6 mt-8'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>%</span>
              </div>
              <div>
                <h3 className='text-lg font-semibold text-orange-800'>
                  Early Bird Offer Available!
                </h3>
                <p className='text-sm text-orange-600'>
                  Use code{" "}
                  <span className='font-mono bg-white px-2 py-1 rounded'>
                    {earlyBirdCoupon.couponCode}
                  </span>{" "}
                  for {earlyBirdCoupon.discount}% discount
                </p>
                {earlyBirdCoupon.expiresAt && (
                  <p className='text-xs text-orange-500 mt-1'>
                    Expires:{" "}
                    {new Date(earlyBirdCoupon.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {buttonClicked && errorList.length > 0 && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mt-8'>
            <h4 className='text-red-800 font-medium mb-2'>
              Please fix the following errors:
            </h4>
            <ul className='list-disc list-inside text-sm text-red-600 space-y-1'>
              {errorList.map((error, index) => (
                <li key={index}>
                  {formik.errors[error as keyof FormValues] as string}
                </li>
              ))}
            </ul>
          </div>
        )}

        {couponError && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mt-8'>
            <div className='flex items-center gap-2'>
              <div className='w-5 h-5 bg-red-500 rounded-full flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>!</span>
              </div>
              <p className='text-red-800 font-medium'>{couponError}</p>
            </div>
          </div>
        )}
      </div>
 
  );
};

export default MultipleBooking;
