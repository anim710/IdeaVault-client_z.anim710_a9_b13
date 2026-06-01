'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { authClient } from '@/lib/authClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on refresh
  useEffect(() => {
    const token = localStorage.getItem('ideavault_token');
    const saved = localStorage.getItem('ideavault_user');
    if (token && saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const save = (token, user) => {
    localStorage.setItem('ideavault_token', token);
    localStorage.setItem('ideavault_user', JSON.stringify(user));
    setUser(user);
  };

  // Email/password login — hits our Express server
  const login = async (email, password) => {
  
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      { email, password }
    );
    
    save(res.data.token, res.data.user);
  };

  // Email/password register — hits our Express server
  const register = async (name, email, photo, password) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      { name, email, photo, password }
    );
    save(res.data.token, res.data.user);
  };

  // Google login via BetterAuth — then syncs with our Express server
  const googleLogin = async () => {
    try {
      // Step 1: BetterAuth handles the Google OAuth popup/redirect
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/auth/google/callback',
      });
      // The rest happens in the callback page (see Step 8)
    } catch (err) {
      throw new Error('Google login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('ideavault_token');
    localStorage.removeItem('ideavault_user');
    setUser(null);
    authClient.signOut();
  };

  const updateUser = (updated) => {
    localStorage.setItem('ideavault_user', JSON.stringify(updated));
    setUser(updated);
  };

  // Called from the Google callback page after OAuth completes
  const syncGoogleUser = async (profile) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
      profile
    );
    save(res.data.token, res.data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user, loading,
        login, register, googleLogin,
        logout, updateUser, syncGoogleUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);