'use client'

import { useEffect, useState } from "react"
import { getCurrentUser } from "@/services/user"
import ProfileForm from "@/components/forms/profileForm"
import { Center, Spinner, Text } from "@chakra-ui/react"

export default function ProfilePage() {
  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser()
        setUid(user.uid)
      } catch (error) {
        console.error("No se pudo obtener el usuario autenticado")
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

  if (!uid) {
    return (
      <Center height="100vh">
        <Text>No se pudo cargar el perfil del usuario.</Text>
      </Center>
    )
  }

  return (
    <main style={{ padding: "2rem" }}>
      <Text fontSize="2xl" mb="4">Mi perfil</Text>
      <ProfileForm uid={uid} />
    </main>
  )
}
