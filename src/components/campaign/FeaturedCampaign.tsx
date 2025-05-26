"use client";
import { Campaign } from "@/interfaces/ICampaign.interface";
import { Box, Heading, Image, Text, Flex, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface FeaturedCampaignProps {
  campaign: Campaign;
}

const FeaturedCampaign = ({ campaign }: FeaturedCampaignProps) => {
  const [campaignImage, setCampaignImage] = useState<string>('/img/campaigns/1.jpeg');

  // Responsive sizing
  const imageHeight = useBreakpointValue({ base: "200px", md: "300px", lg: "400px" });
  const headingSize = useBreakpointValue({ base: "lg", md: "xl", lg: "2xl" }) as "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | undefined;

  useEffect(() => {
    // If there's at least one image in the images array, use it
    if (campaign.images && campaign.images.length > 0 && campaign.images[0]) {
      setCampaignImage(campaign.images[0]);
    } else {
      // Otherwise use a random image as fallback
      const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * 5) + 1;
        return `/img/campaigns/${randomIndex}.jpeg`;
      };

      setCampaignImage(getRandomImage());
    }
  }, [campaign.images]);

  return (
    <Link href={`/campaign/${campaign.id}`} passHref style={{ width: '100%' }}>
      <Box
        position="relative"
        overflow="hidden"
        borderRadius="lg"
        boxShadow="xl"
        transition="transform 0.3s ease"
        _hover={{ transform: 'scale(1.02)' }}
        h={imageHeight}
        width="100%"
        cursor="pointer"
      >
        <Image
          src={campaignImage}
          alt={campaign.name}
          objectFit="cover"
          width="100%"
          height="100%"
          onError={() => setCampaignImage('/img/campaigns/1.jpeg')}
        />

        {/* Gradient overlay */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          bg="linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)"
          p={6}
          color="white"
        >
          <Heading size={headingSize} mb={2}>
            {campaign.name}
          </Heading>

          {/* Status indicator */}
          <Flex align="center" mb={2}>
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg={campaign.status === "active" ? "green.500" : "red.500"}
              mr={2}
            />
            <Text fontSize="sm">
              {campaign.status === "active" ? "Campaña activa" : "Campaña inactiva"}
            </Text>
          </Flex>

          {/* Categories */}
          {campaign.categories && campaign.categories.length > 0 && (
            <Flex wrap="wrap" gap={1} mt={1}>
              {campaign.categories.map((category, index) => (
                <CategoryBadge key={index} category={category} />
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </Link>
  );
};

export default FeaturedCampaign;
