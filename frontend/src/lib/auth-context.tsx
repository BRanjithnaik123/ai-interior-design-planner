'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ── Types ──
export interface User {
  id: string;
  email: string;
  full_name: string;
  credits: number;
  plan: string;
  created_at: string;
}

export interface RegisteredUser {
  id: string;
  email: string;
  full_name: string;
  password: string;
  credits: number;
  plan: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  allUsers: RegisteredUser[];
  loginUser: (email: string, password: string) => { success: boolean; error?: string };
  registerUser: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  refreshUser: () => void;
}

// ── Helpers ──
const USERS_KEY = 'designai_users';
const SESSION_KEY = 'designai_session';

function getStoredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveUsers(users: RegisteredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// ── Context ──
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<RegisteredUser[]>([]);

  // Load session on mount
  useEffect(() => {
    const session = getSession();
    setUser(session);
    setAllUsers(getStoredUsers());
    setLoading(false);
  }, []);

  const refreshUser = useCallback(() => {
    setUser(getSession());
    setAllUsers(getStoredUsers());
  }, []);

  const registerUser = useCallback((name: string, email: string, password: string): { success: boolean; error?: string } => {
    const existing = getStoredUsers();

    // Validation
    if (!name.trim()) return { success: false, error: 'Full name is required.' };
    if (!email.trim()) return { success: false, error: 'Email is required.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
    if (existing.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: RegisteredUser = {
      id: generateId(),
      email: email.toLowerCase().trim(),
      full_name: name.trim(),
      password, // In a real app this would be hashed
      credits: 5,
      plan: 'free',
      created_at: new Date().toISOString(),
    };

    const updated = [...existing, newUser];
    saveUsers(updated);
    setAllUsers(updated);

    return { success: true };
  }, []);

  const loginUser = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const users = getStoredUsers();
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password. Please try again.' };
    }

    const session: User = {
      id: found.id,
      email: found.email,
      full_name: found.full_name,
      credits: found.credits,
      plan: found.plan,
      created_at: found.created_at,
    };

    saveSession(session);
    setUser(session);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    saveSession(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      allUsers,
      loginUser,
      registerUser,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
