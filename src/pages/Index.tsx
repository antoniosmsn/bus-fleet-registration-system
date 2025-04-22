
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/buses');
    }, 2000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transport-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Bus className="h-20 w-20 text-transport-600" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-transport-900">Bus Fleet Registration System</h1>
        <p className="text-xl text-gray-600 mb-8">Manage your bus fleet with efficiency and compliance</p>
        <div className="animate-pulse text-transport-600">
          Redirecting to the dashboard...
        </div>
      </div>
    </div>
  );
};

export default Index;
