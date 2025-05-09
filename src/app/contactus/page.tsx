import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
  Container,
} from "@chakra-ui/react";

function contactUs() {
  return (
    <Container maxW="lg" py={10}>
      <Heading mb={6}>Contacto</Heading>

      <Box mb={8}>
        <Text>
          <strong>Empresa:</strong> Mi Empresa S.A.
        </Text>
        <Text>
          <strong>Dirección:</strong> Calle Falsa 123, Ciudad
        </Text>
        <Text>
          <strong>Teléfono:</strong> +54 9 11 1234-5678
        </Text>
        <Text>
          <strong>Email:</strong> contacto@miempresa.com
        </Text>
      </Box>

      <Box as="form" bg="gray.50" p={6} borderRadius="md" boxShadow="md">
        <VStack gap={4}>
          <Input placeholder="Nombre" required />
          <Input type="email" placeholder="Email" required />
          <Textarea placeholder="Mensaje" required />
          <Button colorScheme="blue" type="submit">
            Enviar
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}

export default contactUs;
