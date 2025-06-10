"use client"
import { useState } from "react"
import { validatePaymentData, simulatePayment } from "@/services/paymentService"
import {
  PaymentValidation,
  PaymentResponse,
} from "@/interfaces/IPayment.interface"

interface PaymentFormData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardHolderName: string
  amount: number
  paymentMethod: string
}

export const usePayment = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processPayment = async (
    paymentData: PaymentFormData
  ): Promise<PaymentResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      // Validar datos de pago
      const validation = validatePaymentData(paymentData)
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).join(", ")
        setError(errorMessage)
        return null
      }

      // Simular procesamiento de pago
      const result = await simulatePayment(paymentData)
      return result
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al procesar el pago"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const validatePayment = (paymentData: PaymentFormData): PaymentValidation => {
    return validatePaymentData(paymentData)
  }

  return {
    processPayment,
    validatePayment,
    loading,
    error,
  }
}
