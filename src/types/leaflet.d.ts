declare module 'leaflet' {
  export interface LeafletEvent {
    target: any;
    type: string;
    popup?: any;
  }

  export interface LatLngTuple extends Array<number> {
    0: number;
    1: number;
    length: 2;
  }
} 