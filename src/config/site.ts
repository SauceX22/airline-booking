import { type SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Airline Booking",
  description: "Book your flight today with our airline booking system.",
  url: "https://github.com/SauceX22",
  ogImage: "https://avatars.githubusercontent.com/u/66734989?v=4",
  links: {
    twitter: "https://twitter.com/SauceX22",
    github: "https://github.com/SauceX22/airline-booking",
  },
};

export const ECONOMY_WEIGHT = 20;
export const BUSINESS_WEIGHT = 50;
export const FIRSTCLASS_WEIGHT = 100;

export const ECONOMY_PRICE = 80;
export const BUSINESS_PRICE = 200;
export const FIRSTCLASS_PRICE = 300;

export enum SeatClassWeightRestriction {
  "ECONOMY" = ECONOMY_WEIGHT,
  "BUSINESS" = BUSINESS_WEIGHT,
  "FIRSTCLASS" = FIRSTCLASS_WEIGHT,
}

export enum SeatClassPriceRestriction {
  "ECONOMY" = ECONOMY_PRICE,
  "BUSINESS" = BUSINESS_PRICE,
  "FIRSTCLASS" = FIRSTCLASS_PRICE,
}
