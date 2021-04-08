export interface IContact {
  phones?: IPhone[];
  emails?: string[];
}

export interface IPhone {
  ext: string;
  number: string;
  label?: string;
}
