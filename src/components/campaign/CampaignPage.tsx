'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Card from "@/components/campaign/Card"
import Search from "@/components/campaign/Search"
import Pagination from "@/components/campaign/Pagination"
import { ICampaignResponse } from "@/interfaces/ICampaign.interface"
import { Box, Button, Flex, Heading, Text, Spinner, Center } from "@chakra-ui/react"
import Link from "next/link"
import { getCampaigns } from "@/services/actions"
import { filterCampaigns, paginateCampaigns, getUniqueCategories } from "@/lib/campaign-utils"

export default function CampaignPage() {
  const searchParams = useSearchParams()

  const [campaigns, setCampaigns] = useState<ICampaignResponse["data"]>([])
  const [loading, setLoading] = useState(true)
  const [uid, setUid] = useState<string | null>(null)

  const query = searchParams.get("query") || ""
  const category = searchParams.get("category") || ""
  const currentPage = Number(searchParams.get("page") || 1)
  const limit = Number(searchParams.get("limit") || 9)
  const isAuthenticated = !!uid

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCampaigns()
        setCampaigns(response.data)
        setUid(localStorage.getItem("uid"))
      } catch (error) {
        console.error("Error al obtener campañas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Center height="80vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  const allCategories = getUniqueCategories(campaigns)
  const filteredCampaigns = filterCampaigns(campaigns, { query, category })
  const paginatedCampaigns = paginateCampaigns(filteredCampaigns, {
    page: currentPage.toString(),
    limit: limit.toString(),
  })
  const totalItems = filteredCampaigns.length

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">Campañas</Heading>
        {isAuthenticated && (
          <Link href="/campaign/create" passHref>
            <Button colorScheme="blue">
              Crear Campaña
            </Button>
          </Link>
        )}
      </Flex>

      <Search categories={allCategories} />

      <Flex justifyContent="space-between" mb={4}>
        <Text color="gray.600">
          {totalItems === 0
            ? 'No se encontraron campañas'
            : `Mostrando ${paginatedCampaigns.length} de ${totalItems} campañas`}
        </Text>
        {(query || category) && (
          <Text>
            {query && `Búsqueda: "${query}"`}
            {query && category && ' | '}
            {category && `Categoría: "${category}"`}
          </Text>
        )}
      </Flex>

      <Flex my={8} wrap="wrap" justifyContent="center" gap={4}>
        {paginatedCampaigns.length === 0 ? (
          <Box py={10}>
            <Text fontSize="lg">No hay campañas disponibles que coincidan con tu búsqueda</Text>
          </Box>
        ) : (
          paginatedCampaigns.map((campaign) => (
            <Card
              key={campaign.id}
              id={campaign.id}
              amountTarget={campaign.amountTarget}
              createdAt={campaign.createdAt}
              description={campaign.description}
              dueDate={campaign.dueDate}
              endDate={campaign.endDate}
              name={campaign.name}
              ownerId={campaign.ownerId}
              startDate={campaign.startDate}
              status={campaign.status}
              currentUserId={uid}
              images={campaign.images}
              categories={campaign.categories || []}
            />
          ))
        )}
      </Flex>

      <Pagination
        totalItems={totalItems}
        itemsPerPage={limit}
        currentPage={currentPage}
      />
    </Box>
  )
}
