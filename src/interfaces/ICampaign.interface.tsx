export interface ICampaign {
  id: string;
  name: string;
  start_date: string;
  due_date: string;
  updated_at: {
    seconds: number;
    nanoseconds: number;
  };
  amount_target: number;
  owner_id: string;
  description: string;
  end_date: string;
  status: string;
  created_at: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface ICampaignResponse {
  data: Campaign[];
  message: string;
  status: number;
}

// Interfaz para nuestro formulario y API
export interface Campaign {
  id?: string;
  createdAt?: string
  updatedAt?: string;
  startDate: string;
  endDate: string;
  dueDate: string;
  name: string;
  description: string;
  images: string[];
  categories: string[];
  amountTarget: number;
  ownerId: string;
  status: string;
}

export interface CampaignResponse {
  data: Campaign;
  message: string;
  status: number;
}