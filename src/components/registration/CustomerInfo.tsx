"use client";

import React, { useEffect } from "react";
import { FormikProps } from "formik";

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
    termsAndConditions: boolean;
  }>;
  categoryNames: string[];
  customSlug?: string;
  matchedAgeBracket: string;
  isMatched: boolean;
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
  findCoupon,
  onRegisterClick,
}) => {
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

  return (
    <div className='w-full'>
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h2 className='text-xl font-semibold mb-6'>Personal Information</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Event Category <span className='text-red-500'>*</span>
            </label>
            <select
              id='categoryName'
              name='categoryName'
              value={formik.values.categoryName}
              onChange={(e) => {
                console.log("Selected category:", e.target.value);
                formik.handleChange(e);
              }}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.categoryName && formik.errors.categoryName
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value=''>Select Category</option>
              {categoryNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {formik.touched.categoryName && formik.errors.categoryName && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.categoryName}
              </p>
            )}
            {matchedAgeBracket && (
              <p
                className={`mt-2 text-sm ${
                  isMatched ? "text-green-600" : "text-red-600"
                }`}
              >
                {matchedAgeBracket}
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
            <input
              type='email'
              id='email'
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className='mt-1 text-sm text-red-500'>{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Mobile Number <span className='text-red-500'>*</span>
            </label>
            <input
              type='tel'
              id='mobileNumber'
              name='mobileNumber'
              value={formik.values.mobileNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.mobileNumber && formik.errors.mobileNumber
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.mobileNumber}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Gender <span className='text-red-500'>*</span>
            </label>
            <select
              id='gender'
              name='gender'
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.gender && formik.errors.gender
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value=''>Select Gender</option>
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
            <input
              type='date'
              id='dateOfBirth'
              name='dateOfBirth'
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.dateOfBirth && formik.errors.dateOfBirth
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
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
              value={formik.values.runnerClub}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Name on Bib
            </label>
            <input
              type='text'
              id='nameOfTheBib'
              name='nameOfTheBib'
              value={formik.values.nameOfTheBib}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Same as first name if left empty'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Blood Group
            </label>
            <select
              id='bloodGroup'
              name='bloodGroup'
              value={formik.values.bloodGroup}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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
            <input
              type='text'
              id='state'
              name='state'
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.state && formik.errors.state
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
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
            <h3 className='text-lg font-medium mb-4 border-b pb-2 mt-4'>
              Additional Information
            </h3>
          </div>

          <div className='col-span-1 md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Medical Conditions
            </label>
            <textarea
              id='medicalConditions'
              name='medicalConditions'
              value={formik.values.medicalConditions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={3}
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Enter any medical conditions we should be aware of'
            ></textarea>
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
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder='Enter coupon code if you have one'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              How did you hear about us?
            </label>
            <select
              id='hearAboutUs'
              name='hearAboutUs'
              value={formik.values.hearAboutUs || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className='w-full p-2 border border-gray-300 rounded-md'
            >
              <option value=''>Select an option</option>
              <option value='SOCIAL_MEDIA'>Social Media</option>
              <option value='FRIEND'>Friend or Family</option>
              <option value='EMAIL'>Email</option>
              <option value='SEARCH'>Search Engine</option>
              <option value='EVENT'>Another Event</option>
              <option value='OTHER'>Other</option>
            </select>
          </div>

          <div className='col-span-1 md:col-span-2 mt-4'>
            <div className='flex items-start'>
              <div className='flex items-center h-5'>
                <input
                  id='termsAndConditions'
                  name='termsAndConditions'
                  type='checkbox'
                  checked={formik.values.termsAndConditions || false}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
                />
              </div>
              <div className='ml-3 text-sm'>
                <label
                  htmlFor='termsAndConditions'
                  className='font-medium text-gray-700'
                >
                  I agree to the{" "}
                  <a href='#' className='text-blue-600 hover:underline'>
                    Terms and Conditions
                  </a>{" "}
                  <span className='text-red-500'>*</span>
                </label>
                {formik.touched.termsAndConditions &&
                  formik.errors.termsAndConditions && (
                    <p className='mt-1 text-sm text-red-500'>
                      {formik.errors.termsAndConditions}
                    </p>
                  )}
              </div>
              <div className='col-span-1 md:col-span-2 mt-6'>
                <button
                  type='button'
                  onClick={onRegisterClick}
                  disabled={
                    !formik.isValid || !formik.values.termsAndConditions
                  }
                  className={`w-full py-3 rounded-md text-white font-semibold transition-colors duration-300 ${
                    formik.isValid && formik.values.termsAndConditions
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
