import { Response } from 'express';

export interface DemoResponse {
  success: boolean;
  feature?: string;
  sql?: string;
  data?: any;
  explanation?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

export const sendSuccess = (
  res: Response,
  payload: Omit<DemoResponse, 'success'>,
  status = 200
) => {
  return res.status(status).json({ success: true, ...payload });
};

export const sendError = (res: Response, message: string, status = 500) => {
  return res.status(status).json({ success: false, message });
};
