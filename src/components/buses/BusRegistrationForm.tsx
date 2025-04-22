import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import FileUpload from './FileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BusGeneralInfoForm from './BusGeneralInfoForm';
import BusTechnicalDetailsForm from './BusTechnicalDetailsForm';
import BusDocumentsForm from './BusDocumentsForm';

// Define the bus registration form schema
const busRegistrationSchema = z.object({
  plate: z.string().min(6, 'Plate must be at least 6 characters').max(10, 'Plate cannot exceed 10 characters'),
  company: z.string({ required_error: 'Company is required' }),
  brand: z.string().min(2, 'Brand must be at least 2 characters'),
  year: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1990 && Number(val) <= new Date().getFullYear(), {
    message: `Year must be between 1990 and ${new Date().getFullYear()}`
  }),
  capacity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100, {
    message: 'Capacity must be between 1 and 100'
  }),
  unitType: z.string({ required_error: 'Unit type is required' }),
  engineSeries: z.string().min(2, 'Engine series must be at least 2 characters'),
  status: z.string().default('active'),
  readerSerial: z.string().optional(),
  hasCameraMonitoring: z.boolean().default(false),
  hasReverseParking: z.boolean().default(false),
  hasABS: z.boolean().default(false),
  hasESC: z.boolean().default(false),
  hasSeatbelt: z.boolean().default(false),
  dekraExpirationDate: z.string().min(1, 'Dekra expiration date is required'),
  insuranceExpirationDate: z.string().min(1, 'Insurance expiration date is required'),
  taxExpirationDate: z.string().min(1, 'Tax expiration date is required'),
  ctpExpirationDate: z.string().min(1, 'CTP expiration date is required'),
});

type BusRegistrationFormValues = z.infer<typeof busRegistrationSchema>;

const BusRegistrationForm: React.FC = () => {
  const { toast } = useToast();
  const [busPhotos, setBusPhotos] = useState<File[]>([]);
  const [dekraDocument, setDekraDocument] = useState<File[]>([]);
  const [insuranceDocument, setInsuranceDocument] = useState<File[]>([]);
  const [taxDocument, setTaxDocument] = useState<File[]>([]);
  const [ctpDocument, setCtpDocument] = useState<File[]>([]);

  const form = useForm<BusRegistrationFormValues>({
    resolver: zodResolver(busRegistrationSchema),
    defaultValues: {
      plate: '',
      company: '',
      brand: '',
      year: '',
      capacity: '',
      unitType: '',
      engineSeries: '',
      status: 'active',
      readerSerial: '',
      hasCameraMonitoring: false,
      hasReverseParking: false,
      hasABS: false,
      hasESC: false,
      hasSeatbelt: false,
      dekraExpirationDate: '',
      insuranceExpirationDate: '',
      taxExpirationDate: '',
      ctpExpirationDate: '',
    },
  });

  const onSubmit = (data: BusRegistrationFormValues) => {
    // Validate that at least one bus photo is uploaded
    if (busPhotos.length === 0) {
      toast({
        title: 'Error',
        description: 'At least one bus photo is required',
        variant: 'destructive',
      });
      return;
    }

    // Validate required documents
    if (dekraDocument.length === 0 || insuranceDocument.length === 0 || 
        taxDocument.length === 0 || ctpDocument.length === 0) {
      toast({
        title: 'Error',
        description: 'All required documents must be uploaded',
        variant: 'destructive',
      });
      return;
    }

    // Check if bus has a reader, if not set status to inactive
    if (!data.readerSerial || data.readerSerial.trim() === '') {
      data.status = 'inactive';
      toast({
        title: 'Warning',
        description: 'Bus without reader registered in inactive state.',
      });
    }

    // Construct the final form data with files
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    // Append files
    busPhotos.forEach((file, index) => {
      formData.append(`busPhoto${index}`, file);
    });

    if (dekraDocument[0]) formData.append('dekraDocument', dekraDocument[0]);
    if (insuranceDocument[0]) formData.append('insuranceDocument', insuranceDocument[0]);
    if (taxDocument[0]) formData.append('taxDocument', taxDocument[0]);
    if (ctpDocument[0]) formData.append('ctpDocument', ctpDocument[0]);

    // In a real application, you would send this formData to your API
    console.log('Form submitted with data:', data);
    console.log('Bus photos:', busPhotos);
    console.log('Documents:', { dekraDocument, insuranceDocument, taxDocument, ctpDocument });

    // Show success toast
    toast({
      title: 'Success',
      description: 'Bus registered successfully',
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-transport-700">Registro de Autobús</CardTitle>
        <CardDescription>Registre un nuevo autobús con toda la información requerida y documentación</CardDescription>
      </CardHeader>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 mx-6">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="technical">Detalles Técnicos</TabsTrigger>
          <TabsTrigger value="documents">Documentación</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-6">
              <TabsContent value="general">
                <BusGeneralInfoForm 
                  form={form} 
                  busPhotos={busPhotos}
                  setBusPhotos={setBusPhotos}
                />
              </TabsContent>
              <TabsContent value="technical">
                <BusTechnicalDetailsForm form={form} />
              </TabsContent>
              <TabsContent value="documents">
                <BusDocumentsForm
                  form={form}
                  dekraDocument={dekraDocument}
                  setDekraDocument={setDekraDocument}
                  insuranceDocument={insuranceDocument}
                  setInsuranceDocument={setInsuranceDocument}
                  taxDocument={taxDocument}
                  setTaxDocument={setTaxDocument}
                  ctpDocument={ctpDocument}
                  setCtpDocument={setCtpDocument}
                />
              </TabsContent>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" type="button">Cancelar</Button>
              <Button type="submit" className="bg-transport-600 hover:bg-transport-700">Registrar Autobús</Button>
            </CardFooter>
          </form>
        </Form>
      </Tabs>
    </Card>
  );
};

export default BusRegistrationForm;
