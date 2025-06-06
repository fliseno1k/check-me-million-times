import { Vector1D } from "../primitives";
import type { Vector1DType } from "../primitives";

export interface LocationType {
  readonly current: Vector1DType;
  readonly previous: Vector1DType;
  readonly offset: Vector1DType;
  readonly target: Vector1DType;
  readonly velocity: Vector1DType;
  readonly direction: Vector1DType;
  forEach(mapFn: (vector: Vector1DType) => void): void;
}

/**
 * Centralized store for scroll-related positions in a 1D space.
 */
export function Location(initial: number = 0) {
  /**
   * The current position of the scroll body.
   */
  const current = Vector1D(initial);

  /**
   * The position from the previous frame.
   */
  const previous = Vector1D(current.get());

  /**
   * The interaction offset from the target.
   */
  const offset = Vector1D(current.get());

  /**
   * The target destination position the scroll is animating toward.
   */
  const target = Vector1D(current.get());

  const velocity = Vector1D(0);

  const direction = Vector1D(0);

  const vectors = [current, previous, offset, target];

  function forEach(mapFn: (vector: Vector1DType) => void): void {
    for (const vector of vectors) {
      mapFn(vector);
    }
  }

  return {
    current,
    previous,
    offset,
    target,
    velocity,
    direction,
    forEach,
  };
}
