import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import FirebaseTest from '../components/debug/FirebaseTest';
import toast from 'react-hot-toast';

const TestPage = () => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);
  const [apiUrl, setApiUrl] = useState(process.env.REACT_APP_API_URL || 'http://localhost:8080');

  const tests = [
    {
      id: 'health',
      name: 'Health Check',
      description: 'Test if the API server is running',
      endpoint: '/health',
      method: 'GET',
      requiresAuth: false
    },
    {
      id: 'auth-no-token',
      name: 'Auth Without Token',
      description: 'Should return 401 when no auth token provided',
      endpoint: '/api/auth/me',
      method: 'GET',
      requiresAuth: false,
      expectedStatus: 401
    },
    {
      id: 'channels-no-token',
      name: 'Channels Without Token',
      description: 'Should return 401 when accessing channels without auth',
      endpoint: '/api/channels',
      method: 'GET',
      requiresAuth: false,
      expectedStatus: 401
    },
    {
      id: 'messages-no-token',
      name: 'Messages Without Token',
      description: 'Should return 401 when accessing messages without auth',
      endpoint: '/api/messages/channel/test',
      method: 'GET',
      requiresAuth: false,
      expectedStatus: 401
    },
    {
      id: 'invalid-route',
      name: 'Invalid Route',
      description: 'Should return 404 for non-existent routes',
      endpoint: '/api/invalid-endpoint',
      method: 'GET',
      requiresAuth: false,
      expectedStatus: 404
    }
  ];

  const runTest = async (test) => {
    try {
      const response = await fetch(`${apiUrl}${test.endpoint}`, {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const expectedStatus = test.expectedStatus || 200;
      const success = response.status === expectedStatus;
      
      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      return {
        success,
        status: response.status,
        expectedStatus,
        data: responseData,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        status: null,
        expectedStatus: test.expectedStatus || 200,
        data: null,
        error: error.message
      };
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults({});

    for (const test of tests) {
      setTestResults(prev => ({
        ...prev,
        [test.id]: { running: true }
      }));

      const result = await runTest(test);
      
      setTestResults(prev => ({
        ...prev,
        [test.id]: { ...result, running: false }
      }));

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
    
    const passedTests = Object.values(testResults).filter(r => r.success).length;
    const totalTests = tests.length;
    
    if (passedTests === totalTests) {
      toast.success(`All ${totalTests} tests passed! 🎉`);
    } else {
      toast.error(`${passedTests}/${totalTests} tests passed`);
    }
  };

  const getStatusIcon = (result) => {
    if (result.running) {
      return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    if (result.success) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (result.error) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = (result) => {
    if (result.running) return 'Running...';
    if (result.success) return 'Passed';
    if (result.error) return 'Error';
    return 'Failed';
  };

  return (
    <div className="min-h-screen bg-discord-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/chat"
              className="flex items-center space-x-2 text-discord-light hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Chat</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">API Test Suite</h1>
              <p className="text-discord-light">Test your Discord Clone backend API</p>
            </div>
          </div>
          
          <button
            onClick={runAllTests}
            disabled={testing}
            className="btn-primary flex items-center space-x-2"
          >
            {testing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Run All Tests</span>
              </>
            )}
          </button>
        </div>

        {/* Firebase Authentication Test */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-4">🔥 Firebase Authentication Test</h2>
          <FirebaseTest />
        </div>

        {/* API URL Configuration */}
        <div className="bg-discord-dark p-4 rounded-lg mb-6">
          <label className="block text-sm font-medium text-discord-lighter mb-2">
            API Base URL
          </label>
          <input
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="input-primary w-full"
            placeholder="http://localhost:8080"
          />
          <p className="text-discord-light text-sm mt-1">
            Change this to test against your deployed API
          </p>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test) => {
            const result = testResults[test.id] || {};
            
            return (
              <div
                key={test.id}
                className="bg-discord-dark p-4 rounded-lg border border-gray-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(result)}
                      <h3 className="text-white font-semibold">{test.name}</h3>
                      <span className="text-sm text-discord-light">
                        {getStatusText(result)}
                      </span>
                    </div>
                    
                    <p className="text-discord-light text-sm mb-2">
                      {test.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-discord-light">
                        <span className="font-medium">Method:</span> {test.method}
                      </span>
                      <span className="text-discord-light">
                        <span className="font-medium">Endpoint:</span> {test.endpoint}
                      </span>
                      {test.expectedStatus && (
                        <span className="text-discord-light">
                          <span className="font-medium">Expected:</span> {test.expectedStatus}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {result.status && (
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        result.success ? 'text-green-500' : 'text-red-500'
                      }`}>
                        Status: {result.status}
                      </div>
                      {result.expectedStatus && result.status !== result.expectedStatus && (
                        <div className="text-xs text-discord-light">
                          Expected: {result.expectedStatus}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Response Data */}
                {result.data && !result.running && (
                  <div className="mt-4 p-3 bg-discord-channel rounded text-sm">
                    <div className="text-discord-light mb-2">Response:</div>
                    <pre className="text-white overflow-x-auto">
                      {typeof result.data === 'string' 
                        ? result.data 
                        : JSON.stringify(result.data, null, 2)
                      }
                    </pre>
                  </div>
                )}

                {/* Error */}
                {result.error && (
                  <div className="mt-4 p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded text-sm">
                    <div className="text-red-400 mb-2">Error:</div>
                    <div className="text-red-300">{result.error}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {Object.keys(testResults).length > 0 && !testing && (
          <div className="mt-8 bg-discord-dark p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Test Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {Object.values(testResults).filter(r => r.success).length}
                </div>
                <div className="text-discord-light text-sm">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {Object.values(testResults).filter(r => !r.success && !r.error).length}
                </div>
                <div className="text-discord-light text-sm">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">
                  {Object.values(testResults).filter(r => r.error).length}
                </div>
                <div className="text-discord-light text-sm">Errors</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
