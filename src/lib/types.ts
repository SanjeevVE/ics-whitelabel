export interface Event {
    id: string;
    eventName: string;
    slug: string;
    date: string;
    location: string;
    eventPicture?: string;
    tag: string
  }
  
  export interface EventResponse {
    data: Event[];
  }
  
  