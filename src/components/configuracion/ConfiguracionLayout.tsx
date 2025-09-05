import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ConfiguracionSidebar } from "./ConfiguracionSidebar";
import { Button } from "@/components/ui/button";
import { Home, Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface ConfiguracionLayoutProps {
  children: React.ReactNode;
}

export function ConfiguracionLayout({ children }: ConfiguracionLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Header con trigger del sidebar y botón de inicio */}
        <header className="fixed top-0 left-0 right-0 h-14 bg-background border-b z-50 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <SidebarTrigger className="p-2">
              <Menu className="h-4 w-4" />
            </SidebarTrigger>
            <h2 className="text-lg font-semibold text-foreground">Configuración del Sistema</h2>
          </div>
          <Button 
            asChild 
            variant="ghost" 
            size="sm"
            className="flex items-center space-x-2"
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              <span>Inicio</span>
            </Link>
          </Button>
        </header>

        <ConfiguracionSidebar />

        {/* Contenido principal con margen para el header */}
        <main className="flex-1 pt-14">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}