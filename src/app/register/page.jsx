'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  const { register, googleLogin } = useAuth();
  const router                    = useRouter();
  const [form, setForm]            = useState({ name: '', email: '', photo: '', password: '' });
  const [loading, setLoading]      = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (!/[A-Z]/.test(form.password)) {
      toast.error('Password needs at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(form.password)) {
      toast.error('Password needs at least one lowercase letter');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.photo, form.password);
      toast.success('Account created! Welcome to IdeaVault!');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await googleLogin();
    } catch {
      toast.error('Google sign-up failed. Try again.');
      setGoogleLoading(false);
    }
  };

  const fields = [
    { label: 'Full name',            name: 'name',     type: 'text',     placeholder: 'Your full name',          required: true  },
    { label: 'Email',                name: 'email',    type: 'email',    placeholder: 'you@example.com',         required: true  },
    { label: 'Photo URL (optional)', name: 'photo',    type: 'url',      placeholder: 'https://...',             required: false },
    { label: 'Password',             name: 'password', type: 'password', placeholder: 'Min 6 chars, A-z + a-z', required: true  },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-12">
      <div className="card bg-base-100 shadow-xl w-full max-w-md border border-base-200">
        <div className="card-body">

          <h1 className="card-title text-2xl justify-center mb-1">
            Create account
          </h1>
          <p className="text-center text-sm text-base-content/60 mb-6">
            Join the IdeaVault community
          </p>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="btn btn-outline w-full gap-2 mb-2"
          >
            {googleLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <FcGoogle size={20} />
            )}
            Sign up with Google
          </button>

          <div className="divider text-xs opacity-40">OR</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.name} className="form-control">
                <label className="label">
                  <span className="label-text">{f.label}</span>
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  className="input input-bordered w-full"
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  required={f.required}
                />
              </div>
            ))}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading
                ? <span className="loading loading-spinner loading-sm" />
                : 'Create account'
              }
            </button>
          </form>

          <p className="text-center text-sm mt-3">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}