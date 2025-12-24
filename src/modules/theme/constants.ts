import type { Themes, Palette } from './types';

/**
 * https://www.materialpalette.com/colors
 *
 * 颜色偏好：
 * BLUE GREY 400-900
 * TEAL 300-900
 * CYAN 300-900 A700
 * LIGHT BLUE 400-900 A200-A700
 * BLUE 500-900 (偏后) A200-A700
 * INDIGO 500-900（偏后）
 * DEEP PURPLE 400-600 A400
 * PURPLE 300-600
 * PINK 300-500 A100
 * RED 300-500 A200
 * AMBER
 */
export const palettes: Record<Themes, Palette> = {
  pink: {
    light: '#f06292', // 300
    primary: '#ec407a', // 400
    dark: '#e91e63', // 500
    danger: '#ef5350' // red 400
  },
  purple: {
    light: '#ba68c8', // 300
    primary: '#ab47bc', // 400
    dark: '#9c27b0', // 500
    danger: '#ef5350' // red 400
  },
  indigo: {
    light: '#3f51b5', // 500
    primary: '#303f9f', // 700
    dark: '#1a237e', // 900
    danger: '#ef5350' // red 400
  },
  lightBlue: {
    light: '#29b6f6', // 400
    primary: '#039be5', // 600
    dark: '#0277bd', // 800
    danger: '#ef5350' // red 400
  },
  cyan: {
    light: '#26c6da', // 400
    primary: '#00acc1', // 600
    dark: '#00838f', // 800
    danger: '#ef5350' // red 400
  },
  teal: {
    light: '#26a69a', // 400
    primary: '#00897b', // 600
    dark: '#00695c', // 800
    danger: '#ef5350' // red 400
  },
  amber: {
    light: '#ffc107', // 500
    primary: '#ffa000', // 700
    dark: '#ff6f00', // 900
    danger: '#ef5350' // red 400
  }
};
