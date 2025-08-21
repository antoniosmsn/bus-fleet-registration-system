
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TelemetriaListado: React.FC = () => {
  useEffect(() => {
    document.title = 'Listado de telemetría | SistemaTransporte';
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 z-10 min-h-[72px] w-full">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">Telemetría</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="w-full flex-1 overflow-hidden bg-muted/30 p-6">
        <Card className="w-full h-full shadow-sm">
          <CardHeader>
            <CardTitle>Listado de Telemetría</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Página lista para recibir nuevas instrucciones de implementación.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TelemetriaListado;
