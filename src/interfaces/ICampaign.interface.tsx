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
  data: ICampaign[];
  message: string;
  status: number;
}