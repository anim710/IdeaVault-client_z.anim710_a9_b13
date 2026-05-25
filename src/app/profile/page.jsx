'use client';
import PrivateRoute from '@/components/PrivateRoute';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { privateApi } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm]       = useState({ name: user?.name || '', photo: user?.photo || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await privateApi().put('/auth/profile', form);
      updateUser({ ...user, name: res.data.name, photo: res.data.photo });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateRoute>
      <div className="max-w-lg mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-1">Profile</h1>
        <p className="text-base-content/60 mb-8">
          Update your display name and photo.
        </p>

        {/* Avatar preview */}
        <div className="flex justify-center mb-8">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={form.photo || 'https://placehold.co/96?text=U'}
                alt="Your avatar"
                onError={(e) => { e.target.src = 'https://placehold.co/96?text=U'; }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Display name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Photo URL</span>
            </label>
            <input
              type="url"
              className="input input-bordered"
              placeholder="https://..."
              value={form.photo}
              onChange={(e) => setForm({ ...form, photo: e.target.value })}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              value={user?.email || ''}
              disabled
            />
            <label className="label">
              <span className="label-text-alt opacity-40">Email cannot be changed</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? <span className="loading loading-spinner loading-sm" />
              : 'Save changes'
            }
          </button>
        </form>

      </div>
    </PrivateRoute>
  );
}