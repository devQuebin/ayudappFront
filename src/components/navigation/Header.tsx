"use client";

import { Button, Flex, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import HeaderLogo from "../../../public/img/ayudapplogoHeader.png";

function Header() {
  const [isLogedin, setIsLogedin] = useState<boolean>(false);

  function login() {
    if (isLogedin) {
      setIsLogedin(false);
      console.log(isLogedin);
    } else setIsLogedin(true);
    console.log(isLogedin);
  }
  return (
    <Flex
      h="9vh"
      w="100%"
      justify="space-between"
      align="center"
      position="fixed"
      px={{ base: 2, sm: 10, md: 20 }}
      backdropFilter="blur(10px)"
      zIndex={1000}
      border={1}
    >
      <Link href="/">
        <Image src={HeaderLogo.src} h="8vmin" alt="AyudApp logo" />
      </Link>

      <Flex gap={5} justify="flex-end" align="center">
        <Link href="/miscampanas">
          <Text>Mis campañas</Text>
        </Link>

        {isLogedin ? (
          <Button bg="blue.600" onClick={login}>
            Cerrar sesion
          </Button>
        ) : (
          <>
            <Link href="/login">
              <Text>Iniciar sesion</Text>
            </Link>

            <Button bg="blue.600" onClick={login}>
              Crear cuenta
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
}
export default Header;
