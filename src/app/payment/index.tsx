"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Text, Spinner, VStack } from "@chakra-ui/react";
import PaymentModal from "@/components/donations/PaymentModal";

const PaymentPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const campaignId = searchParams.get('campaignId');
  const campaignName = searchParams.get('campaignName');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const uid = localStorage.getItem("uid")
        if (!uid) {
          router.push("/login?message=Debes iniciar sesión para realizar una donación");
          return;
        }
        setUserId(uid);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.push("/login?message=Error de autenticación");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <Box p={8} textAlign="center">
        <Spinner size="lg" />
        <Text mt={4}>Cargando...</Text>
      </Box>
    );
  }

  if (!campaignId || !campaignName) {
    return (
      <Box p={8} maxW="md" mx="auto">
        <Box
          p={4}
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="md"
          mb={4}
        >
          <Text color="red.800" fontWeight="medium">
            ⚠️ Información de campaña faltante. Por favor, selecciona una campaña válida.
          </Text>
        </Box>
        <Button mt={4} onClick={() => router.push('/campaign')} colorScheme="blue">
          Ver Campañas
        </Button>
      </Box>
    );
  }

  return (
    <Box p={8} maxW="4xl" mx="auto">
      <VStack gap={6}>
        <Text fontSize="3xl" fontWeight="bold" textAlign="center">
          Realizar Donación
        </Text>

        <Box
          p={4}
          bg="blue.50"
          border="1px solid"
          borderColor="blue.200"
          borderRadius="md"
          maxW="md"
        >
          <Text color="blue.800" fontWeight="medium">
            ℹ️ Estás a punto de realizar una donación a &quot;{campaignName}&quot;.
            Si deseas mantener tu identidad privada, puedes hacerlo de forma anónima.
          </Text>
        </Box>

        <PaymentModal
          isOpen={true}
          onClose={() => router.push('/campaign')}
          campaignId={campaignId}
          campaignName={campaignName}
          userId={userId}
        />
      </VStack>
    </Box>
  );
};

export default PaymentPage;