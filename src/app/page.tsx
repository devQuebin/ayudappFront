"use client";

import {
  Flex,
  Container,
  Heading,
  Stack,
  Image,
  Text,
  Button,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import MainBanner from "../../public/img/MainBanner.jpg";
import { getCampaigns } from "@/services/campaign";
import FeaturedCampaign from "@/components/campaign/FeaturedCampaign";
import { useEffect, useState } from "react";
import { Campaign } from "@/interfaces/ICampaign.interface";
import NextLink from "next/link";

export default function Home() {
  const [featuredCampaigns, setFeaturedCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        const response = await getCampaigns();
        // Filtrar solo campañas activas y limitar a 3
        const activeCampaigns = response.data
          .filter(campaign => campaign.status === "active")
          .slice(0, 3);
        setFeaturedCampaigns(activeCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <Container maxW={"5xl"}>
      {/* Hero Section */}
      <Stack
        textAlign={"center"}
        align={"center"}
        py={{ base: 20, md: 28 }}
        gap={8}
      >
        <Image src={MainBanner.src} alt="main banner" rounded={"lg"} />
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Bienvenidos a{" "}
          <Text as={"span"} color={"blue.400"}>
            AyudApp
          </Text>
        </Heading>
        <Text color={"gray.500"} maxW={"3xl"}>
          Comparti y enterate sobre las campañas de donaciones de manera rápida
          y sencilla. ¡Logremos que tu causa llegue a todos y que la ayuda
          llegue hasta el último rincón!
        </Text>
        <Stack direction={"row"}>
          <NextLink href="/campaign/create" passHref>
            <Button
              rounded={"full"}
              px={6}
              bg={"blue.600"}
              _hover={{ bg: "blue.500" }}
            >
              Crear una campaña
            </Button>
          </NextLink>
          <NextLink href="/campaign" passHref>
            <Button variant="outline" colorPalette="blue" rounded={"full"} px={6}>
              Ver campañas
            </Button>
          </NextLink>
        </Stack>
      </Stack>

      {/* Featured Campaigns Section */}
      <Box my={16}>
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Heading as="h2" size="xl">
            Campañas Destacadas
          </Heading>
          <NextLink href="/campaign" passHref>
            Ver todas
          </NextLink>
        </Flex>

        {isLoading ? (
          <Flex justify="center" my={10}>
            <Text>Cargando campañas...</Text>
          </Flex>
        ) : featuredCampaigns.length === 0 ? (
          <Flex justify="center" my={10}>
            <Text>No hay campañas activas en este momento</Text>
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 1 }} >
            {featuredCampaigns.map((campaign) => (
              <FeaturedCampaign key={campaign.id} campaign={campaign} />
            ))}
          </SimpleGrid>
        )}
      </Box>
    </Container>
  );
}
