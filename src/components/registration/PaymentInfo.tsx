// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { baseUrl } from "@/lib/apiConfig";

// interface Category {
//   id: string;
//   name: string;
//   amount: number;
//   isRelay: string;
// }

// interface Event {
//   id: string;
//   slug: string;
//   category: Category[];
//   isGroupRegistrations: boolean;
//   emailBanner?: string;
// }

// interface RegisteredUser {
//   id: string;
//   categoryName: string;
//   teamName?: string;
//   teamContactPersonNumber?: string;
//   couponCode?: string;
// }

// interface Merchandise {
//   id: string;
//   price: number;
// }

// interface Coupon {
//   couponCode: string;
//   discountAmount?: number;
//   discountPercentage?: number;
// }

// interface FormValues {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   mobileNumber: string;
//   address: string;
//   state: string;
//   country: string;
//   pincode: string;
//   categoryName: string;
//   key_id: string;
//   amount: number;
//   paymentOrderId: string;
//   eventName: string;
//   category: string;
//   thumbnail: string;
//   membershipId?: string;
//   tShirtSize?: string;
//   couponCode?: string;
//   payableAmount: number;
//   applicationFee: number;
//   platformFee: number;
//   gst: number;
//   registeredUsers?: RegisteredUser[];
//   merchandiseId?: string;
// }

// interface PaymentInfoProps {
//   payAmount: number;
//   formValues: FormValues;
//   event: Event;
//   coupons?: Coupon[];
//   merchandise?: Merchandise[];
// }

// const PaymentInfo: React.FC<PaymentInfoProps> = ({
//   payAmount,
//   formValues,
//   event,
//   coupons,
//   merchandise,
// }) => {
//   const findMerchandise = merchandise?.find(
//     (item) => item.id === formValues?.merchandiseId
//   );
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastVariant, setToastVariant] = useState("");
//   const [isExpanded, setIsExpanded] = useState(false);

//   const router = useRouter();

//   const findCategory = event?.category?.find(
//     (item) => item?.name === formValues?.categoryName
//   );
//   const groupAmount =
//     formValues?.registeredUsers?.reduce((acc, user) => {
//       const category = event?.category?.find(
//         (item) => item?.name === user?.categoryName
//       );
//       return acc + (category?.amount ? Number(category.amount) : 0);
//     }, 0) || 0;

//   let relayCategory: Category | undefined;

//   if (
//     formValues?.registeredUsers &&
//     Array.isArray(formValues.registeredUsers) &&
//     formValues.registeredUsers.length > 0 &&
//     formValues.registeredUsers[0]
//   ) {
//     const firstUserCategory = formValues.registeredUsers[0].categoryName;
//     if (firstUserCategory && event?.category) {
//       relayCategory = event.category.find(
//         (item) => item?.name === firstUserCategory
//       );
//     }
//   }

//   const findCoupon = coupons?.find(
//     (item) =>
//       item?.couponCode?.toLowerCase() === formValues?.couponCode?.toLowerCase()
//   );

//   const currday = new Date();
//   const orderId = currday.getTime().toString();

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       window.localStorage.setItem("orderId", orderId);
//     }
//   }, [orderId]);

//   const sendNotifications = async () => {
//     try {
//       let runnerId = formValues?.id;

//       if (
//         (event?.isGroupRegistrations || relayCategory?.isRelay === "YES") &&
//         formValues?.registeredUsers &&
//         Array.isArray(formValues.registeredUsers) &&
//         formValues.registeredUsers.length > 0 &&
//         formValues.registeredUsers[0]?.id
//       ) {
//         runnerId = formValues.registeredUsers[0].id;
//       }

//       const response = await axios.post(
//         `${baseUrl}users/sendnotifications`,
//         null,
//         {
//           params: {
//             runnerId: runnerId,
//             eventId: event?.id,
//           },
//         }
//       );

//       if (response.status === 200) {
//         let successUserId = formValues?.id;
//         if (
//           (event?.isGroupRegistrations || relayCategory?.isRelay === "YES") &&
//           formValues?.registeredUsers &&
//           Array.isArray(formValues.registeredUsers) &&
//           formValues.registeredUsers.length > 0 &&
//           formValues.registeredUsers[0]?.id
//         ) {
//           successUserId = formValues.registeredUsers[0].id;
//         }

