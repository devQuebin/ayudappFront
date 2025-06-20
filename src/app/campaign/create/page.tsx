'use client'

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Container, Box, Text } from "@chakra-ui/react"
import CampaignForm from "@/components/forms/CampaignForm"

export default function CreateCampaignPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  return (
    <Container maxW="container.lg" py={10}>
      <Box mb={8}>
        <Text fontSize="2xl" fontWeight="bold">Crear nueva campaña</Text>
        <Text color="gray.600">Completa el formulario para crear una nueva campaña</Text>
      </Box>
      <CampaignForm />
    </Container>
  )
}
