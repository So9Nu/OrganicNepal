import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [loading, setLoading] = useState(false);

  // Check if token is still valid on mount
  useEffect(() => {
    if (token) {
      // Optionally verify token with backend
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded.user);
        } else {
          localStorage.removeItem('authToken');
          setToken(null);
        }
      } catch (e) {
        localStorage.removeItem('authToken');
        setToken(null);
      }
    }
  }, [token]);

  const login = async (email, password, isAdmin = false, userData = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Login failed' };
      }

      // Store token and user
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
      setUser(data.user);

      return {
        success: true,
        role: data.user.role || 'user',
        user: data.user,
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, firstName, lastName, phone, name) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, phone, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Registration failed' };
      }

      return { success: true, message: 'Registration successful. Please login.' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      signup,
      isAdmin,
      loading,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
