
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import BusRegistrationForm, { BusFormValues } from '@/components/buses/BusRegistrationForm';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Bus } from '@/types/bus';

// Mock API function to get bus details
const getBusDetails = async (id: string): Promise<Bus> => {
  // In a real application, you would fetch the data from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: parseInt(id),
        plate: `ABC-${id}`,
        busId: `ENGINE-${id}`,
        readerSerial: `READER-${id}`,
        company: 'company1',
        brand: 'mercedes',
        year: 2020,
        capacity: 40,
        dekraExpirationDate: '2025-12-31',
        insuranceExpirationDate: '2025-10-15',
        ctpExpirationDate: '2025-08-20',
        taxExpirationDate: '2025-09-01',
        type: 'bus',
        status: 'active',
        approved: true,
        approvalDate: '2024-01-15',
        approvalUser: 'admin'
      });
    }, 500);
  });
};

// Mock API function to update bus
const updateBus = async (id: string, data: BusFormValues): Promise<{ success: boolean; message: string }> => {
  // In a real application, you would send the data to an API
  console.log(`Updating bus ${id} with data:`, data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate validation check for duplicate reader serial
      if (data.readerSerial === 'duplicate') {
        resolve({
          success: false,
          message: 'El serial de la lectora ya está asignado a otro autobús.'
        });
        return;
      }
      
      // Simulate validation check for duplicate plate
      if (data.plate === 'duplicate') {
        resolve({
          success: false,
          message: 'La placa ya está asignada a otro autobús de la misma empresa.'
        });
        return;
      }
      
      resolve({
        success: true,
        message: 'Autobús actualizado exitosamente'
      });
    }, 1000);
  });
};

// Mock function to check if user has permission to change company
const userHasPermissionToChangeCompany = (): boolean => {
  // In a real application, this would check user permissions
  return true;
};

const EditBus: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bus, setBus] = useState<Bus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canChangeCompany = userHasPermissionToChangeCompany();
  
  useEffect(() => {
    const fetchBus = async () => {
      try {
        if (!id) throw new Error('Bus ID is required');
        const data = await getBusDetails(id);
        setBus(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch bus details:', error);
        setError('Failed to load bus details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchBus();
  }, [id]);
  
  const handleSuccess = async (data: BusFormValues) => {
    try {
      if (!id) return;
      const result = await updateBus(id, data);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Autobús actualizado exitosamente',
        });
        navigate('/buses');
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating bus:', error);
      toast({
        title: 'Error',
        description: 'Failed to update bus. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-transport-600 rounded-full border-t-transparent"></div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error || !bus) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-600 mb-4">{error || 'Failed to load bus details'}</p>
            <Link to="/buses">
              <Button variant="outline">Back to Buses</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
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
        
        <BusRegistrationForm 
          initialData={bus} 
          isEditing={true} 
          onSuccess={handleSuccess}
          canChangeCompany={canChangeCompany}
        />
      </main>
    </div>
  );
};

export default EditBus;
