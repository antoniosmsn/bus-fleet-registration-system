
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
        <CardTitle className="text-2xl font-bold text-transport-700">Bus Registration</CardTitle>
        <CardDescription>Register a new bus with all required information and documentation</CardDescription>
      </CardHeader>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 mx-6">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
          <TabsTrigger value="documents">Documentation</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-6">
              <TabsContent value="general" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="plate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Plate</FormLabel>
                        <FormControl>
                          <Input placeholder="SJB-123" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the bus license plate
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Transportation Company</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="company1">Transport Co SA</SelectItem>
                            <SelectItem value="company2">Costa Buses Inc</SelectItem>
                            <SelectItem value="company3">Metropolitan Transit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the company that owns the bus
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Brand</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a brand" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mercedes">Mercedes Benz</SelectItem>
                            <SelectItem value="volvo">Volvo</SelectItem>
                            <SelectItem value="scania">Scania</SelectItem>
                            <SelectItem value="toyota">Toyota</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the bus brand
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Year</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="2023" {...field} />
                        </FormControl>
                        <FormDescription>
                          Manufacturing year
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Capacity</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="40" {...field} />
                        </FormControl>
                        <FormDescription>
                          Number of passengers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unitType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Unit Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bus">Bus</SelectItem>
                            <SelectItem value="minibus">Minibus</SelectItem>
                            <SelectItem value="microbus">Microbus</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the type of unit
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current operational status
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="engineSeries"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required-field">Engine Series</FormLabel>
                        <FormControl>
                          <Input placeholder="ABC12345XYZ" {...field} />
                        </FormControl>
                        <FormDescription>
                          Engine serial number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-6">
                  <div className="text-sm font-medium mb-2">Bus Photos</div>
                  <FileUpload
                    label="Bus Photos"
                    acceptTypes=".jpg,.jpeg,.png"
                    id="busPhotos"
                    required={true}
                    multiple={true}
                    onChange={setBusPhotos}
                    helperText="Upload at least one photo of the bus. You can upload multiple photos."
                  />
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="readerSerial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reader Serial</FormLabel>
                        <FormControl>
                          <Input placeholder="Reader12345" {...field} />
                        </FormControl>
                        <FormDescription>
                          Card reader serial number (optional). Buses without readers will be set to inactive status.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Safety Features</h3>
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
                            <FormLabel>Camera Monitoring</FormLabel>
                            <FormDescription>
                              Bus is equipped with a camera monitoring system
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
                            <FormLabel>Reverse Parking Sensors</FormLabel>
                            <FormDescription>
                              Bus is equipped with reverse parking sensors
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
                            <FormLabel>ABS System</FormLabel>
                            <FormDescription>
                              Bus is equipped with an Anti-lock Braking System
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
                            <FormLabel>ESC System</FormLabel>
                            <FormDescription>
                              Bus is equipped with Electronic Stability Control
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
                            <FormLabel>Seatbelts</FormLabel>
                            <FormDescription>
                              Bus is equipped with passenger seatbelts
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dekraExpirationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="required-field">Dekra Expiration Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            Expiration date of the Dekra certification
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FileUpload
                        label="Dekra Document"
                        acceptTypes=".pdf,.docx,.jpg,.jpeg,.png"
                        id="dekraDocument"
                        required={true}
                        onChange={setDekraDocument}
                        helperText="Upload the Dekra certification document"
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
                          <FormLabel className="required-field">Insurance Expiration Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            Expiration date of the insurance
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FileUpload
                        label="Insurance Document"
                        acceptTypes=".pdf,.docx,.jpg,.jpeg,.png"
                        id="insuranceDocument"
                        required={true}
                        onChange={setInsuranceDocument}
                        helperText="Upload the insurance document"
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
                          <FormLabel className="required-field">Tax (Marchamo) Expiration Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            Expiration date of the tax (marchamo)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FileUpload
                        label="Tax Document"
                        acceptTypes=".pdf,.docx,.jpg,.jpeg,.png"
                        id="taxDocument"
                        required={true}
                        onChange={setTaxDocument}
                        helperText="Upload the tax (marchamo) document"
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
                          <FormLabel className="required-field">CTP Expiration Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            Expiration date of the CTP certification
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <FileUpload
                        label="CTP Document"
                        acceptTypes=".pdf,.docx,.jpg,.jpeg,.png"
                        id="ctpDocument"
                        required={true}
                        onChange={setCtpDocument}
                        helperText="Upload the CTP certification document"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>

            <CardFooter className="flex justify-between border-t p-6">
              <Button variant="outline" type="button">Cancel</Button>
              <Button type="submit" className="bg-transport-600 hover:bg-transport-700">Register Bus</Button>
            </CardFooter>
          </form>
        </Form>
      </Tabs>
    </Card>
  );
};

export default BusRegistrationForm;
