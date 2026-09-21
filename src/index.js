import 'dotenv/config';
import assert from 'node:assert';
import { ReqResClient } from './ReqResClient.js';
import { withLogging } from './tasks.js';
import { ERRORS, TEST_DATA } from '../config/constants.js';

const reqResClient = new ReqResClient();

const loggedGetUser = withLogging((id) => reqResClient.getUser(id), TEST_DATA.LOG_THRESHOLD_MS);

const usersData = await Promise.all(TEST_DATA.USER_IDS.map((userId) => loggedGetUser(userId)));

const usersEmails = usersData.map((userData) => userData?.data?.email);

assert.ok(Array.isArray(usersEmails), ERRORS.EMAILS_NOT_ARRAY);
assert.strictEqual(usersEmails.length, TEST_DATA.USER_IDS.length, ERRORS.EMAILS_COUNT_MISMATCH);
assert.deepStrictEqual(usersEmails, TEST_DATA.EXPECTED_USER_EMAILS, ERRORS.EMAILS_DATA_MISMATCH);