//         window.location.href = `https://www.novarace.in/pages/${event?.slug}/success/${successUserId}`;
//         console.log("Notifications sent successfully:", response.data);
//       } else {
//         console.warn("Failed to send notifications:", response.data);
//       }
//     } catch (error: any) {
//       console.error(
//         "Error sending notifications:",
//         error.response?.data?.error || error.message
//       );
//     }
//   };

//   const launchPayment = (e: React.MouseEvent) => {
//     e.preventDefault();

//     if (typeof window === "undefined" || !(window as any).Razorpay) {
//       setToastVariant("danger");
//       setToastMessage("Payment gateway not available");
//       setShowToast(true);
//       return;
//     }

//     const options = {
//       key: formValues.key_id,
//       amount: formValues.amount,
//       order_id: formValues.paymentOrderId,
//       name: formValues.eventName,
//       description: formValues.category,
//       thumbnail: formValues.thumbnail,
//       prefill: {
//         name: `${formValues.firstName} ${formValues.lastName}`,
//         email: `${formValues.email}`,
//         contact: `${formValues.mobileNumber}`,
//       },
//       notes: {
//         address: `${formValues.address}, ${formValues.state}, ${formValues.country}, ${formValues.pincode}`,
//       },
//       handler: function (response: any) {
//         setShowToast(true);
//         setToastVariant("success");
//         setToastMessage("Payment successful...");

//         let successUserId = formValues?.id;
//         if (
//           (event?.isGroupRegistrations || relayCategory?.isRelay === "YES") &&
//           formValues?.registeredUsers &&
//           Array.isArray(formValues.registeredUsers) &&
//           formValues.registeredUsers.length > 0 &&
//           formValues.registeredUsers[0]?.id
//         ) {
//           successUserId = formValues.registeredUsers[0].id;
//         }

//         window.location.href = `https://www.novarace.in/pages/${event?.slug}/success/${successUserId}`;
//       },
//     };

//     const rzp1 = new (window as any).Razorpay(options);
//     rzp1.open();

//     rzp1.on("payment.failed", function (response: any) {
//       setToastVariant("danger");
//       setToastMessage(`${response.error.description}`);
//       setShowToast(true);
//     });
//   };

//   const calculateDiscount = () => {
//     if (!findCoupon) return 0;

//     if (findCoupon.discountAmount) {
//       return findCoupon.discountAmount;
//     }

//     const baseAmount = event?.isGroupRegistrations
//       ? groupAmount
//       : relayCategory?.isRelay === "YES" && relayCategory?.amount
//       ? relayCategory.amount
//       : findCategory?.amount || 0;

//     return (baseAmount * (findCoupon?.discountPercentage || 0)) / 100;
//   };

//   return (
//     <>
//       <div className='container mx-auto text-center mt-5'>
//         <div className='flex justify-center'>
//           <div className='w-full md:w-2/3 lg:w-1/2 xl:w-1/3 px-4'>
//             <h3 className='text-2xl font-semibold mb-4'>Order Preview</h3>

//             <div className='overflow-x-auto shadow-lg rounded-lg'>
//               <table className='min-w-full table-auto border-collapse'>
//                 <tbody className='divide-y divide-gray-200'>
//                   <tr className='bg-gray-50'>
//                     <th className='p-3 text-left text-sm font-medium text-gray-700 whitespace-nowrap'>
//                       {event?.isGroupRegistrations
//                         ? "Total ticket price"
//                         : relayCategory?.isRelay === "YES"
//                         ? "Ticket Price"
//                         : "Ticket Price"}

