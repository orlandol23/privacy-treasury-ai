import type { Response } from 'express';
import type { ZodError } from 'zod';

const API_VERSION = process.env.npm_package_version ?? '1.0.0';
const isDevelopment = process.env.NODE_ENV !== 'production';

export const sendSuccess = <T>(res: Response, data: T, status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
    version: API_VERSION
  });
};

export const sendError = (
  res: Response,
  error: unknown,
  message: string,
  status = 500
) => {
  const details = error instanceof Error ? error.message : undefined;

  if (error instanceof Error) {
    console.error('[API ERROR]', message, error);
  } else {
    console.error('[API ERROR]', message, error);
  }

  return res.status(status).json({
    success: false,
    error: message,
    ...(isDevelopment && details ? { details } : {}),
    timestamp: new Date().toISOString(),
    version: API_VERSION
  });
};

export const sendValidationError = (res: Response, error: ZodError) => {
  return res.status(400).json({
    success: false,
    error: 'Invalid request payload',
    details: error.flatten(),
    timestamp: new Date().toISOString(),
    version: API_VERSION
  });
};
