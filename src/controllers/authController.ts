import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import type {
  RegisterRequest,
  LoginRequest,
  JwtPayload
} from '../types/auth';

import { UserModel } from '../models/userModel';
import { sendSuccess, sendError } from '../utils/response';


// =========================
// REGISTER
// =========================
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  const payload: RegisterRequest = req.body;

  try {
    const hashedPassword = await bcrypt.hash(
      payload.password,
      10
    );

    await UserModel.create(
      payload.username,
      payload.email,
      hashedPassword
    );

    sendSuccess(
      res,
      'Registrasi berhasil!',
      undefined,
      201
    );
  } catch (error: any) {
    console.error('ERROR REGISTER:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      sendError(
        res,
        'Username atau Email sudah terdaftar!',
        409
      );
      return;
    }

    sendError(
      res,
      'Error server.',
      500
    );
  }
};

// =========================
// LOGIN
// =========================
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  const payload: LoginRequest = req.body;

  try {
    const user = await UserModel.findByUsername(
      payload.username
    );

    // Cek user dan password
    if (
      !user ||
      !(await bcrypt.compare(
        payload.password,
        user.password
      ))
    ) {
      sendError(
        res,
        'Username atau password salah!',
        401
      );
      return;
    }

    // Data yang disimpan di JWT
    const tokenPayload: JwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email
    };

    // Membuat token
    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string,
      {
        expiresIn: '2h'
      }
    );

    sendSuccess(
      res,
      'Login berhasil!',
      {
        token
      }
    );

  } catch (error) {

    sendError(
      res,
      'Error server.',
      500
    );
  }
};