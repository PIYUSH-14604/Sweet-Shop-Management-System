import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Sweet from '../src/models/Sweet';

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/SweetShop';

beforeAll(async () => {
  await mongoose.connect(MONGO);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Sweet.deleteMany({});
});

describe('Integration: Auth + Sweets flow', () => {
  it('registers users, logs in, creates sweet, purchase, restock and delete', async () => {
    // Register regular user
    const regUser = await request(app).post('/api/auth/register').send({ email: 'user@test.com', password: 'pass123' });
    expect(regUser.status).toBe(201);

    // Register admin
    const regAdmin = await request(app).post('/api/auth/register').send({ email: 'admin@test.com', password: 'pass123', role: 'admin' });
    expect(regAdmin.status).toBe(201);

    // Login both
    const loginUser = await request(app).post('/api/auth/login').send({ email: 'user@test.com', password: 'pass123' });
    expect(loginUser.status).toBe(200);
    const userToken = loginUser.body.token;

    const loginAdmin = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass123' });
    expect(loginAdmin.status).toBe(200);
    const adminToken = loginAdmin.body.token;

    // Admin creates a sweet
    const createRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Candy', category: 'Candy', price: 1.5, quantity: 10 });
    expect(createRes.status).toBe(201);
    const sweetId = createRes.body._id;

    // User purchases 3
    const purchase = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quantity: 3 });
    expect(purchase.status).toBe(200);
    expect(purchase.body.quantity).toBe(7);

    // Admin restocks 5
    const restock = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 });
    expect(restock.status).toBe(200);
    expect(restock.body.quantity).toBe(12);

    // Admin deletes the sweet
    const del = await request(app)
      .delete(`/api/sweets/${sweetId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(del.status).toBe(200);
  }, 20000);
});
