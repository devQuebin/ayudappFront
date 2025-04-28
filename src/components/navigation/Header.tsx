import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <Flex
      h="9vh"
      w="100%"
      justify="space-between"
      align="center"
      position="fixed"
      px={{ base: 2, sm: 10, md: 20 }}
      backdropFilter="blur(10px)"
      bg="gray.300"
      zIndex={1000}
    >
      <Link href="/">LOGO</Link>

      <Flex gap={5} justify="flex-end" align="center">
        <Link href="/faqs">
          <Text>FAQ</Text>
        </Link>
        <Link href="/contactus">
          <Text>Contacto</Text>
        </Link>
      </Flex>
    </Flex>
  );
}
export default Header;
