import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { 
  testConfig, 
  validateTestEnvironment, 
  getTestAdminUser,
  logTestBypassUsage 
} from '../config/testConfig';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    // ⚠️ TEST-ONLY BYPASS - REMOVE BEFORE PRODUCTION ⚠️
    if (validateTestEnvironment() && decoded.userId === testConfig.adminBypass.testUserId) {
      console.warn('🔓 TEST ADMIN MIDDLEWARE BYPASS - This should NEVER appear in production!');
      
      const testUser = getTestAdminUser();
      req.user = {
        userId: testUser.id,
        email: testUser.email,
        role: testUser.role
      };

      logTestBypassUsage('TEST_ADMIN_MIDDLEWARE_BYPASS', {
        route: req.path,
        method: req.method,
        userAgent: req.get('User-Agent')
      });

      return next();
    }
    // ⚠️ END TEST BYPASS ⚠️
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};