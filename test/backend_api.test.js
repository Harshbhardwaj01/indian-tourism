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
  it('serves API information from the root endpoint', async () => {
    const response = await fetch(`${baseUrl}/`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.message, 'Indian Tourism API is running.');
    assert.ok(body.endpoints.includes('/api/destinations'));
  });

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

  it('sends and receives a valid inquiry', async () => {
    const inquiry = {
      name: 'Test Traveller',
      email: 'traveller@example.com',
      destinationId: 1,
      date: '2026-12-01',
      guests: '2 People'
    };
    const sendResponse = await fetch(`${baseUrl}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    const sendBody = await sendResponse.json();

    const receiveResponse = await fetch(`${baseUrl}/api/inquiries`);
    const receivedInquiries = await receiveResponse.json();
    const receivedInquiry = receivedInquiries.find((item) => item.id === sendBody.data.id);

    assert.equal(sendResponse.status, 201);
    assert.equal(sendBody.success, true);
    assert.equal(receiveResponse.status, 200);
    assert.deepEqual(receivedInquiry, sendBody.data);
    assert.equal(receivedInquiry.email, inquiry.email);
    assert.equal(receivedInquiry.destinationId, inquiry.destinationId);
    assert.equal(receivedInquiry.guests, inquiry.guests);
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

  it('creates a user account and allows login with saved credentials', async () => {
    const signupPayload = {
      name: 'Aarav',
      surname: 'Sharma',
      email: 'aarav@example.com',
      phone: '9876543210',
      password: 'India@2026',
      confirmPassword: 'India@2026',
      travelConsistency: 4
    };

    const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupPayload)
    });
    const signupBody = await signupResponse.json();

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'aarav@example.com', password: 'India@2026' })
    });
    const loginBody = await loginResponse.json();

    assert.equal(signupResponse.status, 201);
    assert.equal(signupBody.success, true);
    assert.equal(loginResponse.status, 200);
    assert.equal(loginBody.success, true);
    assert.equal(loginBody.user.email, 'aarav@example.com');
  });

  it('rejects a login when the password is incorrect', async () => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'aarav@example.com', password: 'wrong-password' })
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.match(body.message, /Invalid/i);
  });
});