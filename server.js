import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db/connect.js';
dotenv.config();
const app = express();

// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

app.get('/', (req, res) => {
  res.send('welcome!');
});

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
