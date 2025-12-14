import request from 'supertest';
import app from '../src/app';

describe('Sweets endpoints - smoke', ()=>{
  it('list sweets works', async ()=>{
    const res = await request(app).get('/api/sweets');
    expect([200,401,403]).toContain(res.status);
  });
});
