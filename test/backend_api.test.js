const assert = require('node:assert/strict');
const { after, before, describe, it } = require('node:test');
const app = require('../backend_api');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

describe('backend API', () => {
  it('reports a healthy service', async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'Backend is running smoothly!');
  });

  it('returns destinations and supports category filtering', async () => {
    const response = await fetch(`${baseUrl}/api/destinations?category=Heritage`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(body.length > 0);
    assert.ok(body.every((destination) => destination.category === 'Heritage'));
  });

  it('accepts a valid inquiry', async () => {
    const response = await fetch(`${baseUrl}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Traveller',
        email: 'traveller@example.com',
        destinationId: 1,
        date: '2026-12-01',
        guests: '2 People'
      })
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.equal(body.data.email, 'traveller@example.com');
  });

  it('rejects an inquiry without required fields', async () => {
    const response = await fetch(`${baseUrl}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'traveller@example.com' })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.match(body.message, /required/);
  });
});