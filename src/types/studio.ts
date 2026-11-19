export type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity?: number;
  location: string;
  image: string;
  amenities?: string[];
  overview?: string;
  rating: number;
  reviewCount?: number;
  ownerName?: string;
  ownerEmail?: string;
};