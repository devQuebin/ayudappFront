import { getCampaignById } from "@/services/actions";
import { Campaign, CampaignResponse } from "@/interfaces/ICampaign.interface";
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Stack,
  Flex,
  Button,
} from "@chakra-ui/react";
import CategoryBadge from "@/components/ui/CategoryBadge";
import NextLink from "next/link";
import { BiChevronLeft } from "react-icons/bi";

// Helper function to format dates
const formatDate = (date: string | Date) => {
  if (!date) return "No disponible";
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

// Helper function to get a random campaign image if none is provided
const getRandomCampaignImage = (images?: string[]) => {
  if (images && images.length > 0 && images[0]) {
    return images[0];
  }
  const randomIndex = Math.floor(Math.random() * 5) + 1;
  return `/img/campaigns/${randomIndex}.jpeg`;
};

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let campaign: Campaign | null = null;
  let error = null;
  let campaignImage = '/img/campaigns/1.jpeg';

  try {
    const response: CampaignResponse = await getCampaignById(id);
    campaign = response.data;
    campaignImage = getRandomCampaignImage(campaign.images);
  } catch (err) {
    console.error("Error fetching campaign:", err);
    error = "No se pudo cargar la información de la campaña";
  }

  if (error || !campaign) {
    return (
      <Container maxW="4xl" py={10}>
        <Flex direction="column" justify="center" align="center" minH="50vh">
          <Heading size="lg" mb={4}>Error</Heading>
          <Text mb={6}>{error || "No se encontró la campaña"}</Text>
          <NextLink href="/campaign" passHref>
            <Button colorScheme="blue">Ver todas las campañas</Button>
          </NextLink>
        </Flex>
      </Container>
    );
  }

  return (
    <Container maxW="4xl" py={10}>
      <Box mb={8}>
        <NextLink href="/campaign" passHref>
          <Button variant="ghost" mb={4}>
            <BiChevronLeft size={24} />
            Volver a campañas
          </Button>
        </NextLink>

        <Heading as="h1" size="2xl" mb={6}>
          {campaign.name}
        </Heading>

        <Flex mb={4} align="center">
          <Box
            w="12px"
            h="12px"
            borderRadius="full"
            bg={campaign.status === "active" ? "green.500" : "red.500"}
            mr={3}
          />
          <Text fontSize="md" fontWeight="bold">
            {campaign.status === "active" ? "Campaña activa" : "Campaña inactiva"}
          </Text>

          {/* Categories */}
          {campaign.categories && campaign.categories.length > 0 && (
            <Flex wrap="wrap" gap={2} ml={4}>
              {campaign.categories.map((category, index) => (
                <CategoryBadge key={index} category={category} />
              ))}
            </Flex>
          )}
        </Flex>

      </Box>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={8}
        mb={10}
      >
        <Box
          flex={{ base: "1", md: "1" }}
          minW={{ base: "100%", md: "50%" }}
          maxW={{ base: "100%", md: "50%" }}
        >
          <Image
            src={campaignImage}
            alt={campaign.name}
            objectFit="cover"
            width="100%"
            height={{ base: "300px", md: "400px", lg: "500px" }}
            borderRadius="xl"
            boxShadow="lg"
          />
        </Box>

        <Stack flex="1">
          <Box>
            <Heading as="h3" size="md" mb={2}>
              Detalles de la campaña
            </Heading>
            <Text fontSize="lg" fontWeight="bold" mb={3}>
              Meta: ${campaign.amountTarget}
            </Text>
            <Text mb={4}>
              {campaign.description}
            </Text>
          </Box>

          <Stack>
            <Text><strong>Fecha de inicio:</strong> {formatDate(campaign.startDate)}</Text>
            <Text><strong>Fecha de fin:</strong> {formatDate(campaign.endDate)}</Text>
            <Text><strong>Fecha límite:</strong> {formatDate(campaign.dueDate)}</Text>
            <Text><strong>Creado el:</strong> {formatDate(campaign.createdAt!)}</Text>
          </Stack>

          <Button
            colorScheme="blue"
            size="lg"
            mt={4}
            py={6}
          >
            Donar a esta campaña
          </Button>
        </Stack>
      </Flex>

      <Box mb={8}>
        <Heading as="h3" size="lg" mb={6}>
          Información adicional
        </Heading>
        <Text>
          Para más información sobre cómo funcionan las donaciones o cómo puedes ayudar,
          por favor contacta al organizador de la campaña o visita nuestra sección de
          preguntas frecuentes.
        </Text>
      </Box>

      <Flex justify="center" mt={10}>
        <NextLink href="/campaign" passHref>
          <Button colorScheme="gray" mr={4}>
            Ver todas las campañas
          </Button>
        </NextLink>
        <Button colorScheme="blue">
          Compartir esta campaña
        </Button>
      </Flex>
    </Container>
  );
}
