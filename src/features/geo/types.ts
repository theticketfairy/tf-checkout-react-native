export interface CountryInfo {
  id: string;
  code: string;
  name: string;
}

export interface StateInfo {
  label: string;
  value: string;
  code: string; // ISO-2/state code for Stripe
}

export type CountriesResponse = CountryInfo[];

export type StatesResponse = StateInfo[];
