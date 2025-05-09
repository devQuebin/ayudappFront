import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
  Flex,
  Image,
} from "@chakra-ui/react";
import Link from "next/link";
import ContactUs from "../../../public/img/contactus.jpg";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function contactUs() {
  return (
    <Flex
      display="flex"
      minH="60vh"
      mt={10}
      justify="center"
      align="center"
      py={10}
    >
      <Flex direction="row" gap={10}>
        <Flex
          borderRadius="md"
          bg="blue.600"
          minW="100px"
          direction="column"
          p={10}
        >
          <Box mb={8}>
            <Text fontSize={50} color="white" mb={2}>
              ¡Contactanos!
            </Text>
            <Text mb={6} color="white">
              ¿Tenés dudas? no dudes en contactarnos con los siguientes medios.
            </Text>
            <Text color="white">
              <strong>Dirección:</strong> Calle Falsa 123, Ciudad
            </Text>
            <Text color="white">
              <strong>Teléfono:</strong> +54 9 11 1234-5678
            </Text>
            <Text color="white">
              <strong>Email:</strong> contacto@ayudapp.com
            </Text>
          </Box>
          <Flex
            fontSize={30}
            mb={6}
            direction="row"
            justify="center"
            align="center"
            gap={4}
            color="white"
          >
            <Link href="www.instagram.com">
              <FaInstagram />
            </Link>
            <Link href="www.facebook.com/">
              <FaFacebook />
            </Link>
            <Link href="www.linkedin.com/">
              <FaLinkedin />
            </Link>
            <Link href="www.x.com/">
              <FaXTwitter />
            </Link>
          </Flex>
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
        </Flex>
        <Flex bg="blue.500">
          <Image src={ContactUs.src} alt="contactus" />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default contactUs;