//                       {(event?.isGroupRegistrations ||
//                         relayCategory?.isRelay === "YES") && (
//                         <button
//                           onClick={() => setIsExpanded(!isExpanded)}
//                           className='ml-2 text-blue-500 focus:outline-none'
//                           aria-label={
//                             isExpanded ? "Collapse details" : "Expand details"
//                           }
//                         >
//                           {isExpanded ? (
//                             <svg
//                               xmlns='http://www.w3.org/2000/svg'
//                               className='h-4 w-4 inline'
//                               fill='none'
//                               viewBox='0 0 24 24'
//                               stroke='currentColor'
//                             >
//                               <path
//                                 strokeLinecap='round'
//                                 strokeLinejoin='round'
//                                 strokeWidth={2}
//                                 d='M5 15l7-7 7 7'
//                               />
//                             </svg>
//                           ) : (
//                             <svg
//                               xmlns='http://www.w3.org/2000/svg'
//                               className='h-4 w-4 inline'
//                               fill='none'
//                               viewBox='0 0 24 24'
//                               stroke='currentColor'
//                             >
//                               <path
//                                 strokeLinecap='round'
//                                 strokeLinejoin='round'
//                                 strokeWidth={2}
//                                 d='M19 9l-7 7-7-7'
//                               />
//                             </svg>
//                           )}
//                         </button>
//                       )}
//                     </th>
//                     <td className='p-3 text-right font-semibold text-gray-900'>
//                       ₹{" "}
//                       {event?.isGroupRegistrations
//                         ? groupAmount
//                         : relayCategory?.isRelay === "YES" &&
//                           relayCategory?.amount
//                         ? relayCategory.amount
//                         : findCategory?.amount || 0}
//                     </td>
//                   </tr>

//                   {isExpanded &&
//                     (event?.isGroupRegistrations ||
//                       relayCategory?.isRelay === "YES") && (
//                       <tr>
//                         <td colSpan={2} className='p-0'>
//                           <table className='min-w-full table-auto border-collapse'>
//                             <thead className='bg-gray-100'>
//                               <tr>
//                                 <th className='p-2 text-xs font-semibold text-gray-700 text-left'>
//                                   Participant
//                                 </th>
//                                 <th className='p-2 text-xs font-semibold text-gray-700 text-left'>
//                                   Category
//                                 </th>
//                                 <th className='p-2 text-xs font-semibold text-gray-700 text-left'>
//                                   Amount
//                                 </th>
//                                 {formValues?.couponCode && (
//                                   <th className='p-2 text-xs font-semibold text-gray-700 text-left'>
//                                     Coupon
//                                   </th>
//                                 )}
//                               </tr>
//                             </thead>
//                             <tbody className='divide-y divide-gray-200'>
//                               {formValues?.registeredUsers?.map(
//                                 (user, index) => {
//                                   const category = event?.category?.find(
//                                     (item) => item?.name === user?.categoryName
//                                   );
//                                   const coupon = coupons?.find(
//                                     (item) =>
//                                       item?.couponCode === user.couponCode
//                                   );

//                                   return (
//                                     <tr key={index} className='bg-white'>
//                                       <td className='p-2 text-xs text-gray-700 whitespace-nowrap'>
//                                         Participant {index + 1}
//                                       </td>
//                                       <td className='p-2 text-xs text-gray-700 whitespace-nowrap'>
//                                         {user?.categoryName}
//                                       </td>
//                                       <td className='p-2 text-xs text-gray-700 whitespace-nowrap'>
//                                         ₹ {category?.amount || "0"}
//                                       </td>
//                                       {formValues?.couponCode && (
//                                         <td className='p-2 text-xs text-gray-700 whitespace-nowrap'>
//                                           {coupon?.couponCode || ""}
//                                         </td>
//                                       )}
//                                     </tr>
//                                   );
//                                 }
//                               )}
//                             </tbody>
//                           </table>
//                         </td>
//                       </tr>
//                     )}

//                   {findMerchandise && formValues?.tShirtSize && (
//                     <tr className='bg-white'>
//                       <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                         T-Shirt Size:
//                       </th>
//                       <td className='p-3 text-right font-semibold'>
//                         {formValues?.tShirtSize}
//                       </td>
//                     </tr>
//                   )}

//                   {findMerchandise && findMerchandise.price !== 0 && (
//                     <tr className='bg-gray-50'>
//                       <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                         Price:
//                       </th>
//                       <td className='p-3 text-right font-semibold'>
//                         ₹ {findMerchandise?.price}
//                       </td>
//                     </tr>
//                   )}

//                   {formValues?.membershipId && (
//                     <tr className='bg-white'>
//                       <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                         Membership Id:
//                       </th>
//                       <td className='p-3 text-right font-semibold'>
//                         {formValues?.membershipId}
//                       </td>
//                     </tr>
//                   )}

