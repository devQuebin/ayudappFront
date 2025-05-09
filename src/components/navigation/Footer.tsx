import { Flex, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import FooterLogo from "../../../public/img/whitelogo.png";

function Footer() {
  return (
    <Flex
      bg="blue.800"
      w="100%"
      h={{ base: "30svh", md: "32vmin" }}
      maxH={{ base: "20vh" }}
      minH="fit-content"
      justify={{ base: "center", md: "space-around" }}
      align="flex-end"
      py={{ base: "1em", md: 8 }}
      px={{ base: 3, sm: 6, lg: 10 }}
      direction={{ base: "column-reverse", md: "row" }}
      gap={{ base: 3 }}
    >
      <Flex
        w={{ base: "100%", md: "50%" }}
        direction="column"
        justify="center"
        align="flex-start"
        mt={{ base: 0, md: 3 }}
        gap={2}
      >
        <Image src={FooterLogo.src} h="8vmin" alt="AyudApp logo" />
        <Text color="white">
          <Link href="/privacy">Politicas de privacidad</Link> |{" "}
          <Link href="/terms">Terminos y condiciones</Link>
        </Text>
      </Flex>
      <Flex
        w={{ base: "100%", md: "40%" }}
        justify={{ base: "flex-start" }}
        gap={5}
        direction={{ base: "row", md: "column" }}
        borderLeftWidth={{ base: 0, md: 3 }}
        borderLeftColor="white"
        pl={{ base: 0, md: 3 }}
        pt={{ base: 2, md: 0 }}
      >
        <Text color="white">Sobre nosotros</Text>
        <Text color="white">
          <Link href="/faqs">FAQ</Link>
        </Text>
        <Text color="white">
          <Link href="/contactus">Contactanos</Link>
        </Text>
      </Flex>
    </Flex>
  );
}

export default Footer;
