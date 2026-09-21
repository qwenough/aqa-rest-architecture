import 'dotenv/config';
import assert from 'node:assert';
import { ReqResClient } from './ReqResClient.js';
import { withLogging } from './tasks.js';

const LOG_THRESHOLD_MS = 500;
const USER_IDS = [1, 2, 3];
const EXPECTED_USERS_COUNT = USER_IDS.length;
const EXPECTED_USER_EMAILS = [
  'george.bluth@reqres.in',
  'janet.weaver@reqres.in',
  'emma.wong@reqres.in',
];

const reqResClient = new ReqResClient();

const loggedGetUser = withLogging((id) => reqResClient.getUser(id), LOG_THRESHOLD_MS);

const usersData = await Promise.all(USER_IDS.map((userId) => loggedGetUser(userId)));

const usersEmails = usersData.map((userData) => userData?.data?.email);

assert.ok(Array.isArray(usersEmails), 'usersEmails must be an Array');
assert.strictEqual(usersEmails.length, EXPECTED_USERS_COUNT, 'Emails count must match users count');
assert.deepStrictEqual(usersEmails, EXPECTED_USER_EMAILS, 'Users emails must match expected ones');
