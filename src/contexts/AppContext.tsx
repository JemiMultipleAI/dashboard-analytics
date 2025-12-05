'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccounts>({
    ga4: false,
    gsc: false,
    ads: false,
  });
  const [customDashboards, setCustomDashboards] = useState<CustomDashboard[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const connectAccount = (account: keyof ConnectedAccounts) => {
    setConnectedAccounts((prev) => ({ ...prev, [account]: true }));
  };

  const disconnectAccount = (account: keyof ConnectedAccounts) => {
    setConnectedAccounts((prev) => ({ ...prev, [account]: false }));
  };

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
