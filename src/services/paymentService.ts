import {
  PaymentValidation,
  PaymentResponse,
  CardInfo,
} from "@/interfaces/IPayment.interface"

interface PaymentFormData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardHolderName: string
  amount: number
}

export const validatePaymentData = (
  paymentData: PaymentFormData
): PaymentValidation => {
  const errors: PaymentValidation["errors"] = {}

  // Validar número de tarjeta (16 dígitos)
  if (
    !paymentData.cardNumber ||
    !/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ""))
  ) {
    errors.cardNumber = "El número de tarjeta debe tener 16 dígitos"
  }

  // Validar fecha de expiración (MM/YY)
  if (
    !paymentData.expiryDate ||
    !/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentData.expiryDate)
  ) {
    errors.expiryDate = "La fecha debe tener formato MM/YY"
  } else {
    const [month, year] = paymentData.expiryDate.split("/")
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1

    if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      errors.expiryDate = "La tarjeta está vencida"
    }
  }

  // Validar CVV (3 o 4 dígitos)
  if (!paymentData.cvv || !/^\d{3,4}$/.test(paymentData.cvv)) {
    errors.cvv = "El CVV debe tener 3 o 4 dígitos"
  }

  // Validar nombre del titular
  if (
    !paymentData.cardHolderName ||
    paymentData.cardHolderName.trim().length < 2
  ) {
    errors.cardHolderName = "Ingrese un nombre válido"
  }

  // Validar monto
  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.amount = "El monto debe ser mayor a 0"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const simulatePayment = async (
  paymentData: PaymentFormData
): Promise<PaymentResponse> => {
  console.log("💳 Processing payment:", paymentData)

  // Simular delay de procesamiento
  await new Promise((resolve) =>
    setTimeout(resolve, 2000 + Math.random() * 2000)
  )

  // Simular 95% de éxito
  const success = Math.random() > 0.05

  const result: PaymentResponse = {
    success,
    transactionId: success
      ? `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : "",
    message: success
      ? "Pago procesado exitosamente"
      : "Error al procesar el pago",
    error: success ? undefined : "Transacción rechazada por el banco",
  }

  console.log("💳 Payment result:", result)
  return result
}

export const validateCreditCard = (cardNumber: string): CardInfo => {
  const cleanNumber = cardNumber.replace(/\s/g, "")

  // Algoritmo de Luhn para validar número de tarjeta
  let sum = 0
  let alternate = false

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cleanNumber.charAt(i), 10)

    if (alternate) {
      n *= 2
      if (n > 9) {
        n = (n % 10) + 1
      }
    }

    sum += n
    alternate = !alternate
  }

  const isValid = sum % 10 === 0

  // Detectar tipo de tarjeta
  let type: "visa" | "mastercard" | "amex" | "unknown" = "unknown"
  if (/^4/.test(cleanNumber)) {
    type = "visa"
  } else if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    type = "mastercard"
  } else if (/^3[47]/.test(cleanNumber)) {
    type = "amex"
  }

  return { isValid, type }
}
