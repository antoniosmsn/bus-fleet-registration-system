
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { to: "/", label: "Panel Principal" },
    { to: "/buses", label: "Autobuses" },
    { to: "/conductores", label: "Conductores" },
    { to: "/configuracion/parametros", label: "Configuración" },
    { to: "/perfiles", label: "Perfiles" },
    { to: "/companies", label: "Empresas" },
    { to: "/reports", label: "Informes" },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Bus className="h-8 w-8 text-transport-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">SistemaTransporte</span>
            </Link>
            
            {/* Desktop Menu */}
            <nav className="hidden md:ml-8 md:flex md:space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-transport-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Administrador
            </Button>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="md:hidden">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="px-4 py-2 text-sm font-medium text-gray-900 hover:text-transport-600 hover:bg-gray-50 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
