
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

interface BusTechnicalDetailsFormProps {
  form: any;
}

const BusTechnicalDetailsForm: React.FC<BusTechnicalDetailsFormProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="readerSerial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial del validador</FormLabel>
              <FormControl>
                <Input placeholder="Validador12345" {...field} />
              </FormControl>
              <FormDescription>
                Número de serie del validador de tarjetas (opcional). Si no se ingresa, el bus se registrará como inactivo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Características de Seguridad</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hasCameraMonitoring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Monitoreo por cámara</FormLabel>
                  <FormDescription>
                    El bus cuenta con sistema de monitoreo por cámara
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasReverseParking"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Sensores de Retroceso</FormLabel>
                  <FormDescription>
                    El bus cuenta con sensores de retroceso
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasABS"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Sistema ABS</FormLabel>
                  <FormDescription>
                    El bus está equipado con sistema de frenos antibloqueo
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasESC"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Sistema ESC</FormLabel>
                  <FormDescription>
                    Control Electrónico de Estabilidad (ESC)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hasSeatbelt"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Cinturones de Seguridad</FormLabel>
                  <FormDescription>
                    El bus cuenta con cinturones de seguridad para pasajeros
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default BusTechnicalDetailsForm;
