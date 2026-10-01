import express, {
  Request,
  Response,
  NextFunction
} from 'express';

import cors from 'cors';
import { randomUUID } from 'crypto';

import apiRoutes from './routes/index.js';

import {
  sendSuccess,
  sendError
} from './utils/response.js';

const app = express();


// CORS
app.use(
  cors({
    exposedHeaders: ['X-Request-Id']
  })
);


// JSON parser
app.use(express.json());


// Request ID per request
app.use(
  (req: Request, res: Response, next: NextFunction) => {
    const requestId = randomUUID();

    res.locals.requestId = requestId;

    res.setHeader(
      'X-Request-Id',
      requestId
    );

    next();
  }
);


// Logging
app.use(
  (req: Request, res: Response, next: NextFunction) => {
    console.log(
      `[${res.locals.requestId}] ${req.method} ${req.originalUrl}`
    );

    next();
  }
);


// Route utama
app.get(
  '/',
  (req: Request, res: Response) => {
    sendSuccess(
      res,
      'Backend Todo Praktikum Berjalan Mulus!'
    );
  }
);


// Semua route API
app.use('/api', apiRoutes);


// 404 Handler
app.use(
  (req: Request, res: Response) => {
    sendError(
      res,
      `Route ${req.method} ${req.url} tidak ditemukan`,
      404
    );
  }
);


// Global Error Handler
app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.error(
      'Terjadi error:',
      err.message
    );

    sendError(
      res,
      'Terjadi kesalahan pada server.',
      500
    );
  }
);


export default app;