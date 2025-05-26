import { redirect } from "next/navigation"
import { getUserFromCookie } from "@/services/auth"
import { getCampaignById } from "@/services/campaign"
import CampaignForm from "@/components/forms/CampaignForm"
import { Box, Container, Text } from "@chakra-ui/react"

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const token = await getUserFromCookie()
  const { id } = await params

  if (!token) {
    redirect("/login")
  }

  let campaign;
  let error = null;

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

