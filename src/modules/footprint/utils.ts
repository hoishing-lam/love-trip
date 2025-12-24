import type { Footprint, Spot, Route } from './types';

export function isSpot(footprint: Footprint): footprint is Spot {
  return footprint.category === 'spot';
}

export function isRoute(footprint: Footprint): footprint is Route {
  return footprint.category === 'route';
}
