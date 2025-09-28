'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function GitHubOAuthTest() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signIn('github', { 
        callbackUrl: '/',
        redirect: true 
      });
      console.log('GitHub sign-in result:', result);
    } catch (error) {
      console.error('GitHub sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/signin' });
  };

  if (status === 'loading') {
    return <div className="p-4">Loading session...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">GitHub OAuth Test</h2>
      
      {session ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded">
            <h3 className="font-semibold text-green-800">✅ Signed In Successfully!</h3>
            <div className="mt-2 text-sm space-y-1">
              <p><strong>Name:</strong> {session.user?.name || 'Not provided'}</p>
              <p><strong>Email:</strong> {session.user?.email || 'Not provided'}</p>
              <p><strong>Image:</strong> {session.user?.image ? '✅ Available' : '❌ Not provided'}</p>
              <p><strong>User ID:</strong> {session.user?.id || 'Not available'}</p>
              <p><strong>Role:</strong> {session.user?.role || 'Not available'}</p>
            </div>
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-12 h-12 rounded-full mt-2"
              />
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-gray-600">Not signed in</p>
          </div>
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-black text-white p-3 rounded flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {isLoading ? 'Signing in...' : 'Test GitHub Sign In'}
          </button>
        </div>
      )}
      
      <div className="mt-6 text-xs text-gray-500">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <div className="bg-gray-50 p-2 rounded text-xs">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
          <p><strong>Callback URL:</strong> http://localhost:3000/api/auth/callback/github</p>
        </div>
      </div>
    </div>
  );
}