const DEFAULT_THRESHOLD_MS = 0;

/**
 * Function decorator that logs arguments, timing, and errors.
 *
 * @param {Function} asyncFn - Target asynchronous function to wrap.
 * @param {number} [threshold=0] - Execution time threshold in ms for SLOW warning.
 * @returns {Function} Wrapped asynchronous function.
 * @throws {TypeError} If asyncFn is not a function.
 */
export function withLogging(asyncFn, threshold = DEFAULT_THRESHOLD_MS) {
  /* eslint-disable no-console */
  if (typeof asyncFn !== 'function') {
    throw new TypeError('asyncFn must be a function');
  }

  if (typeof threshold !== 'number' || threshold < 0) {
    throw new TypeError('threshold must be a non-negative number');
  }

  return async function (...args) {
    console.log(`[Call] Function called with arguments: ${JSON.stringify(args)}`);

    const startTime = performance.now();

    try {
      const result = await asyncFn(...args);
      const executionTime = Math.round(performance.now() - startTime);

      console.log(`[Success] Completed successfully, execution time: ${executionTime}ms`);

      if (threshold > 0 && executionTime > threshold) {
        console.warn(
          `[SLOW] Execution took ${executionTime}ms, which is over the ${threshold}ms limit`,
        );
      }

      return result;
    } catch (err) {
      const executionTime = Math.round(performance.now() - startTime);
      const errorMessage = err?.message ?? String(err);

      console.error(`[API Error] Error: ${errorMessage}, execution time: ${executionTime}ms`);

      throw err;
    }
  };
}
