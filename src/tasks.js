/* eslint-disable no-console */
import { ERRORS, LOG_MESSAGES, DEFAULTS } from '../config/constants.js';

/**
 * Function decorator that logs arguments, timing, and errors.
 *
 * @param {Function} asyncFn - Target asynchronous function to wrap.
 * @param {number} [threshold=DEFAULTS.THRESHOLD_MS] - Execution time threshold in ms for SLOW warning.
 * @returns {Function} Wrapped asynchronous function.
 * @throws {TypeError} If asyncFn is not a function.
 */
export function withLogging(asyncFn, threshold = DEFAULTS.THRESHOLD_MS) {
  if (typeof asyncFn !== 'function') {
    throw new TypeError(ERRORS.INVALID_ASYNC_FN);
  }

  if (typeof threshold !== 'number' || threshold < 0) {
    throw new TypeError(ERRORS.INVALID_THRESHOLD);
  }

  return async function (...args) {
    console.log(`${LOG_MESSAGES.CALL} ${JSON.stringify(args)}`);

    const startTime = performance.now();

    try {
      const result = await asyncFn(...args);
      const executionTime = Math.round(performance.now() - startTime);

      console.log(`${LOG_MESSAGES.SUCCESS} ${executionTime}ms`);

      if (threshold > 0 && executionTime > threshold) {
        console.warn(
          `${LOG_MESSAGES.SLOW} ${executionTime}ms, ${LOG_MESSAGES.SLOW_LIMIT} ${threshold}ms`,
        );
      }

      return result;
    } catch (err) {
      const executionTime = Math.round(performance.now() - startTime);
      const errorMessage = err?.message ?? String(err);

      console.error(`${LOG_MESSAGES.ERROR} ${errorMessage}, execution time: ${executionTime}ms`);

      throw err;
    }
  };
}
