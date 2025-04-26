
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import FileUpload from './FileUpload';
import { Separator } from '@/components/ui/separator';

interface BusDocumentsFormProps {
  form: any;
  dekraDocument: File[];
  setDekraDocument: (f: File[]) => void;
  insuranceDocument: File[];
  setInsuranceDocument: (f: File[]) => void;
  taxDocument: File[];
  setTaxDocument: (f: File[]) => void;
  ctpDocument: File[];
  setCtpDocument: (f: File[]) => void;
  isEditing?: boolean;
}

const BusDocumentsForm: React.FC<BusDocumentsFormProps> = ({
  form,
  dekraDocument,
  setDekraDocument,
  insuranceDocument,
  setInsuranceDocument,
  taxDocument,
  setTaxDocument,
  ctpDocument,
  setCtpDocument,
  isEditing = false,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="dekraExpirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Fecha de expiración Dekra</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Fecha de vencimiento del certificado Dekra
                {isEditing && (
                  <span className="block text-amber-600 mt-1">
                    Si modifica esta fecha, debe ser mayor a la fecha actual
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FileUpload
            label="Documento Dekra"
            acceptTypes=".pdf,.docx,.jpg,.jpeg,.png"
            id="dekraDocument"
            required={!isEditing}
            onChange={setDekraDocument}
            helperText={isEditing ? "Suba un nuevo documento para reemplazar el existente" : "Suba el certificado Dekra"}
          />
          {isEditing && dekraDocument.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">El documento existente se mantendrá si no sube uno nuevo.</p>
          )}
        </div>
      </div>
      <Separator className="my-2" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="insuranceExpirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Fecha de expiración del seguro</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Fecha de vencimiento del seguro
                {isEditing && (
                  <span className="block text-amber-600 mt-1">
                    Si modifica esta fecha, debe ser mayor a la fecha actual
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FileUpload
            label="Documento de seguro"
            acceptTypes=".pdf,.docx,.jpg,.jpeg,.png"
            id="insuranceDocument"
            required={!isEditing}
            onChange={setInsuranceDocument}
            helperText={isEditing ? "Suba un nuevo documento para reemplazar el existente" : "Suba el documento del seguro"}
          />
          {isEditing && insuranceDocument.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">El documento existente se mantendrá si no sube uno nuevo.</p>
          )}
        </div>
      </div>
      <Separator className="my-2" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="taxExpirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Fecha de expiración de marchamo</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Fecha de vencimiento del marchamo
                {isEditing && (
                  <span className="block text-amber-600 mt-1">
                    Si modifica esta fecha, debe ser mayor a la fecha actual
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FileUpload
            label="Documento de marchamo"
            acceptTypes=".pdf,.docx,.jpg,.jpeg,.png"
            id="taxDocument"
            required={!isEditing}
            onChange={setTaxDocument}
            helperText={isEditing ? "Suba un nuevo documento para reemplazar el existente" : "Suba el documento de marchamo"}
          />
          {isEditing && taxDocument.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">El documento existente se mantendrá si no sube uno nuevo.</p>
          )}
        </div>
      </div>
      <Separator className="my-2" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="ctpExpirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="required-field">Fecha expiración CTP</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Fecha de vencimiento del certificado CTP
                {isEditing && (
                  <span className="block text-amber-600 mt-1">
                    Si modifica esta fecha, debe ser mayor a la fecha actual
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FileUpload
            label="Documento CTP"
            acceptTypes=".pdf,.docx,.jpg,.jpeg,.png"
            id="ctpDocument"
            required={!isEditing}
            onChange={setCtpDocument}
            helperText={isEditing ? "Suba un nuevo documento para reemplazar el existente" : "Suba el certificado de CTP"}
          />
          {isEditing && ctpDocument.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">El documento existente se mantendrá si no sube uno nuevo.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDocumentsForm;
