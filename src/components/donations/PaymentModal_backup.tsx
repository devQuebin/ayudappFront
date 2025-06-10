"use client";
import React, { useState } from 'react';
import {
  Dialog,
  Button,
  Input,
  Text,
  Stack,
  HStack,
  Textarea,
  Box,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { validatePaymentData, simulatePayment } from '@/services/paymentService';
import { createDonation } from '@/services/donationService';
import { formatCardNumber, formatExpiryDate } from '@/utils/currency';
import PaymentGatewayIcons from './PaymentGatewayIcons';
import { CreateDonationRequest } from '@/interfaces/IDonation.interface';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignName: string;
  userId?: string | null;
}

export default function PaymentModal({ isOpen, onClose, campaignId, campaignName, userId }: PaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    isAnonymous: false,
    donorName: '',
    message: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    paymentMethod: 'credit_card' as const
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      if (formattedValue.replace(/\s/g, '').length > 16) return;
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
      if (formattedValue.length > 5) return;
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    } else if (field === 'amount') {
      formattedValue = value.replace(/[^\d]/g, '');
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      setErrors({ general: 'Debes iniciar sesión para realizar una donación' });
      return;
    }

    const validation = validatePaymentData({
      ...formData,
      amount: parseInt(formData.amount)
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsProcessing(true);
    setErrors({});

    try {
      // Simular procesamiento de pago
      const paymentResult = await simulatePayment({
        ...formData,
        amount: parseInt(formData.amount)
      });

      if (!paymentResult.success) {
        setErrors({ general: paymentResult.error || 'Error al procesar el pago' });
        setIsProcessing(false);
        return;
      }

      // Crear donación
      const donationData: CreateDonationRequest = {
        campaignId,
        amount: parseInt(formData.amount),
        isAnonymous: formData.isAnonymous,
        donorName: formData.isAnonymous ? undefined : formData.donorName,
        message: formData.message,
        paymentData: {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardHolderName: formData.cardHolderName,
          paymentMethod: formData.paymentMethod
        }
      };

      await createDonation(donationData);

      setTransactionId(paymentResult.transactionId);
      setShowSuccess(true);
    } catch (error) {
      setErrors({ general: 'Error al procesar la donación. Intenta nuevamente.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      isAnonymous: false,
      donorName: '',
      message: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolderName: '',
      paymentMethod: 'credit_card'
    });
    setErrors({});
    setShowSuccess(false);
    setTransactionId('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (showSuccess) {
    return (
      <Dialog.Root open={isOpen} onOpenChange={handleClose}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="md">
            <Dialog.Header>
              <Dialog.Title>¡Donación Exitosa!</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Stack align="center">
                <Text fontSize="4xl">✅</Text>
                <Text textAlign="center" fontSize="lg" fontWeight="bold">
                  ¡Gracias por tu donación!
                </Text>
                <Text textAlign="center" color="gray.600">
                  Tu donación de ${formData.amount} a &quot;{campaignName}&quot; ha sido procesada exitosamente.
                </Text>
                <Box bg="gray.50" p={3} borderRadius="md" w="full">
                  <Text fontSize="sm" color="gray.600">
                    ID de Transacción: {transactionId}
                  </Text>
                </Box>
              </Stack>
            </Dialog.Body>
            <Dialog.Footer>
              <Button onClick={handleClose} colorScheme="teal" w="full">
                Cerrar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="lg">
          <Dialog.Header>
            <Dialog.Title>Realizar Donación</Dialog.Title>
            <Dialog.CloseTrigger />
          </Dialog.Header>
          <Dialog.Body>
            <Stack gap={4} align="stretch">
              <Box bg="blue.50" p={3} borderRadius="md">
                <Text fontSize="sm" color="blue.700">
                  ℹ️ Si deseas que tu donación sea anónima, marca la casilla correspondiente y nadie podrá ver tus datos.
                </Text>
              </Box>

              {errors.general && (
                <Box bg="red.50" p={3} borderRadius="md">
                  <Text color="red.600" fontSize="sm">{errors.general}</Text>
                </Box>
              )}              <Text fontWeight="bold">Donando a: {campaignName}</Text>

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Monto a donar ($)</Text>
                <Input
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="1000"
                  type="text"
                />
                {errors.amount && (
                  <Text color="red.500" fontSize="sm" mt={1}>{errors.amount}</Text>
                )}
              </Box>

              <Box>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))
                    }
                  />
                  <Text>Hacer donación anónima</Text>
                </label>
              </Box>

              {!formData.isAnonymous && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Tu nombre (opcional)</Text>
                  <Input
                    value={formData.donorName}
                    onChange={(e) => handleInputChange('donorName', e.target.value)}
                    placeholder="Tu nombre"
                  />
                  {errors.donorName && (
                    <Text color="red.500" fontSize="sm" mt={1}>{errors.donorName}</Text>
                  )}
                </Box>
              )}

              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Mensaje (opcional)</Text>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Escribe un mensaje de apoyo..."
                  resize="none"
                  rows={3}
                />
              </Box>

              <Box borderTop="1px solid" borderColor="gray.200" pt={4}>
                <Text fontWeight="bold" mb={3}>Datos de pago</Text>

                <Stack gap={3}>
                  <Box w="full">
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Titular de la tarjeta</Text>
                    <Input
                      value={formData.cardHolderName}
                      onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                      placeholder="Nombre como aparece en la tarjeta"
                    />
                    {errors.cardHolderName && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.cardHolderName}</Text>
                    )}
                  </Box>

                  <Box w="full">
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Número de tarjeta</Text>
                    <Input
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && (
                      <Text color="red.500" fontSize="sm" mt={1}>{errors.cardNumber}</Text>
                    )}
                  </Box>

                  <HStack gap={3} w="full">
                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Vencimiento</Text>
                      <Input
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && (
                        <Text color="red.500" fontSize="sm" mt={1}>{errors.expiryDate}</Text>
                      )}
                    </Box>

                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>CVV</Text>
                      <Input
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                      />
                      {errors.cvv && (
                        <Text color="red.500" fontSize="sm" mt={1}>{errors.cvv}</Text>
                      )}
                    </Box>
                  </HStack>
                </Stack>

                <PaymentGatewayIcons />
              </Box>
            </Stack>
          </Dialog.Body>
          <Dialog.Footer>
            <HStack w="full">
              <Button onClick={handleClose} variant="outline" flex={1}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                colorScheme="teal"
                flex={1}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Flex align="center" gap={2}>
                    <Spinner size="sm" />
                    Procesando...
                  </Flex>
                ) : (
                  `Donar $${formData.amount || '0'}`
                )}
              </Button>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}