/**
 * Checks if a value is a plain object
 *
 * @param {any} value - Value to check.
 * @returns {boolean} True if strictly plain object, false otherwise.
 */
export function isPlainObject(value) {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(value);

  return proto === null || proto === Object.prototype;
}
