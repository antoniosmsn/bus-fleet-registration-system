
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileUpload from './FileUpload';

interface BusGeneralInfoFormProps {
  form: any;
  busPhotos: File[];
  setBusPhotos: (files: File[]) => void;
}

const BusGeneralInfoForm: React.FC<BusGeneralInfoFormProps> = ({ form, busPhotos, setBusPhotos }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Placa</FormLabel>
              <FormControl>
                <Input placeholder="SJB-123" {...field} />
              </FormControl>
              <FormDescription>Ingrese la placa del bus</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Empresa de Transporte</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una empresa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="company1">Transportes SA</SelectItem>
                  <SelectItem value="company2">Buses Costa</SelectItem>
                  <SelectItem value="company3">Tránsito Metropolitano</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Seleccione la empresa propietaria</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Marca</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la marca" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mercedes">Mercedes Benz</SelectItem>
                  <SelectItem value="volvo">Volvo</SelectItem>
                  <SelectItem value="scania">Scania</SelectItem>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="other">Otra</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Seleccione la marca del bus</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Año</FormLabel>
              <FormControl>
                <Input type="number" placeholder="2023" {...field} />
              </FormControl>
              <FormDescription>Año de fabricación</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Capacidad</FormLabel>
              <FormControl>
                <Input type="number" placeholder="40" {...field} />
              </FormControl>
              <FormDescription>Número de pasajeros</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitType"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Tipo de Unidad</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bus">Autobús</SelectItem>
                  <SelectItem value="minibus">Microbús</SelectItem>
                  <SelectItem value="microbus">Microbús</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Seleccione el tipo de unidad</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Estado operacional actual</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="engineSeries"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Serie Motor</FormLabel>
              <FormControl>
                <Input placeholder="ABC12345XYZ" {...field} />
              </FormControl>
              <FormDescription>Serie del motor</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="mt-6">
        <div className="text-sm font-medium mb-2">Fotos del Bus</div>
        <FileUpload
          label="Fotos del bus"
          acceptTypes=".jpg,.jpeg,.png"
          id="busPhotos"
          required={true}
          multiple={true}
          onChange={setBusPhotos}
          helperText="Suba al menos una foto. Puede subir varias."
        />
      </div>
    </div>
  );
};

export default BusGeneralInfoForm;
