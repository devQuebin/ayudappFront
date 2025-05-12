"use client";

import { Button, Flex, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import HeaderLogo from "../../../public/img/blacklogo.png";
import { deleteUserFromCookie, getUserFromCookie } from "@/services/auth";
import { useEffect } from "react";
import { redirect } from "next/navigation";

function Header() {
  const [isLogedin, setIsLogedin] = useState<boolean>(false);

  const logout = async () => {
    await deleteUserFromCookie();
    setIsLogedin(false);
    redirect("/");
  }

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getUserFromCookie();

      if (token) {
        setIsLogedin(true);
      } else {
        setIsLogedin(false);
      }
    };

    fetchToken();
  }, []);

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
        <Link href="/campaign">
          <Text>Mis campañas</Text>
        </Link>

        {isLogedin ? (
          <Button bg="blue.600" onClick={logout}>
            Cerrar sesion
          </Button>
        ) : (
          <>
            <Link href="/login">
              <Text>Iniciar sesion</Text>
            </Link>

            <Link href="/register">
              <Button bg="blue.600">Crear cuenta</Button>
            </Link>
          </>
        )}
      </Flex>
    </Flex>
  );
}
export default Header;
