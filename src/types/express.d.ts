import type { JwtPayload } from './auth';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      [key: string]: any;
    }
  }
}

export {};