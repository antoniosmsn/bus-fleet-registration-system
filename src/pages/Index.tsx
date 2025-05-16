
import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, ChevronRight } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Bus className="h-20 w-20 text-transport-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-transport-900">Sistema de Registro de Flota de Autobuses</h1>
          <p className="text-xl text-gray-600 mb-8">Administre su flota de autobuses con eficiencia y cumplimiento</p>
          
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            <Card className="w-full md:w-64 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <Link to="/buses">
                  <Button variant="ghost" className="w-full justify-between">
                    Autobuses <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-64 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <Link to="/conductores">
                  <Button variant="ghost" className="w-full justify-between">
                    Conductores <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="w-full md:w-64 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <Link to="/perfiles">
                  <Button variant="ghost" className="w-full justify-between">
                    Perfiles <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
