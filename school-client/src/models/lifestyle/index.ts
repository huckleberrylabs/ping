import { Establishment } from "../establishment";

export type Lifestyle = {
  Groceries: Establishment[];
  Shopping: Establishment[];
  Nightlife: Establishment[];
  Restaurants?: Establishment[];
  Cafes: Establishment[];
  Daycares: Establishment[];
  Parks: Establishment[];
};
