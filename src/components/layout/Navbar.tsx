
import React from 'react';
import { Link } from 'react-router-dom';
import { Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Bus className="h-8 w-8 text-transport-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">TransportSystem</span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-transport-600">
                Dashboard
              </Link>
              <Link to="/buses" className="px-3 py-2 text-sm font-medium text-transport-600 border-b-2 border-transport-600">
                Buses
              </Link>
              <Link to="/companies" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-transport-600">
                Companies
              </Link>
              <Link to="/reports" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-transport-600">
                Reports
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="mr-2">
              Admin
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
