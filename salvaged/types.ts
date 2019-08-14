export type Organization = {
  id: string;
  name: string;
  description: string;
  foundedAt: string;
  closedAt: string;
  status: string;
  type: string;
  legalStructure: string;
  numberOfEmployees: string;
  revenue: string;
  industry: string;
};

export type Person = {
  id: string;
  name: {
    first: string;
    last: string;
    middle: string;
    mailing: string;
    legal: string;
    full: string;
  };
  prefix: string;
  postix: string;
  gender: string;
  dob: string;
  description: string;
  isQueensCounsel: string;
  awards: string[];
  education: string[];
  trusteeships: string[];
};
