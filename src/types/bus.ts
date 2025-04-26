export interface Bus {
  id: number;
  plate: string;
  busId?: string;
  readerSerial?: string;
  company: string;
  brand: string;
  year: number;
  capacity?: number;
  dekraExpirationDate: string | null;
  insuranceExpirationDate: string | null;
  ctpExpirationDate: string | null;
  taxExpirationDate: string | null;
  type: string;
  status: 'active' | 'inactive';
  approved: boolean;
  approvalDate: string | null;
  approvalUser: string | null;
  validationErrors?: string[];
}

export interface BusFilter {
  plate?: string;
  busId?: string;
  readerSerial?: string;
  company?: string;
  brand?: string;
  year?: number;
  capacity?: number;
  dekraExpirationDateRange?: { start: string | null; end: string | null };
  insuranceExpirationDateRange?: { start: string | null; end: string | null };
  ctpExpirationDateRange?: { start: string | null; end: string | null };
  type?: string;
  status?: 'active' | 'inactive' | '';
  approved?: boolean | null;
  expirationMonths?: number | null;
}
