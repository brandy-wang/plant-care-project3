/** Throws a RangeError naming the parameter when `value` is outside [min, max]. */
export function assertInRange(name: string, value: number, min: number, max: number): void {
  if (value < min || value > max) {
    throw new RangeError(`${name} must be between ${min} and ${max}, got ${value}`);
  }
}
