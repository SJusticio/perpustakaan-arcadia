'use client';

import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  return { 
    isAuthenticated: isAuth, 
    isLoading,
    logout
  };
}