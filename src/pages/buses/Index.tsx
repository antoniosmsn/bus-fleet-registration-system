
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BusesIndex = () => {
  // Mock data for demonstration
  const buses = [
    { id: 1, plate: 'SJB-1234', company: 'Transport Co SA', brand: 'Mercedes Benz', year: 2021, status: 'active' },
    { id: 2, plate: 'SJB-5678', company: 'Costa Buses Inc', brand: 'Volvo', year: 2020, status: 'active' },
    { id: 3, plate: 'SJB-9012', company: 'Metropolitan Transit', brand: 'Scania', year: 2019, status: 'inactive' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bus Fleet Management</h1>
            <p className="text-gray-600">Manage your bus fleet registrations</p>
          </div>
          <Link to="/buses/register">
            <Button className="bg-transport-600 hover:bg-transport-700">
              <Plus className="mr-2 h-4 w-4" />
              Register New Bus
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Registered Buses</CardTitle>
            <CardDescription>View all the buses registered in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-6 py-3">Plate</th>
                    <th className="px-6 py-3">Company</th>
                    <th className="px-6 py-3">Brand</th>
                    <th className="px-6 py-3">Year</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{bus.plate}</td>
                      <td className="px-6 py-4">{bus.company}</td>
                      <td className="px-6 py-4">{bus.brand}</td>
                      <td className="px-6 py-4">{bus.year}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bus.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BusesIndex;
