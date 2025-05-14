"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FormikProps } from "formik";
import Button from "../../components/ui/Button";

type CustomerInfoProps = {
  eventCategory: any;
  categoryMinimumAge: number;
  formik: FormikProps<{
    categoryName: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    gender: string;
    dateOfBirth: string;
    runnerClub?: string;
    tShirtSize: string;
    nameOfTheBib?: string;
    bloodGroup?: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
    country: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    medicalConditions?: string;
    couponCode?: string;
    hearAboutUs?: string;
    isPriorityLineUp?: boolean;
    jatreDistance?: string;
    timingSubmission?: string;
    garminLinks?: string;
    termsAndConditions: boolean;
  }>;
  categoryNames: string[];
  customSlug?: string;
  matchedAgeBracket: string;
  isMatched: boolean;
  isEmailVerificationEnabled?: boolean;
  isSmsVerificationEnabled?: boolean;
  findCoupon?: (couponCode: string) => Promise<void>;
  onRegisterClick?: () => void;
};

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  eventCategory,
  categoryMinimumAge,
  formik,
  categoryNames,
  customSlug,
  matchedAgeBracket,
  isMatched,
  isEmailVerificationEnabled = false,
  isSmsVerificationEnabled = false,
  findCoupon,
  onRegisterClick,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupPhoto, setShowPopupPhoto] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<any>(null);
  const [showBibOthersField, setShowBibOthersField] = useState(false);
  const [previewImages, setPreviewImages] = useState<string | null>(null);

  const IndianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      formik.setFieldValue("idCard", file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateAge = useMemo(() => {
    return (dateOfBirth: string) => {
      const birthDate = new Date(dateOfBirth);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();

      if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
          currentDate.getDate() < birthDate.getDate())
      ) {
        return age - 1;
      }

      return age;
    };
  }, []);

  const [age, setAge] = useState(
    formik.values.dateOfBirth ? calculateAge(formik.values.dateOfBirth) : 0
  );

  const handleDateChange = useCallback(
    (date: any) => {
      formik.setFieldTouched("dateOfBirth", true);
      const adjustedDate = new Date(date);
      adjustedDate.setMinutes(
        adjustedDate.getMinutes() - adjustedDate.getTimezoneOffset()
      );
      const utcDate = new Date(
        Date.UTC(
          adjustedDate.getFullYear(),
          adjustedDate.getMonth(),
          adjustedDate.getDate()
        )
      );
      formik.setFieldValue("dateOfBirth", utcDate.toISOString().split("T")[0]);

      const newAge = calculateAge(date);
      setAge(newAge);
    },
    [formik, calculateAge]
  );

  useEffect(() => {
    if (findCoupon && formik.values.couponCode) {
      const checkCoupon = async () => {
        if (formik.values.couponCode) {
          await findCoupon(formik.values.couponCode);
        }
      };
      checkCoupon();
    }
  }, [formik.values.couponCode, findCoupon]);

  useEffect(() => {
    if (customSlug && !formik.values.country) {
      if (customSlug.includes("india")) {
        formik.setFieldValue("country", "India");
      } else if (customSlug.includes("usa")) {
        formik.setFieldValue("country", "United States");
      } else {
        formik.setFieldValue("country", "India");
      }
    }
  }, [customSlug, formik]);

  return (
    <div className='w-full'>
      <div className='bg-white rounded-lg shadow-sm p-6'>
        {matchedAgeBracket && (
          <div
            className={`p-3 rounded-md text-center text-white mb-6 ${
              isMatched ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {matchedAgeBracket}
          </div>
        )}

        <h2 className='text-xl font-semibold mb-6'>Personal Information</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='col-span-1 md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Event Category <span className='text-red-500'>*</span>
            </label>
            <div className='space-y-3'>
              {eventCategory?.category?.map((category: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 
                    ${
                      formik.values.categoryName === category.name
                        ? `border-2 ${
                            isMatched ? "border-green-500" : "border-red-500"
                          } bg-gray-50`
                        : "border-gray-300"
                    }`}
                  onClick={() =>
                    formik.setFieldValue("categoryName", category.name)
                  }
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {hoveredCategory === category && (
                    <div className='absolute z-10 bg-white shadow-lg rounded-md p-3 border border-gray-200 text-sm w-64'>
                      <div className='font-medium'>
                        Registration Eligibility Criteria for{" "}
                        <span className='font-bold'>
                          {category.distance} KM
                        </span>
                      </div>
                      <div className='mt-1'>
                        Minimum Age:{" "}
                        <span className='font-bold'>{category.minimumAge}</span>{" "}
                        - Age Upto:{" "}
                        <span className='font-bold'>{category.maximumAge}</span>
                      </div>
                      <div>
                        Gender:{" "}
                        <span className='font-bold'>{category.gender}</span>
                      </div>
                    </div>
                  )}

                  <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold'>
                        {category.distance}
                      </div>
                      <div>
                        <p className='font-bold text-lg'>{category.name}</p>
                        <p className='text-gray-600'>{category?.description}</p>
                        <p className='flex items-center gap-1'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='1em'
                            height='1em'
                            viewBox='0 0 24 24'
                          >
                            <path
                              fill='currentColor'
                              d='M13.725 21L7 14v-2h3.5q1.325 0 2.288-.862T13.95 9H6V7h7.65q-.425-.875-1.263-1.437T10.5 5H6V3h12v2h-3.25q.35.425.625.925T15.8 7H18v2h-2.025q-.2 2.125-1.75 3.563T10.5 14h-.725l6.725 7z'
                            ></path>
                          </svg>
                          {category?.displayAmount &&
                          category?.displayAmount !== "undefined"
                            ? category?.displayAmount
                            : category?.amount}
                        </p>
                      </div>
                    </div>
                    <div>
                      <input
                        type='radio'
                        name='categoryName'
                        value={category.name}
                        className='h-5 w-5'
                        checked={formik.values.categoryName === category.name}
                        onChange={(e) =>
                          formik.setFieldValue("categoryName", e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        required
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {formik.touched.categoryName && formik.errors.categoryName && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.categoryName}
              </p>
            )}
          </div>

          <div className='col-span-1 md:col-span-2'>
            <h3 className='text-lg font-medium mb-4 border-b pb-2'>
              Basic Information
            </h3>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              First Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              disabled={!formik.values.categoryName}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.firstName && formik.errors.firstName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Last Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              disabled={!formik.values.categoryName}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.lastName && formik.errors.lastName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.lastName}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <input
                type='email'
                id='email'
                name='email'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={
                  isEmailVerificationEnabled || !formik.values.categoryName
                }
                className={`w-full p-2 border rounded-md ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                } ${isEmailVerificationEnabled ? "pr-20" : ""}`}
              />
              {isEmailVerificationEnabled && (
                <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 font-medium'>
                  Verified
                </span>
              )}
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className='mt-1 text-sm text-red-500'>{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Mobile Number <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <input
                type='tel'
                id='mobileNumber'
                name='mobileNumber'
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={
                  isSmsVerificationEnabled || !formik.values.categoryName
                }
                className={`w-full p-2 border rounded-md ${
                  formik.touched.mobileNumber && formik.errors.mobileNumber
                    ? "border-red-500"
                    : "border-gray-300"
                } ${isSmsVerificationEnabled ? "pr-20" : ""}`}
              />
              {isSmsVerificationEnabled && (
                <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 font-medium'>
                  Verified
                </span>
              )}
            </div>
            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.mobileNumber}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Biological Gender <span className='text-red-500'>*</span>
            </label>
            <select
              id='gender'
              name='gender'
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.gender && formik.errors.gender
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value=''>Please Select</option>
              <option value='MALE'>Male</option>
              <option value='FEMALE'>Female</option>
              <option value='OTHER'>Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.gender}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Date of Birth <span className='text-red-500'>*</span>
            </label>
            <div className='react-datepicker-wrapper w-full'>
              <input
                type='date'
                id='dateOfBirth'
                name='dateOfBirth'
                value={formik.values.dateOfBirth}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleDateChange(e.target.value);
                }}
                onBlur={formik.handleBlur}
                disabled={!formik.values.categoryName}
                className={`w-full p-2 border rounded-md ${
                  formik.touched.dateOfBirth && formik.errors.dateOfBirth
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.dateOfBirth}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Runner Club
            </label>
            <input
              type='text'
              id='runnerClub'
              name='runnerClub'
              value={formik.values.runnerClub || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='None'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              T-Shirt Size <span className='text-red-500'>*</span>
            </label>
            <select
              id='tShirtSize'
              name='tShirtSize'
              value={formik.values.tShirtSize}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.tShirtSize && formik.errors.tShirtSize
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value=''>Select Size</option>
              <option value='XS'>XS</option>
              <option value='S'>S</option>
              <option value='M'>M</option>
              <option value='L'>L</option>
              <option value='XL'>XL</option>
              <option value='XXL'>XXL</option>
              <option value='XXXL'>XXXL</option>
            </select>
            {formik.touched.tShirtSize && formik.errors.tShirtSize && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.tShirtSize}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'>
              Name on Bib
              <button
                type='button'
                onClick={() => setShowPopup(true)}
                className='text-blue-600 hover:text-blue-800'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M11.5 16.5h1V11h-1zm.5-6.923q.262 0 .439-.177t.176-.439t-.177-.438T12 8.346t-.438.177t-.177.439t.177.438t.438.177M12.003 21q-1.867 0-3.51-.708q-1.643-.709-2.859-1.924t-1.925-2.856T3 12.003t.709-3.51Q4.417 6.85 5.63 5.634t2.857-1.925T11.997 3t3.51.709q1.643.708 2.859 1.922t1.925 2.857t.709 3.509t-.708 3.51t-1.924 2.859t-2.856 1.925t-3.509.709'
                  ></path>
                </svg>
              </button>
            </label>
            <input
              type='text'
              id='nameOfTheBib'
              name='nameOfTheBib'
              value={formik.values.nameOfTheBib || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Same as first name if left empty'
            />
            {formik.touched.nameOfTheBib && formik.errors.nameOfTheBib && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.nameOfTheBib}
              </p>
            )}
          </div>

          {/* Blood Group */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Blood Group
            </label>
            <select
              id='bloodGroup'
              name='bloodGroup'
              value={formik.values.bloodGroup || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className='w-full p-2 border border-gray-300 rounded-md'
            >
              <option value=''>Select Blood Group</option>
              <option value='A+'>A+</option>
              <option value='A-'>A-</option>
              <option value='B+'>B+</option>
              <option value='B-'>B-</option>
              <option value='AB+'>AB+</option>
              <option value='AB-'>AB-</option>
              <option value='O+'>O+</option>
              <option value='O-'>O-</option>
            </select>
          </div>

          <div className='col-span-1 md:col-span-2'>
            <h3 className='text-lg font-medium mb-4 border-b pb-2 mt-4'>
              Address Information
            </h3>
          </div>

          <div className='col-span-1 md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Address <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='address'
              name='address'
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.address && formik.errors.address
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.address && formik.errors.address && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.address}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              City <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='city'
              name='city'
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.city && formik.errors.city
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.city && formik.errors.city && (
              <p className='mt-1 text-sm text-red-500'>{formik.errors.city}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Pincode <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='pincode'
              name='pincode'
              value={formik.values.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.pincode && formik.errors.pincode
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.pincode && formik.errors.pincode && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.pincode}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              State <span className='text-red-500'>*</span>
            </label>
            <select
              id='state'
              name='state'
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.state && formik.errors.state
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value=''>Select State</option>
              {IndianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {formik.touched.state && formik.errors.state && (
              <p className='mt-1 text-sm text-red-500'>{formik.errors.state}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Country <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='country'
              name='country'
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.country && formik.errors.country
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.country && formik.errors.country && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.country}
              </p>
            )}
          </div>

          <div className='col-span-1 md:col-span-2'>
            <h3 className='text-lg font-medium mb-4 border-b pb-2 mt-4'>
              Emergency Contact
            </h3>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Emergency Contact Name <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              id='emergencyContactName'
              name='emergencyContactName'
              value={formik.values.emergencyContactName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.emergencyContactName &&
                formik.errors.emergencyContactName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.emergencyContactName &&
              formik.errors.emergencyContactName && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.emergencyContactName}
                </p>
              )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Emergency Contact Number <span className='text-red-500'>*</span>
            </label>
            <input
              type='tel'
              id='emergencyContactNumber'
              name='emergencyContactNumber'
              value={formik.values.emergencyContactNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.emergencyContactNumber &&
                formik.errors.emergencyContactNumber
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.emergencyContactNumber &&
              formik.errors.emergencyContactNumber && (
                <p className='mt-1 text-sm text-red-500'>
                  {formik.errors.emergencyContactNumber}
                </p>
              )}
          </div>

          <div className='col-span-1 md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Medical Conditions
            </label>
            <textarea
              id='medicalConditions'
              name='medicalConditions'
              value={formik.values.medicalConditions || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Please mention any medical conditions or allergies'
              rows={3}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Coupon Code
            </label>
            <input
              type='text'
              id='couponCode'
              name='couponCode'
              value={formik.values.couponCode || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className='w-full p-2 border border-gray-300 rounded-md'
            />
          </div>

          <div className='col-span-1 md:col-span-2'>
            <div className='flex items-start mb-4'>
              <div className='flex items-center h-5'>
                <input
                  type='checkbox'
                  id='termsAndConditions'
                  name='termsAndConditions'
                  checked={formik.values.termsAndConditions}
                  onChange={formik.handleChange}
                  disabled={!formik.values.categoryName}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                    formik.touched.termsAndConditions &&
                    formik.errors.termsAndConditions
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
              <div className='ml-3 text-sm'>
                <label htmlFor='termsAndConditions' className='text-gray-700'>
                  I agree to the{" "}
                  <span className='text-blue-600 cursor-pointer'>
                    Terms and Conditions
                  </span>{" "}
                  and{" "}
                  <span className='text-blue-600 cursor-pointer'>
                    Privacy Policy
                  </span>
                </label>
                {formik.touched.termsAndConditions &&
                  formik.errors.termsAndConditions && (
                    <p className='mt-1 text-sm text-red-500'>
                      {formik.errors.termsAndConditions}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
