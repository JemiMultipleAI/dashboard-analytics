'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface ConnectedAccounts {
  ga4: boolean;
  gsc: boolean;
  ads: boolean;
}

interface CustomDashboard {
  id: string;
  name: string;
  widgets: { id: string; type: string; x: number; y: number; w: number; h: number }[];
  createdAt: Date;
}

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  connectedAccounts: ConnectedAccounts;
  connectAccount: (account: keyof ConnectedAccounts) => void;
  disconnectAccount: (account: keyof ConnectedAccounts) => void;
  customDashboards: CustomDashboard[];
  addDashboard: (dashboard: CustomDashboard) => void;
  updateDashboard: (id: string, dashboard: Partial<CustomDashboard>) => void;
  deleteDashboard: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load connected accounts from localStorage on mount
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccounts>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('connectedAccounts');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return { ga4: false, gsc: false, ads: false };
        }
      }
    }
    return { ga4: false, gsc: false, ads: false };
  });
  // Load custom dashboards from localStorage on mount
  const [customDashboards, setCustomDashboards] = useState<CustomDashboard[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customDashboards');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Convert createdAt strings back to Date objects
          return parsed.map((d: any) => ({
            ...d,
            createdAt: new Date(d.createdAt),
          }));
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Persist connected accounts to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('connectedAccounts', JSON.stringify(connectedAccounts));
    }
  }, [connectedAccounts]);

  // Persist custom dashboards to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customDashboards', JSON.stringify(customDashboards));
    }
  }, [customDashboards]);

  const connectAccount = useCallback((account: keyof ConnectedAccounts) => {
    setConnectedAccounts((prev) => {
      // Only update if not already connected to prevent unnecessary re-renders
      if (prev[account]) return prev;
      const updated = { ...prev, [account]: true };
      return updated;
    });
  }, []);

  const disconnectAccount = useCallback((account: keyof ConnectedAccounts) => {
    setConnectedAccounts((prev) => {
      // Only update if currently connected
      if (!prev[account]) return prev;
      return { ...prev, [account]: false };
    });
  }, []);

  const addDashboard = (dashboard: CustomDashboard) => {
    setCustomDashboards((prev) => [...prev, dashboard]);
  };

  const updateDashboard = (id: string, updates: Partial<CustomDashboard>) => {
    setCustomDashboards((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  };

  const deleteDashboard = (id: string) => {
    setCustomDashboards((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newValue;
    });
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        connectedAccounts,
        connectAccount,
        disconnectAccount,
        customDashboards,
        addDashboard,
        updateDashboard,
        deleteDashboard,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
