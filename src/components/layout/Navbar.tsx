import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden mr-2" />
            <Link to="/" className="flex items-center md:hidden">
              <Bus className="h-8 w-8 text-transport-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">SistemaTransporte</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
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
                {/* We'll use the sidebar content in the mobile menu */}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
