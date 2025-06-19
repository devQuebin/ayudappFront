'use client'

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/services/user"
import ProfileForm from "@/components/forms/profileForm"
import { Center, Spinner, Text } from "@chakra-ui/react"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getCurrentUser() // solo para verificar si hay usuario
      } catch (error) {
        console.error("No se pudo obtener el usuario autenticado:", error);
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center height="100vh">
        <Text>No se pudo cargar el perfil del usuario.</Text>
      </Center>
    )
  }

  return (
    <main style={{ padding: "2rem" }}>
      <Text fontSize="2xl" mb="4">Mi perfil</Text>
      <ProfileForm />
    </main>
  )
}
