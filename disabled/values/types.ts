export type Organization = {
  id: UUID;
  name: string;
  description: string;
  foundedAt: TimeStamp;
  closedAt: TimeStamp;
  status: string;
  type: string;
  legalStructure: string;
  numberOfEmployees: number;
  revenue: number;
  industry: string;
};

export type Person = {
  id: UUID;
  name: PersonName;
  gender: string;
  dob: string;
  description: string;
  isQueensCounsel: string;
  awards: string[];
  education: string[];
  trusteeships: string[];
};
