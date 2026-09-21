export const ERRORS = {
  MISSING_BASE_URL: 'API_BASE_URL is not defined',
  HTTP_ERROR_PREFIX: 'HTTP',
  INVALID_USER_ID: 'User id must be a positive integer number',
  INVALID_USER_DATA: 'userData must be a plain object',
  INVALID_ASYNC_FN: 'asyncFn must be a function',
  INVALID_THRESHOLD: 'threshold must be a non-negative number',
  EMAILS_NOT_ARRAY: 'usersEmails must be an Array',
  EMAILS_COUNT_MISMATCH: 'Emails count must match users count',
  EMAILS_DATA_MISMATCH: 'Users emails must match expected ones',
};

export const HTTP = {
  METHODS: {
    POST: 'POST',
  },
  HEADERS: {
    API_KEY: 'x-api-key',
    CONTENT_TYPE: 'Content-Type',
  },
  CONTENT_TYPES: {
    JSON: 'application/json',
  },
};

export const ENDPOINTS = {
  USERS: '/api/users',
};

export const LOG_MESSAGES = {
  CALL: '[Call] Function called with arguments:',
  SUCCESS: '[Success] Completed successfully, execution time:',
  SLOW: '[SLOW] Execution took',
  SLOW_LIMIT: 'which is over the limit of',
  ERROR: '[API Error] Error:',
  BASE_URL: 'Base URL:',
};

export const DEFAULTS = {
  THRESHOLD_MS: 0,
};
