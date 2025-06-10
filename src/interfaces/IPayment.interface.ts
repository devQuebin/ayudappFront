export interface IPayment {
  amount: number
  currency: string
  paymentMethod: "credit_card" | "paypal" | "stripe"
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  transactionId?: string
  donationId?: string
  anonymous: boolean
  createdAt: Date
}

export interface PaymentValidation {
  isValid: boolean
  errors: {
    cardNumber?: string
    expiryDate?: string
    cvv?: string
    cardHolderName?: string
    amount?: string
  }
}

export interface PaymentResponse {
  success: boolean
  transactionId: string
  message: string
  error?: string
}

export interface CardInfo {
  type: "visa" | "mastercard" | "amex" | "unknown"
  isValid: boolean
}
