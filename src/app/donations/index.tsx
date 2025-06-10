"use client";
import { useEffect, useState } from "react";
import { Box, Text, Spinner } from "@chakra-ui/react";
import { getUidFromCookie } from "@/services/auth";
import DonationHistory from "@/components/donations/DonationHistory";

const DonationsPage = () => {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const uid = await getUidFromCookie();
        setUserId(uid);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="lg" />
        <Text mt={4}>Cargando...</Text>
      </Box>
    );
  }

  if (!userId) {
    return (
      <Box p={8} textAlign="center">
        <Text fontSize="xl" mb={4}>Debes iniciar sesión para ver tus donaciones</Text>
        <Text color="gray.600" mb={6}>
          Accede a tu cuenta para ver el historial completo de tus contribuciones.
        </Text>
        <Box>
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              backgroundColor: '#319795',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Iniciar Sesión
          </button>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={8} maxW="6xl" mx="auto">
      <DonationHistory userId={userId} />
    </Box>
  );
};

export default DonationsPage;