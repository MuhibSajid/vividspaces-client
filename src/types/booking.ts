export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  userName?: string;
  userEmail?: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  crewSize: string;
  totalPrice: number;
  status: BookingStatus;
};