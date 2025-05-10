
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        <Card>
          <CardHeader>
            <CardTitle>Página en Construcción</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Esta funcionalidad estará disponible próximamente.</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PlaceholderPage;
