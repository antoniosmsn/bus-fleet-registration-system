
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
            required={true}
            onChange={setDekraDocument}
            helperText="Suba el certificado Dekra"
          />
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
            required={true}
            onChange={setInsuranceDocument}
            helperText="Suba el documento del seguro"
          />
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
            required={true}
            onChange={setTaxDocument}
            helperText="Suba el documento de marchamo"
          />
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
            required={true}
            onChange={setCtpDocument}
            helperText="Suba el certificado de CTP"
          />
        </div>
      </div>
    </div>
  );
};

export default BusDocumentsForm;
