'use client'

import { useEffect, useState } from "react"
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react"
import Link from "next/link"
import HeaderLogo from "../../../public/img/whitelogo.png"

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasDonations, setHasDonations] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const uid = localStorage.getItem("uid")

    setIsLoggedIn(!!token)

    const fetchDonations = async () => {
      if (!uid) return
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donation/donor/${uid}`)
        const data = await response.json()
        if (data?.data?.length > 0) {
          setHasDonations(true)
        }
      } catch (error) {
        console.error("Error al verificar donaciones:", error)
      }
    }

    if (token && uid) {
      fetchDonations()
    }
  }, [])

  return (
    <Flex bg="blue.800" justify="space-between" p={4} color="white">
      <Link href="/">
        <Image src={HeaderLogo.src} alt="Logo" height="40px" />
      </Link>

      <Flex gap={4} align="center">
        {isLoggedIn ? (
          <>
            <Link href="/profile"><Text>Mi perfil</Text></Link>
            <Link href="/campaign"><Text>Campañas</Text></Link>
            {hasDonations && (
              <Link href="/donations"><Text>Historial de Donaciones</Text></Link>
            )}
            <Button onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("uid")
              window.location.href = "/"
            }}>Cerrar sesión</Button>
          </>
        ) : (
          <>
            <Link href="/login"><Text>Iniciar sesión</Text></Link>
            <Link href="/register"><Button>Crear cuenta</Button></Link>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default Header
