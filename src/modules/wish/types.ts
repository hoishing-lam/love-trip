export type Gender = 'girl' | 'boy';

export interface Wish {
  owners: Gender[];
  achived: boolean;
  desc: string;
}
