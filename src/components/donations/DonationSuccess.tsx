"use client";
import React from 'react';
import { Box, Text, Button, VStack, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface DonationSuccessProps {
  amount: number;
  campaignName: string;
  transactionId: string;
  isAnonymous?: boolean;
  onClose?: () => void;
}

const DonationSuccess: React.FC<DonationSuccessProps> = ({
  amount,
  campaignName,
  transactionId,
  isAnonymous = false,
  onClose
}) => {
  const router = useRouter();

  const handleViewCampaigns = () => {
    router.push('/campaign');
    if (onClose) onClose();
  };

  const handleViewDonations = () => {
    router.push('/donations');
    if (onClose) onClose();
  };

  return (
    <VStack textAlign="center" p={6}>
      <Text fontSize="5xl">🎉</Text>

      <VStack >
        <Text fontSize="2xl" fontWeight="bold" color="green.600">
          ¡Donación Exitosa!
        </Text>
        <Text fontSize="lg" color="gray.700">
          Gracias por tu generosidad
        </Text>
      </VStack>

      <Box bg="green.50" p={4} borderRadius="lg" w="full">
        <Text fontWeight="bold" mb={2}>
          Resumen de tu donación:
        </Text>
        <VStack align="start">
          <Text>
            <strong>Monto:</strong> ${amount.toLocaleString()}
          </Text>
          <Text>
            <strong>Campaña:</strong> {campaignName}
          </Text>
          <Text>
            <strong>Tipo:</strong> {isAnonymous ? 'Donación Anónima' : 'Donación Pública'}
          </Text>
        </VStack>
      </Box>

      <Box bg="gray.50" p={3} borderRadius="md" w="full">
        <Text fontSize="sm" color="gray.600">
          <strong>ID de Transacción:</strong> {transactionId}
        </Text>
      </Box>

      <Text color="gray.600" fontSize="sm">
        Tu donación ayudará a hacer una diferencia real.
        {isAnonymous && ' Tu identidad se mantendrá privada.'}
      </Text>

      <HStack w="full">
        <Button
          colorScheme="teal"
          onClick={handleViewCampaigns}
          flex={1}
        >
          Ver más campañas
        </Button>
        <Button
          variant="outline"
          onClick={handleViewDonations}
          flex={1}
        >
          Mis donaciones
        </Button>
      </HStack>
    </VStack>
  );
};

export default DonationSuccess;