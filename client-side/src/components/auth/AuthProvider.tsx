import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  authToken: string | null;
  role: string | null;
  setAuthToken: (token: string | null) => void;
  setRole: (role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, role, setRole }}>
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