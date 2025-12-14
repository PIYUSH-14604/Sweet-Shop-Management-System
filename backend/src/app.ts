import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import sweetRoutes from './routes/sweets';

const app = express();
app.use(cors());
app.use(express.json());
// Simple request logger to help debug frontend connection issues
app.use((req, _res, next) => {
	console.log(new Date().toISOString(), req.method, req.originalUrl);
	next();
});

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);

app.get('/', (req, res) => res.json({ ok: true, name: 'Sweet Shop API' }));

export default app;
