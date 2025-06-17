import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AutoLogin() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const performAutoLogin = async () => {
      try {
        setLoading(true);
        setError('');

        // Test admin credentials from backend test config
        const testCredentials = {
          email: 'test-admin@localhost.dev',
          password: 'TEST_ONLY_BYPASS_2025'
        };

        console.warn('🔓 ATTEMPTING TEST ADMIN AUTO-LOGIN - DEVELOPMENT ONLY');
        
        const response = await axios.post('http://localhost:4001/api/auth/login', testCredentials);
        
        if (response.data.token) {
          // Store token in localStorage
          localStorage.setItem('token', response.data.token);
          
          // Set default authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          
          setSuccess(true);
          
          console.warn('🔓 TEST ADMIN AUTO-LOGIN SUCCESSFUL - REMOVE BEFORE PRODUCTION');
          
          // Redirect to dashboard after a brief success message
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          throw new Error('No token received from server');
        }
      } catch (err) {
        console.error('Auto-login failed:', err);
        
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
          setError(`Auto-login failed: ${errorMessage}`);
          
          // If it's a 401 or the test bypass isn't working, show helpful message
          if (err.response?.status === 401) {
            setError('Test admin bypass not available. Ensure backend is running with TEST_MODE=true');
          }
        } else {
          setError(`Auto-login failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    performAutoLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Warning Banner */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  ⚠️ TEST ENVIRONMENT ONLY
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  This auto-login feature is for development testing only and must be removed before production.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            {loading && (
              <>
                <Loader2 className="mx-auto h-12 w-12 text-primary-600 animate-spin" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  Logging in as Test Admin...
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Using test credentials for automatic authentication
                </p>
              </>
            )}

            {success && (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  Login Successful!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Redirecting to dashboard...
                </p>
              </>
            )}

            {error && (
              <>
                <AlertTriangle className="mx-auto h-12 w-12 text-red-600" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">
                  Auto-Login Failed
                </h2>
                <p className="mt-2 text-sm text-red-600">
                  {error}
                </p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Retry Auto-Login
                  </button>
                  <button
                    onClick={() => navigate('/signin')}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Manual Sign In
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Debug Information */}
          <div className="mt-6 p-3 bg-gray-50 rounded-md">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Debug Info:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Backend URL: http://localhost:4001</div>
              <div>Test Email: test-admin@localhost.dev</div>
              <div>Environment: Development</div>
              <div>Status: {loading ? 'Attempting login...' : success ? 'Success' : error ? 'Failed' : 'Ready'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}