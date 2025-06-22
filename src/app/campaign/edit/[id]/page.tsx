import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { getCampaignById } from "@/services/actions"
import CampaignForm from "@/components/forms/CampaignForm"
import { Box, Container, Text } from "@chakra-ui/react"

export default async function EditCampaignPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  const { id } = params

  let campaign
  let error = null

  try {
    campaign = await getCampaignById(id)
  } catch (err) {
    console.error("Error fetching campaign:", err)
    error = "No se pudo cargar la campaña. Por favor, intenta más tarde."
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={10}>
        <Text borderRadius="md">
          {error}
        </Text>
      </Container>
    )
  }

  return (
    <Container maxW="container.lg" py={10}>
      <Box mb={8}>
        <Text fontSize="2xl" fontWeight="bold">Editar campaña</Text>
        <Text color="gray.600">Actualiza la información de la campaña</Text>
      </Box>
      {campaign && (
        <CampaignForm
          isEditing={true}
          initialData={campaign.data}
          campaignId={id}
        />
      )}
    </Container>
  )
}
