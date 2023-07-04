import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';

dotenv.config();
const app = express();

// DB and authenticateUser
import { connectDB } from './db/connect.js';

// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
import authenticateMiddleware from './middleware/auth.js';
import morgan from 'morgan';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';

// routers
import authRouter from './routes/authRoutes.js';
import jobsRouter from './routes/jobsRoutes.js';

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// const __dirname = dirname(fileURLToPath(import.meta.url));

// deployment static serve
// app.use(express.static(path.resolve(__dirname, './client/build')));

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

// will only spin up server if DB connection was successful
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    7;
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  } catch (error) {
    console.log('could not connect to DB');
  }
};

start();
