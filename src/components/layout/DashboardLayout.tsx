'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { Footer } from './Footer';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Sidebar />
      <div className="ml-64 transition-all duration-300 flex flex-col flex-1">
        <TopNav title={title} />
        <main className="p-6 flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
};
