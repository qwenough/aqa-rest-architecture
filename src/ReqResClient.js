import 'dotenv/config';

const USERS_ENDPOINT = '/api/users';
const API_KEY_HEADER = 'x-api-key';
const CONTEXT_DELAY_MS = 1000;

/**
 * API client for interacting with ReqRes service.
 */
export class ReqResClient {
  /**
   * Initializes client with environment variables.
   * @throws {Error} If API_BASE_URL is not set.
   */
  constructor() {
    if (!process.env.API_BASE_URL) {
      throw new Error('API_BASE_URL is not defined');
    }

    this.baseUrl = process.env.API_BASE_URL;
    this.apiKey = process.env.REQRES_API_KEY ?? '';
  }

  /**
   * Sends an HTTP request and parses JSON response.
   * @param {string} endpoint - Target endpoint path.
   * @param {object} [options={}] - Request options.
   * @returns {Promise<object>} Parsed JSON response.
   * @throws {Error} If HTTP response is not ok.
   */
  async _request(endpoint, options = {}) {
    const url = new URL(endpoint, this.baseUrl);

    const headers = {
      [API_KEY_HEADER]: this.apiKey,
      ...(options.headers ?? {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const err = new Error(`HTTP ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return response.json();
  }

  /**
   * Fetches user data by ID.
   * @param {number} id - User ID.
   * @returns {Promise<object>} User details.
   * @throws {TypeError} If ID is not a positive integer.
   */
  async getUser(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new TypeError('User id must be a positive integer number');
    }
    return this._request(`${USERS_ENDPOINT}/${id}`);
  }

  /**
   * Creates a new user.
   * @param {object} userData - User payload object.
   * @returns {Promise<object>} Created user response.
   * @throws {TypeError} If userData is not an object.
   */
  async createUser(userData) {
    if (!userData || typeof userData !== 'object' || Array.isArray(userData)) {
      throw new TypeError('userData must be a plain object');
    }
    return this._request(USERS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  }

  /**
   * Demonstrates how arrow function preserves lexical 'this'.
   * @returns {void}
   */
  testContext() {
    // Arrow function captures 'this' from ReqResClient instance, so this.baseUrl is accessible here.
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Base URL:', this.baseUrl);
    }, CONTEXT_DELAY_MS);
  }
}
