export interface DisplayUsage {
  id: string;
  displayId: string;
  date: string;
  usageCount: number;
  feedback?: string;
}

export interface DisplayRequest {
  id: string;
  displayId: string;
  type: 'poster_change' | 'stock_update' | 'issue_report';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  description: string;
  createdAt: string;
  resolvedAt?: string;
  details?: {
    newPosterId?: string;
    stockUpdates?: Array<{
      publicationId: string;
      quantity: number;
    }>;
    issueType?: 'damage' | 'missing' | 'other';
    severity?: 'low' | 'medium' | 'high';
  };
}

export interface DisplayReservation {
  id: string;
  displayId: string;
  borrowerName: string;
  borrowerEmail: string;
  startDate: string;
  endDate: string | null;
  isPermanent: boolean;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Display {
  id: string;
  name: string;
  status: 'available' | 'reserved' | 'maintenance';
  location?: string;
  description?: string;
  imageUrl?: string;
  currentStock: number;
  lastMaintenance: string;
  nextMaintenance: string;
  domainId: string;
  isPermanent?: boolean;
  currentPosterInstance?: PosterInstance;
  publications?: Publication[];
  maintenanceHistory?: MaintenanceIntervention[];
  usageHistory?: DisplayUsage[];
  currentReservation?: DisplayReservation;
  requests?: DisplayRequest[];
}

export interface MaintenanceIntervention {
  id: string;
  displayId: string;
  date: string;
  type: 'preventive' | 'corrective';
  description: string;
  technician: string;
  status: 'completed';
}

export interface PosterInstance {
  id: string;
  posterId: string;
  displayId: string;
  condition: number;
  notes?: string;
  lastUpdate: string;
  domainId: string;
}

export interface Publication {
  id: string;
  title: string;
  imageUrl: string;
  quantity: number;
  minQuantity: number;
  domainId: string;
}