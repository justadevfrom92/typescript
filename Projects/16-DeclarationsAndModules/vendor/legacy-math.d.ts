// Hand-written declaration file: it describes legacy-math.js to TypeScript.
// A .d.ts holds types only; the real code stays in the .js file next to it.

/** Restricts `value` to the range [min, max]. */
export declare function clamp(value: number, min: number, max: number): number;

export interface Stats {
  count: number;
  sum: number;
  mean: number;
}

export declare function stats(values: readonly number[]): Stats;

export declare const VERSION: string;

/** Linear interpolation between `from` and `to`. */
declare function lerp(from: number, to: number, t: number): number;
export default lerp;
