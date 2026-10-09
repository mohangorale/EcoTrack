import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = [
  { role: 'CUSTOMER', name: 'Rahul Patil', email: 'rahul@gmail.com', label: 'Customer (Rahul)' },
  { role: 'COLLECTION_CENTRE', name: 'Sneha Joshi', email: 'sneha@collect.com', label: 'Collection Centre (Sneha)' },
  { role: 'TRANSPORTER', name: 'Vikram Singh', email: 'vikram@transport.com', label: 'Transporter (Vikram)' },
  { role: 'INSPECTOR', name: 'Amit Kumar', email: 'amit@inspect.com', label: 'Inspector (Amit)' },
  { role: 'RECYCLER', name: 'Priya Sharma', email: 'priya@recycle.com', label: 'Recycler (Priya)' },
  { role: 'ADMIN', name: 'Admin', email: 'admin@ecotrack.com', label: 'Administrator' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ecotrack_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const storedToken = localStorage.getItem('ecotrack_token');
      if (!storedToken) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        if (mounted) setUser(res.data.user);
      } catch {
        localStorage.removeItem('ecotrack_token');
        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();
    return () => { mounted = false; };
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    const accessToken = res.data.accessToken;
    if (!accessToken) throw new Error('The server did not return an access token.');
    localStorage.setItem('ecotrack_token', accessToken);
    setToken(accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const signup = async (userData) => {
    const res = await api.register(userData);
    return res.data;
  };

  const quickLogin = async (email) => login(email, 'Password123!');

  const logout = () => {
    localStorage.removeItem('ecotrack_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    setUser(res.data.user);
    return res.data.user;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, quickLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
