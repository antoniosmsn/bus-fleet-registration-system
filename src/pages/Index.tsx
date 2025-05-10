
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/buses');
    }, 2000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Bus className="h-20 w-20 text-transport-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-transport-900">Sistema de Registro de Flota de Autobuses</h1>
          <p className="text-xl text-gray-600 mb-8">Administre su flota de autobuses con eficiencia y cumplimiento</p>
          <div className="animate-pulse text-transport-600">
            Redirigiendo al panel principal...
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
