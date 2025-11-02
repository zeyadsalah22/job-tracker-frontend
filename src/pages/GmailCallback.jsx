import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAxiosPrivate } from '../utils/axios';

export default function GmailCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [status, setStatus] = useState('processing'); // 'processing', 'success', 'error'
  const [message, setMessage] = useState('Connecting your Gmail account...');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Check for OAuth errors
      if (error) {
        setStatus('error');
        const errorMessage = `OAuth Error: ${error}`;
        setMessage(errorMessage);
        
        // Notify parent window
        if (window.opener) {
          try {
            window.opener.postMessage({
              type: 'GMAIL_OAUTH_RESULT',
              success: false,
              error: errorMessage
            }, window.location.origin);
          } catch (e) {
            console.log('postMessage blocked by COOP');
          }
        }
        
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            navigate('/profile');
          }
        }, 3000);
        return;
      }

      // Validate required parameters
      if (!code || !state) {
        setStatus('error');
        const errorMessage = 'Missing required OAuth parameters';
        setMessage(errorMessage);
        
        // Notify parent window
        if (window.opener) {
          try {
            window.opener.postMessage({
              type: 'GMAIL_OAUTH_RESULT',
              success: false,
              error: errorMessage
            }, window.location.origin);
          } catch (e) {
            console.log('postMessage blocked by COOP');
          }
        }
        
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            navigate('/profile');
          }
        }, 3000);
        return;
      }

      // Call backend callback endpoint (with JWT authentication)
      // Backend only expects 'code' in the request body (state is validated internally)
      console.log('Calling backend callback with code:', code);
      console.log('Request URL:', '/Gmail/callback');
      console.log('Request body:', { code });
      
      const response = await axiosPrivate.post(`/Gmail/callback`, {
        code
      });

      console.log('Gmail callback response:', response.data);

      // Success
      setStatus('success');
      setMessage('Gmail account connected successfully!');
      
      // Notify parent window
      if (window.opener) {
        try {
          window.opener.postMessage({
            type: 'GMAIL_OAUTH_RESULT',
            success: true,
            data: response.data
          }, window.location.origin);
        } catch (e) {
          console.log('postMessage blocked by COOP, using localStorage as fallback');
        }
      }
      
      // Fallback: Use localStorage (will be picked up by parent on focus)
      localStorage.setItem('gmailOAuthResult', JSON.stringify({
        success: true,
        timestamp: Date.now()
      }));
      
      // Close popup or redirect after 2 seconds
      setTimeout(() => {
        if (window.opener) {
          // If opened as popup, close it
          window.close();
        } else {
          // If opened as normal page, redirect to profile
          navigate('/profile');
        }
      }, 2000);

    } catch (error) {
      console.error('OAuth callback error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          data: error.config?.data
        },
        message: error.message
      });
      setStatus('error');
      const errorMessage = error.response?.data?.message || error.message || 'Failed to connect Gmail account';
      setMessage(errorMessage);
      
      // Notify parent window of error
      if (window.opener) {
        try {
          window.opener.postMessage({
            type: 'GMAIL_OAUTH_RESULT',
            success: false,
            error: errorMessage
          }, window.location.origin);
        } catch (e) {
          console.log('postMessage blocked by COOP');
        }
      }
      
      setTimeout(() => {
        if (window.opener) {
          window.close();
        } else {
          navigate('/profile');
        }
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Status Icon */}
          {status === 'processing' && (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          
          {status === 'success' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          )}
          
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          )}

          {/* Status Message */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'processing' && 'Processing...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Connection Failed'}
            </h2>
            <p className="text-gray-600">
              {message}
            </p>
          </div>

          {/* Additional Info */}
          {status === 'success' && (
            <p className="text-sm text-gray-500">
              This window will close automatically
            </p>
          )}
          
          {status === 'error' && (
            <button
              onClick={() => navigate('/profile')}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
            >
              Go to Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

