import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import { initAlertWorker } from './services/alertWorker.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/subscriptions', subscriptionRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const startServer = async () => {
  await connectDB();
  initAlertWorker();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
