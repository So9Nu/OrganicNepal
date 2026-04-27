import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Mock user data
const MOCK_USER = { id: 1, name: 'Sabina Shrestha', email: 'sabina@example.com', role: 'user' };
const MOCK_ADMIN = { id: 99, name: 'Admin Nepal', email: 'admin@gmail.com', role: 'admin' };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password, isAdmin = false, userData = {}) => {
    // Mock authentication
    if (isAdmin && email === 'admin@gmail.com' && password === 'Admin@123') {
      setUser(MOCK_ADMIN);
      return { success: true, role: 'admin' };
    } else if (!isAdmin && email && password) {
      const newUser = {
        ...MOCK_USER,
        email,
        phone: userData.phone || '',
        address: userData.address || '',
      };
      setUser(newUser);
      return { success: true, role: 'user' };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => setUser(null);

  const signup = (name, email, password, phone = '') => {
    setUser({ ...MOCK_USER, name, email, phone });
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
