'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token   = localStorage.getItem('ideavault_token');
    const saved   = localStorage.getItem('ideavault_user');
    if (token && saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const save = (token, user) => {
    localStorage.setItem('ideavault_token', token);
    localStorage.setItem('ideavault_user', JSON.stringify(user));
    setUser(user);
  };

  const login = async (email, password) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      { email, password }
    );
    save(res.data.token, res.data.user);
  };

  const register = async (name, email, photo, password) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      { name, email, photo, password }
    );
    save(res.data.token, res.data.user);
  };

  const googleLogin = async (profile) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
      profile
    );
    save(res.data.token, res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('ideavault_token');
    localStorage.removeItem('ideavault_user');
    setUser(null);
  };

  const updateUser = (updated) => {
    localStorage.setItem('ideavault_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleLogin, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);