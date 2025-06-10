"use client";
import React, { useEffect, useState } from 'react';
import { Box, Text, Stack, Spinner, Badge, HStack } from '@chakra-ui/react';
import { getDonationsByUser } from '@/services/donationService';
import { formatCurrency } from '@/utils/currency';

interface Donation {
  id: string;
  amount: number;
  campaignName?: string;
  message?: string;
  createdAt: string;
  isAnonymous: boolean;
  paymentStatus: 'completed' | 'pending';
  transactionId?: string;
}

interface DonationHistoryProps {
  userId: string;
}

const DonationHistory: React.FC<DonationHistoryProps> = ({ userId }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const userDonations = await getDonationsByUser(userId);
        setDonations(userDonations.data);
      } catch (err) {
        setError('Error al cargar el historial de donaciones');
        console.error('Error loading donations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadDonations();
    }
  }, [userId]);

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="lg" />
        <Text mt={4}>Cargando historial...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        Historial de Donaciones
      </Text>

      {donations.length === 0 ? (
        <Box textAlign="center" py={8} bg="gray.50" borderRadius="md">
          <Text color="gray.600" fontSize="lg">
            No tienes donaciones registradas
          </Text>
          <Text color="gray.500" fontSize="sm" mt={2}>
            ¡Comienza a apoyar las causas que te importan!
          </Text>
        </Box>
      ) : (
        <Stack gap={4} align="stretch">
          {donations.map((donation: Donation) => (
            <Box
              key={donation.id}
              p={6}
              borderWidth={1}
              borderRadius="lg"
              bg="white"
              shadow="sm"
              _hover={{ shadow: "md" }}
            >
              <HStack justify="space-between" align="start">
                <Box flex={1}>
                  <Text fontWeight="bold" fontSize="lg" mb={2}>
                    {formatCurrency(donation.amount)}
                  </Text>
                  <Text color="gray.700" mb={1}>
                    Campaña: {donation.campaignName || 'Campaña no disponible'}
                  </Text>
                  {donation.message && (
                    <Text color="gray.600" fontSize="sm" mb={2}>
                      Mensaje: &quot;{donation.message}&quot;
                    </Text>
                  )}
                  <Text fontSize="sm" color="gray.500">
                    {new Date(donation.createdAt).toLocaleDateString('es-AR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Box>
                <Stack align="end">
                  <Badge
                    colorScheme={donation.isAnonymous ? "purple" : "blue"}
                    variant="subtle"
                  >
                    {donation.isAnonymous ? "Anónima" : "Pública"}
                  </Badge>
                  <Badge
                    colorScheme={donation.paymentStatus === 'completed' ? "green" : "yellow"}
                    variant="solid"
                  >
                    {donation.paymentStatus === 'completed' ? "Completada" : "Pendiente"}
                  </Badge>
                </Stack>
              </HStack>

              {donation.transactionId && (
                <Box mt={3} p={2} bg="gray.50" borderRadius="md">
                  <Text fontSize="xs" color="gray.600">
                    ID de Transacción: {donation.transactionId}
                  </Text>
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default DonationHistory;