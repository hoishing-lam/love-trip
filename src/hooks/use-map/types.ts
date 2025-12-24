export interface AMapEvent {
  lnglat: AMap.LngLat;
  originEvent: MouseEvent;
  pixel: AMap.Pixel;
  pos: [number, number];
  target: AMap.Map;
}

export interface Scene {
  map: AMap.Map;
  loca: any;
  AMap: any;
  Loca: any;
}
