export interface IContact {
  phones?: Phone[];
  emails?: string[];
}

interface Phone {
  ext: string;
  number: string;
  label?: string;
}
