'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useAuth(type: 'signin' | 'signup') {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (
    form: { email: string; password: string; name?: string },
    provider: 'credentials' | 'google' | 'github' = 'credentials'
  ) => {
    setLoading(true);
    setError('');

    try {
      if (provider === 'google') {
        await signIn('google', { callbackUrl: '/feed' });
        return;
      }

      if (provider === 'github') {
        await signIn('github', { callbackUrl: '/feed' });
        return;
      }

      if (type === 'signup') {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          body: JSON.stringify(form),
          headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to sign up');
        }

        router.push('/signin');
      } else {
        const res = await signIn('credentials', {
          redirect: false,
          email: form.email,
          password: form.password
        });

        if (res?.error) throw new Error(res.error);
        router.push('/feed');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { handleAuth, loading, error };
}
