export default function StepperBooking() {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">1</div>
          <span>Registration</span>
          <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center">2</div>
          <span>Details</span>
          <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center">3</div>
          <span>Confirmation</span>
        </div>
      </div>
    );
  }
  