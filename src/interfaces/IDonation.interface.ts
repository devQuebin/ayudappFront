export interface IDonation {
  id: string
  amount: number
  anonymous: boolean
  donorId?: string | null // Optional, in case of anonymous donations
  campaignId: string
  createdAt: Date
}

export interface Donation {
  id: string
  campaignId: string
  userId?: string
  amount: number
  isAnonymous: boolean
  donorName?: string
  message?: string
  paymentMethod: "credit_card" | "debit_card" | "paypal"
  paymentStatus: "pending" | "completed" | "failed"
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateDonationRequest {
  campaignId: string
  amount: number
  isAnonymous: boolean
  donorName?: string
  message?: string
  paymentData: PaymentData
}

// Backend API request interface - matches the validation schema
export interface CreateDonationAPIRequest {
  donorId: string
  campaignId: string
  date: string // ISO date string
  amount: number
}

// Backend donation data structure
export interface BackendDonation {
  id: string
  donorId: string
  campaignId: string
  date: string
  amount: number
  createdAt?: string
  updatedAt?: string
}

export interface PaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardHolderName: string
  paymentMethod: "credit_card" | "debit_card" | "paypal"
}

export interface DonationResponse {
  success: boolean
  data?: {
    id: string
    transactionId: string
    amount: number
    campaignId: string
    donorName?: string
    isAnonymous: boolean
    message?: string
    createdAt: Date
  }
  message: string
  error?: string
}
