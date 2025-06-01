import { auth } from './firebaseAdmin';
import { Request, Response, NextFunction } from 'express';
import * as logger from 'firebase-functions/logger';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  logger.info('starting authentication');
  const authorizationHeader = req.headers.authorization || '';
  const token = authorizationHeader.startsWith('Bearer ')
    ? authorizationHeader.split('Bearer ')[1]
    : null;

  if (!token) {
    res.status(401).json({ errorMessage: 'Unauthorized: No token provided' });
    return;
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    logger.info('authenticated successfully');
    next();
  } catch (error) {
    logger.info(`Error verifying Firebase ID token: ${error}`);
    res.status(401).json({ errorMessage: 'Unauthorized: Invalid token' });
  }
};
