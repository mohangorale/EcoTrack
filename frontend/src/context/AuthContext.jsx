import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [token, setToken] = useState(localStorage.getItem('ecotrack_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('ecotrack_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          setUser(res.data.user);
        } catch (err) {
          console.warn('Session expired, clearing storage');
          localStorage.removeItem('ecotrack_token');
          setToken(null);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    const accessToken = res.data.accessToken;
    localStorage.setItem('ecotrack_token', accessToken);
    setToken(accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const signup = async (userData) => {
    const res = await api.register(userData);
    if (res.data?.accessToken) {
      localStorage.setItem('ecotrack_token', res.data.accessToken);
      setToken(res.data.accessToken);
      setUser(res.data.user);
    }
    return res.data;
  };

  const quickLogin = async (email) => {
    try {
      const res = await api.login(email, 'Password123!');
      localStorage.setItem('ecotrack_token', res.data.accessToken);
      setToken(res.data.accessToken);
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      console.error('Quick login failed:', err);
    }
  };

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
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        quickLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
