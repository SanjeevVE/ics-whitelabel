'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FormikProps } from 'formik';
import TermsAndConditionModal from './TermsAndConditionModal';
import { getRunnerClubs } from '../../lib/backendApis';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type EventCategoryType = {
  category: Array<{
    name: string;
    distance: string;
    description?: string;
    minimumAge?: number;
    maximumAge?: number;
    gender?: string;
    displayAmount?: string;
    amount?: number;
  }>;
  [key: string]: any;
};

type CustomerInfoProps = {
  eventCategory: EventCategoryType;
  categoryMinimumAge: number;
  formik: FormikProps<{
    categoryName: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    whatsAppNumber: string;
    enableWhatsApp: boolean;
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
    eventId: string | null;
    eventName: string;
    eventType: string;
    eventSlug: string;
    registrationOpenDate: string | null;
    registrationCloseDate: string | null;
    eventDate: string | null;
    location: string;
    race: string;
    distance: string;
    eventTag: string;
    eventStatus: string;
    couponCode?: string;
    hearAboutUs?: string;
    isPriorityLineUp?: boolean;
    jatreDistance?: string;
    timingSubmission?: string;
    garminLinks?: string;
    company: string;
    bibDistributionLocation: string;
    educationInstitution: string;
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

    termsAndConditions: boolean;
  }>;
  categoryNames: string[];
  customSlug?: string;
  matchedAgeBracket: string;
  isMatched: boolean;
  isEmailVerificationEnabled?: boolean;
  isSmsVerificationEnabled?: boolean;
  findCoupon?: (couponCode: string) => Promise<void>;
  earlyBirdCoupon?: string;
  onRegisterClick?: () => void;
  club?: string;
  baseUrl?: string;
  coupon?: any;
  earlyBird?: any;
  couponError?: string | null;
};

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  eventCategory,
  formik,
  matchedAgeBracket,
  isMatched,
  isEmailVerificationEnabled = false,
  isSmsVerificationEnabled = false,
  findCoupon,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'terms' | 'privacy'>('terms');

  const [runnerClubs, setRunnerClubs] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOthersField, setShowOthersField] = useState(false);
  const [otherClubName, setOtherClubName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClubs, setFilteredClubs] = useState(runnerClubs || []);
  const [showModal, setShowModal] = useState(false);

  const handleShowImage = () => setShowModal(true);
  const handleCloseImage = () => setShowModal(false);

  // Removed misplaced export default function TShirtImagePopup.

  const IndianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry',
  ];

  const openTermsModal = () => {
    setModalType('terms');
    setIsModalOpen(true);
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
    (date: unknown) => {
      formik.setFieldTouched('dateOfBirth', true);
      const adjustedDate = new Date(date as string);
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
      formik.setFieldValue('dateOfBirth', utcDate.toISOString().split('T')[0]);

      const newAge = calculateAge(date as string);
      setAge(newAge);
    },
    [formik, calculateAge]
  );

  const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    formik.setFieldValue('mobileNumber', value);
    formik.setFieldValue('whatsAppNumber', value);
  };

  const handleWhatsAppToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = e.target.checked;
    formik.setFieldValue('enableWhatsApp', isEnabled);

    if (isEnabled) {
      if (!formik.values.whatsAppNumber && formik.values.mobileNumber) {
        formik.setFieldValue('whatsAppNumber', formik.values.mobileNumber);
      }
    }
  };

  const handleWhatsAppNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    formik.setFieldValue('whatsAppNumber', value);
  };

  useEffect(() => {
    if (
      formik.values.enableWhatsApp &&
      formik.values.mobileNumber &&
      !formik.values.whatsAppNumber
    ) {
      formik.setFieldValue('whatsAppNumber', formik.values.mobileNumber);
    }
  }, [formik.values.enableWhatsApp, formik.values.mobileNumber]);

  useEffect(() => {
    const fetchRunnerClubs = async () => {
      setIsLoading(true);
      try {
        const response = await getRunnerClubs();

        let clubs = [];
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          Array.isArray((response as any).data)
        ) {
          clubs = (response as any).data;
        }

        const clubsWithOthers = [...clubs, { id: 'others', name: 'Others' }];
        setRunnerClubs(clubsWithOthers);
      } catch (error) {
        console.error('Error fetching runner clubs:', error);
        setRunnerClubs([{ id: 'others', name: 'Others' }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRunnerClubs();
  }, [eventCategory?.eventId]);

  const handleClubSelect = (clubName: string) => {
    setIsDropdownOpen(false);

    if (clubName === 'Others') {
      setShowOthersField(true);
      formik.setFieldValue('runnerClub', '');
    } else {
      setShowOthersField(false);
      formik.setFieldValue('runnerClub', clubName);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClubs(runnerClubs);
    } else {
      setFilteredClubs(
        runnerClubs.filter((club) =>
          club.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, runnerClubs]);

  const handleOtherClubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtherClubName(value);
    formik.setFieldValue('runnerClub', value);
  };

  const renderRunnerClubField = () => {
    return (
      <React.Fragment>
        <div className="relative">
          <div
            className={`w-full p-2 border rounded-md flex justify-between items-center cursor-pointer ${
              !formik.values.categoryName ? 'border-gray-300' : ''
            }`}
            onClick={() => {
              if (formik.values.categoryName) {
                setIsDropdownOpen(!isDropdownOpen);
              }
            }}
          >
            <span className="truncate">
              {formik.values.runnerClub || 'Select Runner Club'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              <div className="p-2">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-200 rounded-md"
                  placeholder="Search club..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

                  <div
      className="p-2 hover:bg-gray-100 cursor-pointer text-red-500 border-t border-gray-200"
      onClick={() => {
        handleClubSelect('');
        setIsDropdownOpen(false);
        setSearchTerm('');
      }}
    >
      Clear Selection
    </div>

              {isLoading ? (
                <div className="p-3 text-center text-gray-500">
                  Loading clubs...
                </div>
              ) : filteredClubs.length > 0 ? (
                <div>
                  {filteredClubs.map((club, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleClubSelect(club.name);
                        setIsDropdownOpen(false);
                        setSearchTerm('');
                      }}
                    >
                      {club.name}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-gray-500">
                  No matching clubs
                </div>
              )}
            </div>
          )}

          {showOthersField && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter your club name"
                value={otherClubName}
                onChange={handleOtherClubChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={!formik.values.categoryName}
              />
            </div>
          )}
        </div>
      </React.Fragment>
    );
  };

  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {matchedAgeBracket && (
          <div
            className={`p-3 rounded-md text-center text-white mb-6 ${
              isMatched ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {matchedAgeBracket}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Category <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {eventCategory?.category?.map((category: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 
                    ${
                      formik.values.categoryName === category.name
                        ? `border-2 ${
                            isMatched ? 'border-green-500' : 'border-red-500'
                          } bg-gray-50`
                        : 'border-gray-300'
                    }`}
                  onClick={() =>
                    formik.setFieldValue('categoryName', category.name)
                  }
                  onMouseEnter={() => setHoveredCategory(category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  {hoveredCategory === category && (
                    <div className="absolute z-10 bg-white shadow-lg rounded-md p-3 border border-gray-200 text-sm w-64">
                      <div className="font-medium">
                        Registration Eligibility Criteria for
                        <span className="font-bold">
                          {category.distance} KM
                        </span>
                      </div>
                      <div className="mt-1">
                        Minimum Age:
                        <span className="font-bold">
                          {category.minimumAge}
                        </span>{' '}
                        - Age Upto:
                        <span className="font-bold">{category.maximumAge}</span>
                      </div>
                      <div>
                        Gender:
                        <span className="font-bold">{category.gender}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold
                    w-10 h-10 text-xs
                    sm:w-12 sm:h-12 sm:text-sm
                    md:w-14 md:h-14 md:text-base"
                      >
                        {category.distance}
                      </div>
                      <div>
                        <p className="font-bold text-base sm:text-lg">
                          {category.name}
                        </p>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {category?.description}
                        </p>
                        <p className="flex items-center gap-1 text-sm sm:text-base">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1em"
                            height="1em"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              d="M13.725 21L7 14v-2h3.5q1.325 0 2.288-.862T13.95 9H6V7h7.65q-.425-.875-1.263-1.437T10.5 5H6V3h12v2h-3.25q.35.425.625.925T15.8 7H18v2h-2.025q-.2 2.125-1.75 3.563T10.5 14h-.725l6.725 7z"
                            ></path>
                          </svg>
                          {category?.displayAmount &&
                          category?.displayAmount !== 'undefined'
                            ? category?.displayAmount
                            : category?.amount}
                        </p>
                      </div>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="categoryName"
                        value={category.name}
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        checked={formik.values.categoryName === category.name}
                        onChange={(e) =>
                          formik.setFieldValue('categoryName', e.target.value)
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
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.categoryName}
              </p>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium mb-4 border-b pb-2">
              Basic Information
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              disabled={!formik.values.categoryName}
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.firstName && formik.errors.firstName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              disabled={!formik.values.categoryName}
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded-md ${
                formik.touched.lastName && formik.errors.lastName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.lastName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={
                  isEmailVerificationEnabled || !formik.values.categoryName
                }
                className={`w-full p-2 border rounded-md ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500'
                    : 'border-gray-300'
                } ${isEmailVerificationEnabled ? 'pr-20' : ''}`}
              />
              {isEmailVerificationEnabled && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 font-medium">
                  Verified
                </span>
              )}
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formik.values.mobileNumber}
                onChange={handleMobileNumberChange}
                onBlur={formik.handleBlur}
                disabled={
                  isSmsVerificationEnabled || !formik.values.categoryName
                }
                className={`w-full p-2 border rounded-md ${
                  formik.touched.mobileNumber && formik.errors.mobileNumber
                    ? 'border-red-500'
                    : 'border-gray-300'
                } ${isSmsVerificationEnabled ? 'pr-20' : ''}`}
              />
              {isSmsVerificationEnabled && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 font-medium">
                  Verified
                </span>
              )}
            </div>
            {formik.touched.mobileNumber && formik.errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.mobileNumber}
              </p>
            )}
          </div>

          {/* WhatsApp Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="enableWhatsApp"
                name="enableWhatsApp"
                checked={formik.values.enableWhatsApp}
                onChange={handleWhatsAppToggle}
                disabled={!formik.values.categoryName}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
              />
              <label
                htmlFor="enableWhatsApp"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Separate WhatsApp number
              </label>
            </div>

            {formik.values.enableWhatsApp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="whatsAppNumber"
                  name="whatsAppNumber"
                  value={formik.values.whatsAppNumber}
                  onChange={handleWhatsAppNumberChange}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.categoryName}
                  placeholder={
                    formik.values.mobileNumber || 'Enter WhatsApp number'
                  }
                  className={`w-full p-2 border rounded-md ${
                    formik.touched.whatsAppNumber &&
                    formik.errors.whatsAppNumber
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {formik.touched.whatsAppNumber &&
                  formik.errors.whatsAppNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.whatsAppNumber}
                    </p>
                  )}
                <p className="mt-1 text-xs text-gray-500">
                  {formik.values.whatsAppNumber === formik.values.mobileNumber
                    ? 'Using your mobile number for WhatsApp notifications'
                    : "We'll send event updates and notifications to this WhatsApp number"}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.gender && formik.errors.gender
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            >
              <option value="">Please Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.gender}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="react-datepicker-wrapper w-full">
              <DatePicker
                id="dateOfBirth"
                name="dateOfBirth"
                selected={
                  formik.values.dateOfBirth
                    ? new Date(formik.values.dateOfBirth)
                    : null
                }
                onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
                onBlur={formik.handleBlur}
                disabled={!formik.values.categoryName}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={`w-full p-2 border rounded-md ${
                  formik.touched.dateOfBirth && formik.errors.dateOfBirth
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
            </div>
            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.dateOfBirth}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RunnerClub / Apartment / CompanyName
            </label>
            {renderRunnerClubField()}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              T-Shirt Size <span className="text-red-500">*</span>
            </label>
            <select
              id="tShirtSize"
              name="tShirtSize"
              value={formik.values.tShirtSize}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.tShirtSize && formik.errors.tShirtSize
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            >
              <option value="">Select Size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
              <option value="XXXL">XXXL</option>
            </select>
            {formik.touched.tShirtSize && formik.errors.tShirtSize && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.tShirtSize}
              </p>
            )}
            <p
              onClick={handleShowImage}
              className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer"
            >
              View T-Shirt Size Chart
            </p>

            {showModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full relative">
                  <button
                    onClick={handleCloseImage}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                  >
                    &times;
                  </button>
                  <img
                    src={`/img/t-shirt-chart/SAP-T-shirtchart.jpg`}
                    alt="T-Shirt Size Chart"
                    className="w-full h-auto border rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* <div>
            <label className='block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2'>
              Name on Bib <span className='text-red-500'>*</span>
              <button
                type='button'
                onClick={() => setShowPopup(true)}
                className='text-blue-600 hover:text-blue-800'
              ></button>
            </label>
            <input
              type='text'
              id='nameOfTheBib'
              name='nameOfTheBib'
              value={formik.values.nameOfTheBib || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className='w-full p-2 border border-gray-300 rounded-md'
              placeholder=''
            />
            {formik.touched.nameOfTheBib && formik.errors.nameOfTheBib && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.nameOfTheBib}
              </p>
            )}
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Group <span className="text-red-500">*</span>
            </label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formik.values.bloodGroup || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.bloodGroup && formik.errors.bloodGroup
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            {formik.touched.bloodGroup && formik.errors.bloodGroup && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.bloodGroup}
              </p>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium mb-4 border-b pb-2 mt-4">
              Address Information
            </h3>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.address && formik.errors.address
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.address && formik.errors.address && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.address}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.city && formik.errors.city
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.city && formik.errors.city && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.pincode && formik.errors.pincode
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.pincode && formik.errors.pincode && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.pincode}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              name="state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.state && formik.errors.state
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            >
              <option value="">Select State</option>
              {IndianStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {formik.touched.state && formik.errors.state && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.country && formik.errors.country
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.country && formik.errors.country && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.country}
              </p>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-medium mb-4 border-b pb-2 mt-4">
              Emergency Contact
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="emergencyContactName"
              name="emergencyContactName"
              value={formik.values.emergencyContactName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.emergencyContactName &&
                formik.errors.emergencyContactName
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.emergencyContactName &&
              formik.errors.emergencyContactName && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.emergencyContactName}
                </p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="emergencyContactNumber"
              name="emergencyContactNumber"
              value={formik.values.emergencyContactNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className={`w-full p-2 border rounded-md ${
                formik.touched.emergencyContactNumber &&
                formik.errors.emergencyContactNumber
                  ? 'border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.emergencyContactNumber &&
              formik.errors.emergencyContactNumber && (
                <p className="mt-1 text-sm text-red-500">
                  {formik.errors.emergencyContactNumber}
                </p>
              )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical Conditions
            </label>
            <textarea
              id="medicalConditions"
              name="medicalConditions"
              value={formik.values.medicalConditions || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Please mention any medical conditions or allergies"
              rows={3}
            />
          </div>

          {/* <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Enter Coupon Code if Exist
            </label>
            <input
              type='text'
              id='couponCode'
              name='couponCode'
              value={formik.values.couponCode || earlyBirdCoupon || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={!formik.values.categoryName || !!earlyBirdCoupon}
              className={`w-full p-2 border rounded-md ${
              formik.touched.couponCode && formik.errors.couponCode
                ? "border-red-500"
                : "border-gray-300"
              }`}
            />
            {formik.touched.couponCode && formik.errors.couponCode && (
              <p className='mt-1 text-sm text-red-500'>
                {formik.errors.couponCode}
              </p>
            )}
          </div> */}

          <div className="col-span-1 md:col-span-2">
            <div className="flex items-start mb-4">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="termsAndConditions"
                  name="termsAndConditions"
                  checked={formik.values.termsAndConditions}
                  onChange={formik.handleChange}
                  disabled={!formik.values.categoryName}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                    formik.touched.termsAndConditions &&
                    formik.errors.termsAndConditions
                      ? 'border-red-500'
                      : ''
                  }`}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAndConditions" className="text-gray-700">
                  I agree to the {''}
                  <span
                    className="text-blue-600 cursor-pointer"
                    onClick={openTermsModal}
                  >
                    Terms and Conditions
                  </span>
                </label>
                {formik.touched.termsAndConditions &&
                  formik.errors.termsAndConditions && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.termsAndConditions}
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <TermsAndConditionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
      />
    </div>
  );
};

export default CustomerInfo;
