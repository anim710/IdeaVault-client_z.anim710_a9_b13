'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const router                 = useRouter();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await googleLogin();
      // Redirect is handled by BetterAuth → callback page
    } catch {
      toast.error('Google login failed. Try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md border border-base-200">
        <div className="card-body">

          <h1 className="card-title text-2xl justify-center mb-1">
            Welcome back
          </h1>
          <p className="text-center text-sm text-base-content/60 mb-6">
            Sign in to your IdeaVault account
          </p>

          {/* Google Login Button */}
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
            Continue with Google
          </button>

          <div className="divider text-xs opacity-40">OR</div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
                <span className="label-text-alt text-primary cursor-pointer">
                  Forgot password?
                </span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading
                ? <span className="loading loading-spinner loading-sm" />
                : 'Login with email'
              }
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            No account?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              Register here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}