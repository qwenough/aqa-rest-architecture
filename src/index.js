import 'dotenv/config';
import assert from 'node:assert';
import { ReqResClient } from './ReqResClient.js';

const CLIENTS_IDS = [1, 2, 3];
const EXPECTED_USERS_COUNT = CLIENTS_IDS.length;
const EXPECTED_USERS_EMAILS = [
  'george.bluth@reqres.in',
  'janet.weaver@reqres.in',
  'emma.wong@reqres.in',
];

const reqResClient = new ReqResClient();

const usersData = await Promise.all(CLIENTS_IDS.map((userId) => reqResClient.getUser(userId)));

const usersEmails = usersData.map((userData) => userData?.data?.email);

assert.ok(Array.isArray(usersEmails), 'usersEmails must be an Array');
assert.strictEqual(usersEmails.length, EXPECTED_USERS_COUNT, 'Emails count must match users count');
assert.deepStrictEqual(usersEmails, EXPECTED_USERS_EMAILS, 'Users emails must match expected ones');
