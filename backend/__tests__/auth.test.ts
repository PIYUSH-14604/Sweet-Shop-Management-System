import request from 'supertest';
import app from '../src/app';

describe('Auth endpoints - basic smoke', ()=>{
  it('register rejects missing fields', async ()=>{
    const res = await request(app).post('/api/auth/register').send({});
    expect(res.status).toBe(400);
  });
});
