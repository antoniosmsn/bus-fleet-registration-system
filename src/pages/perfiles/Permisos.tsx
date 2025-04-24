
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { PerfilPermisosManager } from "@/components/perfiles/PerfilPermisosManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PerfilPermisos = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/perfiles')} 
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Perfiles
          </Button>
          
          <h1 className="text-2xl font-bold">Gestión de Permisos por Perfil</h1>
          <p className="text-gray-600">
            Asigne permisos específicos a cada perfil dentro de su zona franca
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <PerfilPermisosManager />
        </div>
      </div>
    </Layout>
  );
};

export default PerfilPermisos;
