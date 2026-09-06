import test from 'node:test';
import assert from 'node:assert/strict';
import { tokenHash } from '../dist/security.js';

test('QR token hashes are deterministic and do not expose the raw token', () => {
  const raw = 'demo-hc-2026-0142';
  assert.equal(tokenHash(raw), tokenHash(raw));
  assert.notEqual(tokenHash(raw), raw);
  assert.equal(tokenHash(raw).length, 64);
});
