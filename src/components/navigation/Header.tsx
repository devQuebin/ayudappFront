"use client";

import { Button, Flex, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HeaderLogo from "../../../public/img/whitelogo.png";
import { redirect } from "next/navigation";

function Header() {
  const [isLogedin, setIsLogedin] = useState<boolean>(false);
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    setIsLogedin(false);
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogedin(!!token);
  }, []);

  return (
    <Flex
      h="9vh"
      w="100%"
      justify="space-between"
      align="center"
      position="fixed"
      px={{ base: 2, sm: 10, md: 20 }}
      zIndex={1000}
      border={1}
      bg="blue.800"
    >
      <Link href="/">
        <Image src={HeaderLogo.src} h="8vmin" alt="AyudApp logo" />
      </Link>

      <Flex gap={5} justify="flex-end" align="center">
        {isLogedin ? (
          <>
            <Link href="/profile">
              <Text>Mi perfil</Text>
            </Link>

            <Link href="/campaign">
              <Text>Mis campañas</Text>
            </Link>

            <Button bg="blue.600" onClick={logout}>
              Cerrar sesión
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Text>Iniciar sesión</Text>
            </Link>

            <Link href="/register">
              <Button>Crear cuenta</Button>
            </Link>
          </>
        )}
      </Flex>
    </Flex>
  );
}

export default Header;
