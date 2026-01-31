import React, { useState, useEffect } from 'react';
import { useAxiosPrivate } from '../../utils/axios';
import { toast } from 'react-toastify';
import { Mail, RefreshCw, Link as LinkIcon, Unlink, AlertCircle } from 'lucide-react';
import ReactLoading from 'react-loading';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';

export default function GmailIntegration() {
  const axiosPrivate = useAxiosPrivate();
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);

  useEffect(() => {
    fetchConnectionStatus();
  }, []);

  // Log when connection status changes
  useEffect(() => {
    console.log('Connection status updated:', connectionStatus);
  }, [connectionStatus]);

  const fetchConnectionStatus = async () => {
    try {
      setLoading(true);
      console.log('Fetching Gmail connection status from /Gmail/status...');
      const response = await axiosPrivate.get('/Gmail/status');
      console.log('Gmail status response:', response.data);
      
      // Map backend response to frontend format
      // Backend uses 'isActive', frontend uses 'isConnected'
      const mappedStatus = {
        isConnected: response.data?.isActive || false,
        gmailAddress: response.data?.gmailAddress,
        connectedAt: response.data?.connectedAt,
        isTokenExpired: response.data?.isTokenExpired,
        lastCheckedAt: response.data?.lastCheckedAt
      };
      
      console.log('Mapped status - Is connected?', mappedStatus.isConnected);
      console.log('Gmail address:', mappedStatus.gmailAddress);
      setConnectionStatus(mappedStatus);
    } catch (error) {
      console.error('Failed to fetch Gmail status:', error);
      console.error('Error details:', error.response?.data);
      // Set default not connected state
      setConnectionStatus({
        isConnected: false,
        gmailAddress: null,
        connectedAt: null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setActionLoading(true);
      const response = await axiosPrivate.get('/Gmail/connect');
      console.log('OAuth URL:', response.data);
      
      // Debug: Log the redirect_uri parameter
      const authUrl = response.data.authUrl || response.data.oauthUrl;
      if (authUrl) {
        const url = new URL(authUrl);
        const redirectUri = url.searchParams.get('redirect_uri');
        console.log('🔍 Backend is using redirect_uri:', redirectUri);
        console.log('✅ Expected redirect_uri:', window.location.origin + '/gmail/callback');
      }

      if (response.data.authUrl || response.data.oauthUrl) {
        const authUrl = response.data.authUrl || response.data.oauthUrl;
        
        // Clear any previous OAuth result
        localStorage.removeItem('gmailOAuthResult');
        
        // Set up message listener for OAuth callback
        const handleMessage = (event) => {
          // Verify the message is from our callback page
          if (event.data && event.data.type === 'GMAIL_OAUTH_RESULT') {
            console.log('Received OAuth result via postMessage:', event.data);
            
            setActionLoading(false);
            
            if (event.data.success) {
              toast.success('Gmail account connected successfully!');
              // Wait a moment for backend to process, then refresh status
              setTimeout(() => {
                console.log('Refreshing Gmail connection status after successful connection...');
                fetchConnectionStatus();
              }, 1000);
            } else {
              toast.error(event.data.error || 'Failed to connect Gmail account');
            }
            
            // Remove event listener
            window.removeEventListener('message', handleMessage);
            window.removeEventListener('focus', handleFocus);
          }
        };
        
        // Fallback: Check localStorage when window regains focus (popup closed)
        const handleFocus = () => {
          console.log('Window regained focus, checking for OAuth result in localStorage...');
          const result = localStorage.getItem('gmailOAuthResult');
          if (result) {
            try {
              const oauthResult = JSON.parse(result);
              console.log('Retrieved OAuth result from localStorage:', oauthResult);
              
              setActionLoading(false);
              localStorage.removeItem('gmailOAuthResult');
              
              if (oauthResult.success) {
                toast.success('Gmail account connected successfully!');
                // Wait a moment for backend to process, then refresh status
                setTimeout(() => {
                  console.log('Refreshing Gmail connection status after successful connection...');
                  fetchConnectionStatus();
                }, 1000);
              } else {
                toast.error(oauthResult.error || 'Failed to connect Gmail account');
              }
              
              window.removeEventListener('message', handleMessage);
              window.removeEventListener('focus', handleFocus);
            } catch (e) {
              console.error('Error parsing OAuth result:', e);
            }
          } else {
            console.log('No OAuth result found in localStorage');
          }
        };
        
        window.addEventListener('message', handleMessage);
        window.addEventListener('focus', handleFocus);
        
        // Open OAuth popup
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        const popup = window.open(
          authUrl,
          'Gmail OAuth',
          `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );

        // Fallback: Remove loading state if popup is blocked
        if (!popup) {
          setActionLoading(false);
          window.removeEventListener('message', handleMessage);
          window.removeEventListener('focus', handleFocus);
          toast.error('Popup blocked. Please allow popups for this site.');
        }
      } else {
        throw new Error('No OAuth URL returned from server');
      }
    } catch (error) {
      console.error('Failed to initiate Gmail connection:', error);
      toast.error(error.response?.data?.message || 'Failed to connect Gmail. Please try again.');
      setActionLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setActionLoading(true);
      setDisconnectModalOpen(false);
      
      console.log('Attempting to disconnect Gmail...');
      await axiosPrivate.delete('/Gmail/disconnect');
      
      toast.success('Gmail account disconnected successfully');
      await fetchConnectionStatus();
    } catch (error) {
      console.error('Failed to disconnect Gmail:', error);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      toast.error(error.response?.data?.message || 'Failed to disconnect Gmail. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <ReactLoading type="spinningBubbles" color="#7571F9" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Gmail Integration Card */}
      <div className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all ${
        connectionStatus?.isConnected 
          ? 'border-2 border-green-200' 
          : 'border border-gray-200'
      }`}>
        {/* Card Header */}
        <div className={`px-6 py-4 border-b ${
          connectionStatus?.isConnected
            ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-100'
            : 'bg-gradient-to-r from-primary/5 to-primary/10 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm ${
                connectionStatus?.isConnected ? 'ring-2 ring-green-200' : ''
              }`}>
                <Mail className={`w-6 h-6 ${
                  connectionStatus?.isConnected ? 'text-green-600' : 'text-primary'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Gmail Integration
                  {connectionStatus?.isConnected && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      ✓ Connected
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  {connectionStatus?.isConnected 
                    ? 'Your Gmail account is connected and active' 
                    : 'Receive automatic job application updates'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Connection Status Section */}
          {connectionStatus?.isConnected && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Status</p>
                  <p className="text-xs text-gray-600">Your Gmail integration is working</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium">
                Active
              </span>
            </div>
          )}
          
          {!connectionStatus?.isConnected && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Not Connected</p>
                  <p className="text-xs text-gray-600">Connect your Gmail to receive updates</p>
                </div>
              </div>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium">
                Inactive
              </span>
            </div>
          )}

          {/* Connected Account Details */}
          {connectionStatus?.isConnected && (
            <div className="space-y-3">
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-600">Gmail Address:</span>
                  <span className="font-medium text-gray-900">{connectionStatus.gmailAddress || 'Not available'}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                  <span className="text-gray-600">Connected Since:</span>
                  <span className="font-medium text-gray-900">{formatDate(connectionStatus.connectedAt)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Not Connected Info */}
          {!connectionStatus?.isConnected && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Why Connect Gmail?</h4>
                  <ul className="space-y-1 text-xs text-blue-800">
                    <li>• Get instant notifications when companies respond to your applications</li>
                    <li>• Receive reminders for upcoming interviews</li>
                    <li>• Stay updated on application status changes</li>
                    <li>• Never miss important job opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

           {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            {connectionStatus?.isConnected ? (
              <>
                <button
                  onClick={fetchConnectionStatus}
                  disabled={actionLoading}
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 text-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
                  Refresh Status
                </button>
                <button
                  onClick={() => setDisconnectModalOpen(true)}
                  disabled={actionLoading}
                  className="text-red-700 font-semibold flex items-center gap-2 text-sm bg-red-50 rounded-lg px-4 py-2 transition hover:bg-red-100/65 disabled:opacity-50"
                >
                  <Unlink size={18} />
                  Disconnect Gmail
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={actionLoading}
                className="bg-primary hover:bg-primary/85 transition-all text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <ReactLoading type="bubbles" color="#ffffff" height={20} width={20} />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-4 h-4" />
                    Connect Gmail Account
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Disconnect Confirmation Modal */}
      <Dialog open={disconnectModalOpen} onOpenChange={setDisconnectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disconnect Gmail Account?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm text-amber-900">
                  Are you sure you want to disconnect your Gmail account?
                </p>
                <p className="text-xs text-amber-800 mt-2">
                  You will stop receiving automatic application updates and email notifications.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDisconnectModalOpen(false)}
                disabled={actionLoading}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDisconnect}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading ? (
                  <ReactLoading type="bubbles" color="#ffffff" height={20} width={20} />
                ) : (
                  'Yes, Disconnect'
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

