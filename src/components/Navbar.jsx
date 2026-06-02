'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('ideavault_theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('ideavault_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <nav className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4">

      {/* Logo */}
      <div className="navbar-start">
        <Link href="/" className="flex items-center gap-2">
            <img
              src="/ideavault-logo.png"
              alt="IdeaVault Logo"
              className="h-15 w-auto object-contain"
            />
            
          </Link>
      </div>

      {/* Desktop links */}
      <div className="navbar-center hidden lg:flex gap-1">
        <Link href="/" className="btn btn-ghost btn-sm">Home</Link>
        <Link href="/ideas" className="btn btn-ghost btn-sm">Ideas</Link>
        {user && (
          <>
            <Link href="/add-idea" className="btn btn-ghost btn-sm">Add Idea</Link>
            <Link href="/my-ideas" className="btn btn-ghost btn-sm">My Ideas</Link>
            <Link href="/my-interactions" className="btn btn-ghost btn-sm">
              My Interactions
            </Link>
          </>
        )}
      </div>

      {/* Right side */}
      <div className="navbar-end gap-2">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-sm btn-circle text-lg"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {/* Logged out */}
        {!user ? (
          <div className="hidden lg:flex gap-2">
            <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
          </div>
        ) : (
          /* User avatar dropdown */
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar cursor-pointer">
              <div className="w-9 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                <img
                  src={user.photo || 'https://placehold.co/40?text=U'}
                  alt={user.name}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu shadow-lg bg-base-100 rounded-box w-48 mt-2 p-2 border border-base-200"
            >
              <li className="px-3 py-1 text-xs opacity-50 font-medium">
                {user.name}
              </li>
              <div className="divider my-0"></div>
              <li><Link href="/profile">Profile</Link></li>
              <li><Link href="/my-ideas">My Ideas</Link></li>
              <li><Link href="/my-interactions">My Interactions</Link></li>
              <div className="divider my-0"></div>
              <li>
                <button onClick={handleLogout} className="text-error">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}

        {/* Mobile hamburger */}
        <div className="dropdown dropdown-end lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
            ☰
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu shadow bg-base-100 rounded-box w-48 mt-2 p-2 border border-base-200"
          >
            <li><Link href="/">Home</Link></li>
            <li><Link href="/ideas">Ideas</Link></li>
            {user ? (
              <>
                <li><Link href="/add-idea">Add Idea</Link></li>
                <li><Link href="/my-ideas">My Ideas</Link></li>
                <li><Link href="/my-interactions">My Interactions</Link></li>
                <li><Link href="/profile">Profile</Link></li>
                <div className="divider my-0"></div>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link href="/login">Login</Link></li>
                <li><Link href="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}