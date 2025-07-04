import React from 'react';
import SidebarComponent from './Sidebar';
import Navbar from './Navbar';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  return <div className="min-h-screen flex w-full bg-gray-50">
      <SidebarComponent />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>;
};
export default Layout;