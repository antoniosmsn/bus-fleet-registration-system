import React from 'react';
import SidebarComponent from './Sidebar';
import Navbar from './Navbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <SidebarComponent />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-white px-4">
            <SidebarTrigger />
            <Navbar />
          </header>
          <main className="flex-1 p-6 overflow-x-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;