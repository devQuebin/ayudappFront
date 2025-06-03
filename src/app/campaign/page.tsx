import Card from "@/components/campaign/Card";
import Search from "@/components/campaign/Search";
import Pagination from "@/components/campaign/Pagination";
import { ICampaignResponse } from "@/interfaces/ICampaign.interface";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { getUserFromCookie, getUidFromCookie } from "@/services/auth";
import { getCampaigns } from "@/services/actions";
import { filterCampaigns, paginateCampaigns, getUniqueCategories } from "@/lib/campaign-utils";

export default async function Campaign(
  props
    : {
      searchParams?: Promise<{
        query?: string;
        category?: string;
        page?: string;
        limit?: string;
      }>
    }) {
  // Valores por defecto para los parámetros de búsqueda
  const params = await props.searchParams;
  const query = params?.query || '';
  const category = params?.category || '';
  const currentPage = Number(params?.page) || 1;
  const limit = Number(params?.limit) || 9;  // Obtener datos de campañas y usuario
  const campaignsResponse: ICampaignResponse = await getCampaigns();
  const token = await getUserFromCookie();
  const uid = await getUidFromCookie();
  const isAuthenticated = !!token;

  // Obtener todas las categorías únicas - esto podría moverse a un endpoint separado para mejor rendimiento
  const allCategories = getUniqueCategories(campaignsResponse.data);

  // Filtrar campañas según los parámetros de búsqueda
  const filteredCampaigns = filterCampaigns(campaignsResponse.data, { query, category });

  // Paginar los resultados filtrados
  const paginatedCampaigns = paginateCampaigns(filteredCampaigns, {
    page: currentPage.toString(),
    limit: limit.toString()
  });

  // Total de elementos y páginas para la paginación
  const totalItems = filteredCampaigns.length;

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

      {/* Componente de búsqueda */}
      <Search categories={allCategories} />

      {/* Información de resultados */}
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

      <Flex my={8} wrap={"wrap"} justifyContent="center" gap={4}>
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

      {/* Paginación */}
      <Pagination
        totalItems={totalItems}
        itemsPerPage={limit}
        currentPage={currentPage}
      />
    </Box>
  );
}
