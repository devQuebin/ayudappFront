"use client";

import {
  Flex,
  Container,
  Heading,
  Stack,
  Image,
  Text,
  Button,
} from "@chakra-ui/react";
import MainBanner from "../../public/img/MainBanner.jpg";

export default function Home() {
  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        py={{ base: 20, md: 28 }}
        gap={8}
      >
        <Image src={MainBanner.src} alt="main banner" rounded={"lg"} />
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Bienvenidos a{" "}
          <Text as={"span"} color={"blue.400"}>
            AyudApp
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Comparti y enterate sobre las campañas de donaciones de manera rápida
          y sencilla. ¡Logremos que tu causa llegue a todos y que la ayuda
          llegue hasta el último rincón!
        </Text>
        <Stack direction={"row"}>
          <Button
            rounded={"full"}
            px={6}
            bg={"blue.600"}
            _hover={{ bg: "blue.500" }}
          >
            Crear una campaña
          </Button>
          <Button variant="outline" colorPalette="blue" rounded={"full"} px={6}>
            Leer más
          </Button>
        </Stack>
        <Flex w={"full"}></Flex>
      </Stack>
    </Container>
  );
}
