"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('Sweets endpoints - smoke', () => {
    it('list sweets works', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/sweets');
        expect([200, 401, 403]).toContain(res.status);
    });
});
