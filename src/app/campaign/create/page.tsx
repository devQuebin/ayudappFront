import { redirect } from "next/navigation"
import { getUserFromCookie } from "@/services/auth"
import { Container, Box, Text } from "@chakra-ui/react"
import CampaignForm from "@/components/forms/CampaignForm"

export default async function CreateCampaignPage() {
  const token = await getUserFromCookie()

  if (!token) {
    redirect("/login")
  }

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
