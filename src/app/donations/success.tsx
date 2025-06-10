"use client";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');
  const campaignName = searchParams.get('campaignName');

  const handleReturn = () => {
    router.push("/campaign");
  };

  return (
    <Box p={8} maxW="md" mx="auto" textAlign="center">
      <VStack gap={6}>
        <Text fontSize="4xl">🎉</Text>
        <Text fontSize="2xl" fontWeight="bold" color="green.600">
          ¡Donación Exitosa!
        </Text>

        {amount && (
          <Text fontSize="lg">
            Has donado ${amount} {campaignName && `a "${campaignName}"`}
          </Text>
        )}

        {transactionId && (
          <Box bg="gray.50" p={4} borderRadius="md" w="full">
            <Text fontSize="sm" color="gray.600">
              ID de Transacción: {transactionId}
            </Text>
          </Box>
        )}

        <Text color="gray.600" textAlign="center">
          Gracias por tu generosidad. Tu donación ayudará a hacer la diferencia.
        </Text>

        <Text fontSize="md" color="gray.600" textAlign="center">
          Si elegiste donar de forma anónima, tu información no será compartida.
        </Text>

        <VStack gap={3} w="full">
          <Button colorScheme="teal" size="lg" onClick={handleReturn} w="full">
            Explorar más campañas
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/donations")}
            w="full"
          >
            Ver mis donaciones
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default SuccessPage;