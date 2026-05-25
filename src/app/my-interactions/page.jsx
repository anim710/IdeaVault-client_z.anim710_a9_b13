'use client';
import PrivateRoute from '@/components/PrivateRoute';
import { useEffect, useState } from 'react';
import { privateApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function MyInteractionsPage() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    privateApi()
      .get('/comments/my-interactions')
      .then((res) => setInteractions(res.data))
      .catch(() => toast.error('Failed to load interactions.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PrivateRoute>
      <div className="max-w-3xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-1">My Interactions</h1>
        <p className="text-base-content/60 mb-8">
          Ideas you have commented on.
        </p>

        {loading ? (
          <LoadingSpinner />
        ) : interactions.length === 0 ? (
          <div className="text-center py-24 text-base-content/50">
            <p className="text-5xl mb-4">💬</p>
            <p className="text-lg">You have not commented on any ideas yet.</p>
            <Link href="/ideas" className="btn btn-primary mt-6">
              Explore ideas
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((item) => (
              <div
                key={item._id}
                className="card bg-base-100 border border-base-200 p-5"
              >
                <p className="text-xs text-base-content/50 uppercase tracking-wide mb-1">
                  Commented on
                </p>

                {item.idea ? (
                  <Link
                    href={`/ideas/${item.idea._id}`}
                    className="font-semibold text-base hover:text-primary transition-colors"
                  >
                    {item.idea.title}
                  </Link>
                ) : (
                  <span className="text-sm text-base-content/40 italic">
                    Idea no longer exists
                  </span>
                )}

                <div className="mt-3 bg-base-200 rounded-lg px-4 py-3 text-sm text-base-content/80">
                  "{item.text}"
                </div>

                <p className="text-xs text-base-content/40 mt-3">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </PrivateRoute>
  );
}