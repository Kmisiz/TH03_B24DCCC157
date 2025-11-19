import cors from 'cors';
import express from 'express';
import './database/seed.js';
import Router from './routes/productRouter.js';
const app = express();
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/products', Router);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});