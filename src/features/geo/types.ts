export interface CountryInfo {
  id: string
  code: string
  name: string
}

export interface StateInfo {
  label: string
  value: number
}

export type CountriesResponse = CountryInfo[]

export type StatesResponse = StateInfo[]
