export interface IAddress {
  country?: string;
  city: string;
  address: string;
  flat?: string;
  postalCode?: number;
  additional?: string;
  coordinate?: {
    long: number;
    lat: number;
  };
}
