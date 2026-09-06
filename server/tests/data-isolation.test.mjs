import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

const API_PORT = process.env.PORT || 4000;
const BASE_URL = `http://localhost:${API_PORT}/v1`;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-insecure-secret-change-me-32-chars-long!!';

// Helpers to make authenticated HTTP requests
async function api(path, options = {}, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

test('User Data Isolation & Ownership Security Test Suite', async (t) => {
  // Check backend server availability
  const health = await api('/health');
  if (health.status !== 200) {
    console.warn('Backend server not responding at ' + BASE_URL + ', skipping integration test');
    return;
  }

  // 1. Register User A
  const emailA = `beekeeper_a_${Date.now()}@honeychain.test`;
  const regA = await api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Beekeeper Alice',
      email: emailA,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      role: 'BEEKEEPER',
    }),
  });
  assert.equal(regA.status, 201, 'User A registered successfully');
  const tokenA = regA.data.accessToken;
  const userA = regA.data.user;

  // 2. Register User B
  const emailB = `beekeeper_b_${Date.now()}@honeychain.test`;
  const regB = await api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Beekeeper Bob',
      email: emailB,
      password: 'StrongPassword123!',
      confirmPassword: 'StrongPassword123!',
      role: 'BEEKEEPER',
    }),
  });
  assert.equal(regB.status, 201, 'User B registered successfully');
  const tokenB = regB.data.accessToken;
  const userB = regB.data.user;

  // 3. User A starts with honest empty dashboard (0 hives, 0 harvest)
  const summaryA0 = await api('/reports/summary', {}, tokenA);
  assert.equal(summaryA0.status, 200);
  assert.equal(summaryA0.data.totalHives, 0, 'User A starts with 0 hives');
  assert.equal(summaryA0.data.totalHarvestKg, 0, 'User A starts with 0 harvest');

  // 4. User A creates a Smart Hive
  const createHiveA = await api('/hives', {
    method: 'POST',
    body: JSON.stringify({
      name: "Alice Alpha Apiary Hive 1",
      hiveCode: "H-ALICE-1",
      location: "Sector North, Plot 14",
      frameCount: 10,
      queenStatus: "HEALTHY",
      queenAgeMonths: 3,
    }),
  }, tokenA);
  assert.equal(createHiveA.status, 201, 'User A created hive');
  const hiveA = createHiveA.data;
  assert.equal(hiveA.ownerId, userA.id, 'Hive ownerId set to User A');

  // 5. User B creates a Smart Hive
  const createHiveB = await api('/hives', {
    method: 'POST',
    body: JSON.stringify({
      name: "Bob Beta Hive 99",
      hiveCode: "H-BOB-99",
      location: "Sector South, Ridge 2",
      frameCount: 8,
      queenStatus: "HEALTHY",
      queenAgeMonths: 5,
    }),
  }, tokenB);
  assert.equal(createHiveB.status, 201, 'User B created hive');
  const hiveB = createHiveB.data;
  assert.equal(hiveB.ownerId, userB.id, 'Hive ownerId set to User B');

  // 6. User A lists hives -> MUST only see Hive A
  const listA = await api('/hives', {}, tokenA);
  assert.equal(listA.status, 200);
  assert.equal(listA.data.length, 1, 'User A sees exactly 1 hive');
  assert.equal(listA.data[0].id, hiveA.id, 'User A sees Hive A');
  assert.equal(listA.data.some(h => h.id === hiveB.id), false, 'User A CANNOT see User B hive');

  // 7. User B lists hives -> MUST only see Hive B
  const listB = await api('/hives', {}, tokenB);
  assert.equal(listB.status, 200);
  assert.equal(listB.data.length, 1, 'User B sees exactly 1 hive');
  assert.equal(listB.data[0].id, hiveB.id, 'User B sees Hive B');
  assert.equal(listB.data.some(h => h.id === hiveA.id), false, 'User B CANNOT see User A hive');

  // 8. User A attempts to GET User B's hive -> MUST fail with 404
  const getBbyA = await api(`/hives/${hiveB.id}`, {}, tokenA);
  assert.equal(getBbyA.status, 404, 'User A cannot fetch User B hive details');

  // 9. User A attempts to PATCH User B's hive -> MUST fail with 404
  const patchBbyA = await api(`/hives/${hiveB.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name: "Hacked By Alice" }),
  }, tokenA);
  assert.equal(patchBbyA.status, 404, 'User A cannot update User B hive');

  // 10. User A attempts to DELETE User B's hive -> MUST fail with 404
  const deleteBbyA = await api(`/hives/${hiveB.id}`, {
    method: 'DELETE',
  }, tokenA);
  assert.equal(deleteBbyA.status, 404, 'User A cannot delete User B hive');

  // 11. User A attempts to submit telemetry to User B's hive -> MUST fail with 404
  const telemetryBbyA = await api(`/hives/${hiveB.id}/telemetry`, {
    method: 'POST',
    body: JSON.stringify({
      temperatureC: 99.9,
      humidityPct: 99,
      weightKg: 99,
      acousticHz: 99,
    }),
  }, tokenA);
  assert.equal(telemetryBbyA.status, 404, 'User A cannot inject telemetry into User B hive');

  // 12. User A successfully ingests telemetry into own hive
  const telemetryA = await api(`/hives/${hiveA.id}/telemetry`, {
    method: 'POST',
    body: JSON.stringify({
      temperatureC: 35.2,
      humidityPct: 50.5,
      weightKg: 42.0,
      acousticHz: 238.5,
    }),
  }, tokenA);
  assert.equal(telemetryA.status, 201, 'User A successfully logged telemetry to own hive');

  // 13. User A summary reflects 1 hive
  const summaryA1 = await api('/reports/summary', {}, tokenA);
  assert.equal(summaryA1.status, 200);
  assert.equal(summaryA1.data.totalHives, 1, 'User A summary reflects exactly 1 hive');

  // 14. User A deletes own hive -> succeeds (204 No Content)
  const deleteA = await api(`/hives/${hiveA.id}`, { method: 'DELETE' }, tokenA);
  assert.equal(deleteA.status, 204, 'User A successfully deleted own hive');

  const listAAfterDelete = await api('/hives', {}, tokenA);
  assert.equal(listAAfterDelete.data.length, 0, 'User A has 0 hives after deletion');
});
