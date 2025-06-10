"use client";
import React, { useState } from 'react';
import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Text,
  Box,
  Textarea
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { CreateDonationRequest } from '@/interfaces/IDonation.interface';
import { validatePaymentData, simulatePayment } from '@/services/paymentService';
import { formatCardNumber, formatExpiryDate } from '@/utils/currency';
import { createDonation } from '@/services/donationService';
import PaymentGatewayIcons from './PaymentGatewayIcons';

interface DonationFormValues {
  amount: string;
  donorName: string;
  message: string;
  cardHolderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface DonationFormProps {
  campaignId: string;
  campaignName: string;
  userId?: string | null;
  onSuccess?: (transactionId: string) => void;
}

export default function DonationForm({
  campaignId,
  campaignName,
  userId,
  onSuccess
}: DonationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<DonationFormValues>();

  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const watchedAmount = watch('amount', '');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setValue('cardNumber', formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    if (formatted.length <= 5) {
      setValue('expiryDate', formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setValue('cvv', value);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setValue('amount', value);
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!userId) {
      setErrorMessage('Debes iniciar sesión para realizar una donación');
      return;
    }

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Validate payment data
      const validation = validatePaymentData({
        ...data,
        amount: parseInt(data.amount)
      });

      if (!validation.isValid) {
        setErrorMessage(Object.values(validation.errors).join(', '));
        setLoading(false);
        return;
      }

      // Simulate payment
      const paymentResult = await simulatePayment({
        ...data,
        amount: parseInt(data.amount)
      });

      if (!paymentResult.success) {
        setErrorMessage(paymentResult.error || 'Error al procesar el pago');
        setLoading(false);
        return;
      }

      // Create donation
      const donationData: CreateDonationRequest = {
        campaignId,
        amount: parseInt(data.amount),
        isAnonymous,
        donorName: isAnonymous ? undefined : data.donorName,
        message: data.message,
        paymentData: {
          cardNumber: data.cardNumber,
          expiryDate: data.expiryDate,
          cvv: data.cvv,
          cardHolderName: data.cardHolderName,
          paymentMethod: 'credit_card'
        }
      };

      const result = await createDonation(donationData);

      if (result.success) {
        setSuccessMessage(`¡Gracias por tu donación de $${data.amount} a ${campaignName}!`);
        if (onSuccess && paymentResult.transactionId) {
          onSuccess(paymentResult.transactionId);
        }
      } else {
        setErrorMessage('Error al procesar la donación');
      }
    } catch {
      setErrorMessage('Error al procesar la donación. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Fieldset.Root size="lg" maxW="lg" mx="auto" mt={8}>
        <Stack pt={6}>
          <Fieldset.Legend>Realizar Donación</Fieldset.Legend>
          <Text color="gray.600">Donando a: {campaignName}</Text>
        </Stack>

        <Fieldset.Content>
          <Box bg="blue.50" p={3} borderRadius="md" mb={4}>
            <Text fontSize="sm" color="blue.700">
              ℹ️ Si deseas que tu donación sea anónima, marca la casilla correspondiente y nadie podrá ver tus datos.
            </Text>
          </Box>

          <Field.Root required invalid={!!errors.amount}>
            <Field.Label>Monto a donar ($) <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("amount", {
                required: "El monto es requerido",
                validate: (value) => parseInt(value) > 0 || "El monto debe ser mayor a 0"
              })}
              placeholder="1000"
              onChange={handleAmountChange}
            />
            <Field.ErrorText>{errors.amount?.message}</Field.ErrorText>
          </Field.Root>

          <Box>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <Text>Hacer donación anónima</Text>
            </label>
          </Box>

          {!isAnonymous && (
            <Field.Root>
              <Field.Label>Tu nombre (opcional)</Field.Label>
              <Input
                {...register("donorName")}
                placeholder="Tu nombre"
              />
            </Field.Root>
          )}

          <Field.Root>
            <Field.Label>Mensaje (opcional)</Field.Label>
            <Textarea
              {...register("message")}
              placeholder="Escribe un mensaje de apoyo..."
              resize="none"
              rows={3}
            />
          </Field.Root>

          <Box borderTop="1px solid" borderColor="gray.200" pt={4} mt={4}>
            <Text fontWeight="bold" mb={3}>Datos de pago</Text>

            <Field.Root required invalid={!!errors.cardHolderName}>
              <Field.Label>Titular de la tarjeta <Field.RequiredIndicator /></Field.Label>
              <Input
                {...register("cardHolderName", {
                  required: "El nombre del titular es requerido",
                  minLength: { value: 2, message: "Ingrese un nombre válido" }
                })}
                placeholder="Nombre como aparece en la tarjeta"
              />
              <Field.ErrorText>{errors.cardHolderName?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root required invalid={!!errors.cardNumber}>
              <Field.Label>Número de tarjeta <Field.RequiredIndicator /></Field.Label>
              <Input
                {...register("cardNumber", {
                  required: "El número de tarjeta es requerido",
                  validate: (value) => {
                    const cleanNumber = value.replace(/\s/g, '');
                    return cleanNumber.length === 16 || "El número de tarjeta debe tener 16 dígitos";
                  }
                })}
                placeholder="1234 5678 9012 3456"
                onChange={handleCardNumberChange}
              />
              <Field.ErrorText>{errors.cardNumber?.message}</Field.ErrorText>
            </Field.Root>

            <Stack direction="row" gap={4}>
              <Field.Root required invalid={!!errors.expiryDate} flex={1}>
                <Field.Label>Vencimiento <Field.RequiredIndicator /></Field.Label>
                <Input
                  {...register("expiryDate", {
                    required: "La fecha de vencimiento es requerida",
                    pattern: {
                      value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                      message: "Formato válido: MM/YY"
                    }
                  })}
                  placeholder="MM/YY"
                  onChange={handleExpiryDateChange}
                />
                <Field.ErrorText>{errors.expiryDate?.message}</Field.ErrorText>
              </Field.Root>

              <Field.Root required invalid={!!errors.cvv} flex={1}>
                <Field.Label>CVV <Field.RequiredIndicator /></Field.Label>
                <Input
                  {...register("cvv", {
                    required: "El CVV es requerido",
                    validate: (value) => {
                      return (value.length >= 3 && value.length <= 4) || "El CVV debe tener 3 o 4 dígitos";
                    }
                  })}
                  placeholder="123"
                  onChange={handleCvvChange}
                />
                <Field.ErrorText>{errors.cvv?.message}</Field.ErrorText>
              </Field.Root>
            </Stack>

            <PaymentGatewayIcons />
          </Box>
        </Fieldset.Content>

        <Button
          type="submit"
          colorScheme="teal"
          size="lg"
          w="full"
          mt={6}
          disabled={loading}
        >
          {loading ? 'Procesando...' : `Donar $${watchedAmount || '0'}`}
        </Button>

        {successMessage && (
          <Text color="green.500" mt={4} textAlign="center">
            {successMessage}
          </Text>
        )}
        {errorMessage && (
          <Text color="red.500" mt={4} textAlign="center">
            {errorMessage}
          </Text>
        )}
      </Fieldset.Root>
    </form>
  );
}
