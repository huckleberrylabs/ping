import { ID } from "../id";

export type DaysAvailable = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const DAYS_AVAILABLE_ARRAY = [1, 2, 3, 4, 5, 6, 7];
export const TIMES_AVAILABLE_MIN_LENGTH = 3;
export const TIMES_AVAILABLE_MAX_LENGTH = 32;

export type ShowingRequest = {
  userID: ID;
  propertyID: ID;
  daysAvailable: DaysAvailable[];
  timesAvailable: string;
  joinees: string[];
  createdAt?: string;
};
