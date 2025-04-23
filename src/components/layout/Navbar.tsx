
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
              <span className="ml-2 text-xl font-semibold text-gray-900">SistemaTransporte</span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-transport-600">
                Panel Principal
              </Link>
              <Link to="/buses" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-transport-600">
                Autobuses
              </Link>
              <Link to="/configuracion/parametros" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-transport-600">
                Configuración
              </Link>
              <Link to="/perfiles" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-transport-600">
                Perfiles
              </Link>
              <Link to="/companies" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-transport-600">
                Empresas
              </Link>
              <Link to="/reports" className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-transport-600">
                Informes
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="mr-2">
              Administrador
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
