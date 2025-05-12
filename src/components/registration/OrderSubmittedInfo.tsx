// 'use client';

// import React from 'react';
// import moment from 'moment';
// import Image from 'next/image';

// interface FormValues {
//   firstName: string;
//   lastName: string;
//   eventOrderId?: string;
//   categoryName?: string;
//   total?: number;
//   couponCode?: string;
//   transactionId?: string;
//   dateOfBirth: string | Date;
//   mobileNumber: string;
//   nameOfTheBib?: string;
//   gender?: string;
//   tShirtSize?: string;
// }

// interface Event {
//   emailBanner?: string;
// }

// interface OrderSubmittedInfoProps {
//   formValues: FormValues;
//   eventName: string;
//   event: Event;
// }

// const OrderSubmittedInfo: React.FC<OrderSubmittedInfoProps> = ({ 
//   formValues,
//   eventName,
//   event
// }) => {
//   const tableData = [
//     { field: 'OrderId', value: formValues?.eventOrderId || '-' },    
//     { field: 'Category', value: formValues?.categoryName || '-' },
//     { field: 'Subtotal', value: formValues?.total ? `₹${formValues.total}` : '-' },
//     { field: 'Processing Fees', value: '-' },
//     { field: 'Total', value: formValues?.total ? `₹${formValues.total}` : '-' },
//     { field: 'Coupon used', value: formValues.couponCode || '-' },
//     { field: 'Transaction ID', value: formValues?.transactionId || '-' },
//     { field: 'Date of birth', value: moment(formValues.dateOfBirth).format('DD-MM-YYYY') },
//     { field: 'Mobile number', value: formValues?.mobileNumber || '-' },
//     { field: 'Name on the bib', value: formValues?.nameOfTheBib || '-' },
//     { field: 'Gender', value: formValues?.gender || '-' },
//     { field: 'TShirt size', value: formValues?.tShirtSize || '-' },    
//   ];
  
//   return (
//     <div className="w-full flex justify-center items-center">
//       <div className="w-full lg:w-10/12 xl:w-10/12">
//         <div className="text-center mt-10 md:mt-10 sm:mt-6">
//           <div className="text-3xl font-semibold mt-5">
//             Your registration is Successful!
//           </div>
          
//           <div className="mt-5 bg-gray-50 p-6 rounded-lg shadow-md">
//             <div className="container mx-auto">
//               <div className="flex justify-center">
//                 <div className="w-full md:w-10/12">
//                   {event.emailBanner && (
//                     <div className="mb-4">
//                       <img
//                         src={event.emailBanner}
//                         className="w-full h-auto rounded-md"
//                         alt="Event Banner"
//                       />
//                     </div>
//                   )}
                  
//                   <p className="text-left text-green-600 mt-6">
//                     Dear <span className="font-semibold text-lg">{formValues.firstName + ' ' + formValues.lastName}</span>,
//                   </p>
                  
//                   <p className="text-left text-green-600">
//                     Thank you for registering for the <span className="font-semibold text-lg">{eventName}!</span>
//                   </p>
                  
//                   <p className="text-left text-green-600 mb-4">
//                     Please find your registration details below:
//                   </p>
                  
//                   <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {tableData.map((row, index) => (
//                           <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                             <td className="px-6 py-3 text-sm font-medium text-gray-900 text-left">
//                               {row.field}
//                             </td>
//                             <td className="px-6 py-3 text-sm text-gray-700 text-left">
//                               {row.value}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
                  
//                   <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
//                     <p className="text-green-800 text-sm">
//                       A confirmation email with these details has been sent to your registered email address.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderSubmittedInfo;