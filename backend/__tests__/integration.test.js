"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../src/models/User"));
const Sweet_1 = __importDefault(require("../src/models/Sweet"));
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/SweetShop';
beforeAll(async () => {
    await mongoose_1.default.connect(MONGO);
});
afterAll(async () => {
    await mongoose_1.default.connection.close();
});
beforeEach(async () => {
    await User_1.default.deleteMany({});
    await Sweet_1.default.deleteMany({});
});
describe('Integration: Auth + Sweets flow', () => {
    it('registers users, logs in, creates sweet, purchase, restock and delete', async () => {
        // Register regular user
        const regUser = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({ email: 'user@test.com', password: 'pass123' });
        expect(regUser.status).toBe(201);
        // Register admin
        const regAdmin = await (0, supertest_1.default)(app_1.default).post('/api/auth/register').send({ email: 'admin@test.com', password: 'pass123', role: 'admin' });
        expect(regAdmin.status).toBe(201);
        // Login both
        const loginUser = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email: 'user@test.com', password: 'pass123' });
        expect(loginUser.status).toBe(200);
        const userToken = loginUser.body.token;
        const loginAdmin = await (0, supertest_1.default)(app_1.default).post('/api/auth/login').send({ email: 'admin@test.com', password: 'pass123' });
        expect(loginAdmin.status).toBe(200);
        const adminToken = loginAdmin.body.token;
        // Admin creates a sweet
        const createRes = await (0, supertest_1.default)(app_1.default)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Test Candy', category: 'Candy', price: 1.5, quantity: 10 });
        expect(createRes.status).toBe(201);
        const sweetId = createRes.body._id;
        // User purchases 3
        const purchase = await (0, supertest_1.default)(app_1.default)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 3 });
        expect(purchase.status).toBe(200);
        expect(purchase.body.quantity).toBe(7);
        // Admin restocks 5
        const restock = await (0, supertest_1.default)(app_1.default)
            .post(`/api/sweets/${sweetId}/restock`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ quantity: 5 });
        expect(restock.status).toBe(200);
        expect(restock.body.quantity).toBe(12);
        // Admin deletes the sweet
        const del = await (0, supertest_1.default)(app_1.default)
            .delete(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(del.status).toBe(200);
    }, 20000);
});
