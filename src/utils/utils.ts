import { PointData } from 'pixi.js';

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function lerpPoint(a: PointData, b: PointData, t: number) {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
  };
}

export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeInQuint(x: number): number {
  return x * x * x * x * x;
}

export function easeInQuad(t: number) {
  return t * t;
}

export function yoyo(t: number) {
  return t < 0.5 ? t * 2 : 1 - (t - 0.5) * 2;
}

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}