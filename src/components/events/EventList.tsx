import Link from "next/link";

interface Event {
  id: string;
  eventName: string;
  slug:string,
  date: string;
  eventPicture?: string;
}

export default function EventList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-8">
        No events available at the moment.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {events.map((event) => (
        <Link href={`/events/${event.slug}`} key={event.id}>
          <div className="max-w-xs bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            {/* Event Image */}
            <div className="h-40 w-full bg-gray-200">
              <img
                src={event.eventPicture || "/placeholder.jpg"}
                alt={event.eventName}
                className="w-full h-full object-cover object-center rounded-t-lg"
              />
            </div>

            {/* Event Details */}
            <div className="p-4">
              {/* Event Name */}
              <h5 className="text-xl font-semibold text-gray-800 truncate">{event.eventName}</h5>
              
              {/* Event Date */}
              <p className="text-sm text-gray-600 mt-1">
                📅 {new Date(event.date).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
