export interface Footprint {
  id: string;
  category: string;
  name: string;
  city: string;
  lng: number;
  lat: number;
  boyDesc?: string;
  girlDesc?: string;
  images?: string[];
}

export interface Route extends Footprint {
  category: 'route';
  route: number[][];
}

export interface Region {
  name: string;
  lng: number;
  lat: number;
}

export interface Spot extends Footprint {
  category: 'spot';
  type: string;
}
