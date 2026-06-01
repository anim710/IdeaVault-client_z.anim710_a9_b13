'use client';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authClient } from '@/lib/authClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function GoogleCallbackPage() {
  const { syncGoogleUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const sync = async () => {
      try {
        // Get the session BetterAuth just created
        const session = await authClient.getSession();

        if (!session?.data?.user) {
          toast.error('Google login failed. Please try again.');
          router.push('/login');
          return;
        }

        const { name, email, image } = session.data.user;

        // Sync with our Express backend to get our JWT
        await syncGoogleUser({
          name:  name  || 'Google User',
          email: email || '',
          photo: image || '',
        });

        toast.success(`Welcome, ${name}!`);
        router.push('/');
      } catch {
        toast.error('Something went wrong. Please try again.');
        router.push('/login');
      }
    };

    sync();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <LoadingSpinner />
      <p className="text-base-content/60 text-sm">Signing you in with Google...</p>
    </div>
  );
}