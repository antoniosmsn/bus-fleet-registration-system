
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import BusRegistrationForm from '@/components/buses/BusRegistrationForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegisterBus = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/buses">
            <Button variant="ghost" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Buses
            </Button>
          </Link>
        </div>
        
        <BusRegistrationForm />
      </main>
    </div>
  );
};

export default RegisterBus;
