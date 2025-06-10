export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const parseCurrency = (value: string): number => {
  const parsedValue = parseFloat(value.replace(/[^0-9.-]+/g, ""))
  return isNaN(parsedValue) ? 0 : parsedValue
}

export const formatCardNumber = (value: string): string => {
  // Remover todos los caracteres no numéricos
  const numericValue = value.replace(/\D/g, "")
  // Agregar espacios cada 4 dígitos
  return numericValue.replace(/(\d{4})(?=\d)/g, "$1 ")
}

export const formatExpiryDate = (value: string): string => {
  // Remover todos los caracteres no numéricos
  const numericValue = value.replace(/\D/g, "")
  // Agregar slash después de los primeros 2 dígitos
  if (numericValue.length >= 2) {
    return `${numericValue.slice(0, 2)}/${numericValue.slice(2, 4)}`
  }
  return numericValue
}