//                   {formValues?.registeredUsers &&
//                     formValues?.registeredUsers[0]?.teamName && (
//                       <>
//                         <tr className='bg-gray-50'>
//                           <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                             Team Name:
//                           </th>
//                           <td className='p-3 text-right font-semibold'>
//                             {formValues?.registeredUsers[0]?.teamName}
//                           </td>
//                         </tr>
//                         <tr className='bg-white'>
//                           <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                             Team Contact Person Number:
//                           </th>
//                           <td className='p-3 text-right font-semibold'>
//                             {
//                               formValues?.registeredUsers[0]
//                                 ?.teamContactPersonNumber
//                             }
//                           </td>
//                         </tr>
//                       </>
//                     )}

//                   {formValues?.couponCode && (
//                     <>
//                       <tr className='bg-gray-50'>
//                         <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                           Coupon Code Applied:
//                         </th>
//                         <td className='p-3 text-right font-semibold'>
//                           {formValues?.couponCode}
//                         </td>
//                       </tr>
//                       <tr className='bg-white'>
//                         <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                           Discount:
//                         </th>
//                         <td className='p-3 text-right font-semibold'>
//                           ₹ {calculateDiscount().toFixed(2)}
//                         </td>
//                       </tr>
//                     </>
//                   )}

//                   {formValues?.applicationFee > 0 && (
//                     <>
//                       <tr className='bg-gray-50'>
//                         <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                           Platform Charges:
//                         </th>
//                         <td className='p-3 text-right font-semibold'>
//                           ₹ {formValues?.applicationFee}
//                         </td>
//                       </tr>
//                       <tr className='bg-white'>
//                         <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                           GST On Platform Charges:
//                         </th>
//                         <td className='p-3 text-right font-semibold'>
//                           ₹{" "}
//                           {((formValues?.applicationFee * 18) / 100).toFixed(2)}
//                         </td>
//                       </tr>
//                     </>
//                   )}

//                   <tr className='bg-gray-50'>
//                     <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                       Payment Gateway Charges (2%):
//                     </th>
//                     <td className='p-3 text-right font-semibold'>
//                       ₹ {formValues?.platformFee}
//                     </td>
//                   </tr>

//                   <tr className='bg-white'>
//                     <th className='p-3 text-left text-sm font-medium text-gray-700'>
//                       GST On Payment Gateway Charges:
//                     </th>
//                     <td className='p-3 text-right font-semibold'>
//                       ₹ {formValues?.gst}
//                     </td>
//                   </tr>

//                   <tr className='bg-gray-100 border-t-2 border-gray-400'>
//                     <th className='p-3 text-left text-sm font-bold text-gray-800'>
//                       Estimated Total Payable*:
//                     </th>
//                     <td className='p-3 text-right font-bold text-green-600'>
//                       ₹ {formValues?.payableAmount}
//                     </td>
//                   </tr>

//                   <tr>
//                     <td colSpan={2} className='p-4 text-center'>
//                       <button
//                         className='px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors'
//                         onClick={(e) => {
//                           if (formValues.payableAmount === 0) {
//                             sendNotifications();
//                           } else {
//                             launchPayment(e);
//                           }
//                         }}
//                       >
//                         {formValues.payableAmount === 0 ||
//                         formValues.payableAmount === null
//                           ? "Complete Registration"
//                           : "Proceed to Pay"}
//                       </button>
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>

//               <div className='p-3 text-xs text-red-600'>
//                 * Please note: This is a preliminary total. Your payment gateway
//                 may calculate processing fees slightly differently at checkout.
//                 The exact amount will be displayed before you confirm payment.
//               </div>
//             </div>

//             {showToast && (
//               <div
//                 className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
//                   toastVariant === "success"
//                     ? "bg-green-100 text-green-800 border border-green-400"
//                     : "bg-red-100 text-red-800 border border-red-400"
//                 }`}
//               >
//                 <div className='flex items-center justify-between'>
//                   <strong className='text-sm font-medium'>Registration</strong>
//                   <button
//                     onClick={() => setShowToast(false)}
//                     className='text-gray-500 hover:text-gray-700 focus:outline-none'
//                   >
//                     <svg
//                       className='h-4 w-4'
//                       fill='none'
//                       viewBox='0 0 24 24'
//                       stroke='currentColor'
//                     >
//                       <path
//                         strokeLinecap='round'
//                         strokeLinejoin='round'
//                         strokeWidth={2}
//                         d='M6 18L18 6M6 6l12 12'
//                       />
//                     </svg>
//                   </button>
//                 </div>
//                 <div className='mt-2 text-sm'>{toastMessage}</div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default PaymentInfo;
