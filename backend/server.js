import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes Utama
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'RESTful API SIM-EKSKUL SMKN 5 Telkom Banda Aceh aktif'
  });
});

app.listen(PORT, () => {
  console.log(`Server Back-End berjalan di http://localhost:${PORT}`);
});
