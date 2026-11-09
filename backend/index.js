import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { limiter } from './middlewares/rateLimiter.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import { protect } from './middlewares/auth.js'; 
import { errorHandler } from './middlewares/errorHandler.js'; 
import { notFound } from './middlewares/notFound.js'; 
import transactionRoutes from './routes/transactions.js';
import categoryRouter from './routes/category.js'; 
import uploadRoutes from './routes/uploadRouter.js';


import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;


// 🧪 During dev: allow all
app.use(cors());

// 🔒 In production:
app.use(cors({
  origin: ['https://yourfrontend.com']
}));


app.use(limiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

if (process.env.NODE_ENV !== 'production') {
  console.log('👨‍💻 Development mode – logs and debug enabled');
}


app.use(express.json());



app.use(helmet());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//  Routes
app.use('/api/auth', authRoutes); 
app.use('/api/admin', protect, adminRoutes); 
app.use('/api/categories', categoryRouter);
app.use('/api/upload', uploadRoutes);

app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', protect, adminRoutes); 

//404 
app.use(notFound);

// Global Error
app.use(errorHandler);
 
app.get('/api/health', (req, res) => {
  res.json("Server is working....~")
})
//  DB Server Connection
mongoose.connect(process.env.NODE_ENV == "development" ?  process.env.MONGO_URI_dev : process.env.MONGO_URI_pro)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ Database connection failed', err.message);
  });
