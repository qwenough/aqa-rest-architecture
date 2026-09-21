import 'dotenv/config';
import { isPlainObject } from './utils/isPlainObject.js';
import { ERRORS, HTTP, ENDPOINTS, LOG_MESSAGES } from '../config/constants.js';
import { TEST_DATA } from '../config/testData.js';

/**
 * API client for interacting with ReqRes service.
 */
export class ReqResClient {
  /**
   * Initializes client with environment variables.
   *
   * @throws {Error} If API_BASE_URL is not set.
   */
  constructor() {
    if (!process.env.API_BASE_URL) {
      throw new Error(ERRORS.MISSING_BASE_URL);
    }

    this.baseUrl = process.env.API_BASE_URL;
    this.apiKey = process.env.REQRES_API_KEY ?? '';
  }

  /**
   * Sends an HTTP request and parses JSON response.
   *
   * @param {string} endpoint - Target endpoint path.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<object>} Parsed JSON response.
   * @throws {Error} If HTTP response is not ok.
   */
  async _request(endpoint, options = {}) {
    if (typeof endpoint !== 'string' || endpoint.trim() === '') {
      throw new TypeError(ERRORS.INVALID_ENDPOINT);
    }

    const safeOptions = options ?? {};

    const url = new URL(endpoint, this.baseUrl);

    //Send x-api-key only if set to avoid sending an empty header
    const headers = {
      ...(this.apiKey ? { [HTTP.HEADERS.API_KEY]: this.apiKey } : {}),
      ...(safeOptions.headers ?? {}),
    };

    const response = await fetch(url, {
      ...safeOptions,
      headers,
    });

    if (!response.ok) {
      const err = new Error(`${ERRORS.HTTP_ERROR_PREFIX} ${response.status}`);
      err.status = response.status;
      throw err;
    }

    return response.json();
  }

  /**
   * Fetches user data by ID.
   *
   * @param {number} id - User ID.
   * @returns {Promise<object>} User details.
   * @throws {TypeError} If ID is not a positive integer.
   */
  async getUser(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new TypeError(ERRORS.INVALID_USER_ID);
    }

    return this._request(`${ENDPOINTS.USERS}/${id}`);
  }

  /**
   * Creates a new user.
   *
   * @param {object} userData - User payload object.
   * @returns {Promise<object>} Created user response.
   * @throws {TypeError} If userData is not a plain object or is empty
   */
  async createUser(userData) {
    if (!isPlainObject(userData)) {
      throw new TypeError(ERRORS.INVALID_USER_DATA);
    }

    if (Object.keys(userData).length === 0) {
      throw new TypeError(ERRORS.EMPTY_USER_DATA);
    }

    return this._request(ENDPOINTS.USERS, {
      method: HTTP.METHODS.POST,
      headers: {
        [HTTP.HEADERS.CONTENT_TYPE]: HTTP.CONTENT_TYPES.JSON,
      },
      body: JSON.stringify(userData),
    });
  }

  /**
   * Demonstrates how arrow function preserves lexical 'this'.
   *
   * @returns {void}
   */
  testContext() {
    // Step 1: Regular function loses 'this' inside setTimeout.
    // setTimeout(function () {
    //   console.log(this.baseUrl);
    // }, TEST_DATA.CONTEXT_DELAY_MS);

    // Step 2: Extracting a method to a variable loses 'this' when called alone.
    // const fn = this.getUser;
    // fn(1);

    // Step 3: Arrow function keeps 'this' from the class instance.
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log(LOG_MESSAGES.BASE_URL, this.baseUrl);
    }, TEST_DATA.CONTEXT_DELAY_MS);
  }
}
