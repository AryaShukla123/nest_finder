// Core domain types shared across the app.
// Keeping these centralized means every component, filter,
// and future API route agrees on the same shape.

export type ListingType = "buy" | "rent";

export type PropertyType =
  | "Apartment"
  | "Independent House"
  | "Villa"
  | "Studio"
  | "Plot";

export type Furnishing = "Furnished" | "Semi-Furnished" | "Unfurnished";

export type PostedBy = "Owner" | "Agent" | "Builder";

export type Amenity =
  | "Lift"
  | "Parking"
  | "Gym"
  | "Swimming Pool"
  | "Security"
  | "Power Backup"
  | "Club House";

export interface Property {
  id: number;
  title: string;
  type: PropertyType;
  bhk: number;
  city: string;
  locality: string;
  price: number; // raw numeric value in INR (or monthly rent in INR)
  priceLabel: string; // formatted display, e.g. "₹85 Lac"
  priceNote: string; // e.g. "onwards", "/ month"
  listingType: ListingType;
  area: number; // sq.ft
  beds: number;
  baths: number;
  furnishing: Furnishing;
  postedBy: PostedBy;
  rera: boolean;
  featured: boolean;
  daysAgo: number;
  img: string;
  agent: string;
  agentInitials: string;
  amenities: Amenity[];
  floor: string;
  society: string;
}

export interface PropertyFilters {
  cities: string[];
  types: PropertyType[];
  bhk: string[]; // "1" | "2" | "3" | "4" | "4+"
  furnishing: Furnishing[];
  postedBy: PostedBy[];
  budgetMinLac: number;
  budgetMaxLac: number; // 500 = "5Cr+"
  listingType: ListingType | null;
  search: string;
}

export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "area-desc"
  | "newest";