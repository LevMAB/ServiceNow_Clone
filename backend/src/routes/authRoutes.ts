import { Router } from 'express';
import { supabase } from '../auth/supabaseClient';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { 
  testConfig, 
  validateTestEnvironment, 
  isTestAdminBypass, 
  getTestAdminUser,
  logTestBypassUsage 
} from '../config/testConfig';

const router = Router();

router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;

  // Validate input
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password and role are required' });
  }

  // Validate role
  const validRoles = ['admin', 'agent', 'requester'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role. Must be admin, agent, or requester' });
  }

  try {
    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{ 
        email, 
        password: hashedPassword 
      }])
      .select()
      .single();

    if (userError) {
      // Check for duplicate email error
      if (userError.code === '23505') {
        return res.status(409).json({ error: 'A user with this email already exists' });
      }
      throw userError;
    }

    // Create role for the user
    const { error: roleError } = await supabase
      .from('roles')
      .insert([{
        user_id: userData.id,
        role: role
      }]);

    if (roleError) {
      // Rollback if role creation fails
      await supabase.from('users').delete().eq('id', userData.id);
      
      if (roleError.code === '23505') {
        return res.status(409).json({ error: 'User role already exists' });
      }
      throw roleError;
    }

    const token = jwt.sign(
      { userId: userData.id, email: userData.email, role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    // Log the error for debugging (in a production environment)
    console.error('Signup error:', error);
    
    // Send a user-friendly error message
    res.status(400).json({ 
      error: (error instanceof Error) 
        ? error.message 
        : 'An error occurred during signup. Please try again.'
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // ⚠️ TEST-ONLY BYPASS - REMOVE BEFORE PRODUCTION ⚠️
    if (validateTestEnvironment() && isTestAdminBypass(email, password)) {
      console.warn('🔓 TEST ADMIN BYPASS USED - This should NEVER appear in production!');
      
      const testUser = getTestAdminUser();
      const token = jwt.sign(
        { userId: testUser.id, email: testUser.email, role: testUser.role },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      logTestBypassUsage('TEST_ADMIN_TOKEN_GENERATED', { 
        email: testUser.email,
        tokenExpiry: '24h'
      });

      return res.json({ 
        token,
        warning: '⚠️ TEST BYPASS ACTIVE - REMOVE BEFORE PRODUCTION ⚠️'
      });
    }
    // ⚠️ END TEST BYPASS ⚠️

    // Get user from database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Get user role
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('role')
      .eq('user_id', userData.id)
      .single();

    if (roleError) {
      return res.status(500).json({ error: 'Error retrieving user role' });
    }

    const token = jwt.sign(
      { userId: userData.id, email: userData.email, role: roleData.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'An error occurred during login. Please try again.' });
  }
});

export default router;