"use client"
import { useEffect, useState } from "react";
import { Box, Text, Stack, Progress, Flex } from "@chakra-ui/react";
import { useDonation } from "@/hooks/useDonation";

interface CampaignStatsProps {
  campaignId: string;
  amountTarget: number;
}

interface CampaignStatistics {
  totalRaised: number;
  donorCount: number;
  anonymousDonorCount: number;
  totalDonations: number;
  donations: any[];
}

const CampaignStats = ({ campaignId, amountTarget }: CampaignStatsProps) => {
  const [stats, setStats] = useState<CampaignStatistics>({
    totalRaised: 0,
    donorCount: 0,
    anonymousDonorCount: 0,
    totalDonations: 0,
    donations: []
  });
  const [loading, setLoading] = useState(true);
  const { getCampaignStatistics } = useDonation();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const campaignStats = await getCampaignStatistics(campaignId);
        setStats(campaignStats);
      } catch (error) {
        console.error('Error loading campaign stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [campaignId, getCampaignStatistics]);

  if (loading) {
    return (
      <Box>
        <Text>Cargando estadísticas...</Text>
      </Box>
    );
  }

  const progressPercentage = (stats.totalRaised / amountTarget) * 100;

  return (
    <Box bg="gray.50" p={6} borderRadius="md" boxShadow="md">
      <Stack >
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Progreso de la Campaña
        </Text>

        <Stack >
          <Flex justify="space-between">
            <Text fontSize="sm" color="gray.600">Recaudado</Text>
            <Text fontSize="sm" fontWeight="bold" color="green.600">
              ${stats.totalRaised}
            </Text>
          </Flex>

          <Progress.Root value={progressPercentage} size="lg" colorPalette="green">
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>

          <Flex justify="space-between">
            <Text fontSize="xs" color="gray.500">
              {progressPercentage.toFixed(1)}% completado
            </Text>
            <Text fontSize="xs" color="gray.500">
              Meta: ${amountTarget}
            </Text>
          </Flex>
        </Stack>

        <Stack >
          <Text fontSize="sm" color="gray.600">
            <strong>{stats.totalDonations}</strong> donaciones realizadas
          </Text>
          <Text fontSize="sm" color="gray.600">
            <strong>{stats.donorCount}</strong> donantes identificados
          </Text>
          {stats.anonymousDonorCount > 0 && (
            <Text fontSize="sm" color="gray.600">
              <strong>{stats.anonymousDonorCount}</strong> donaciones anónimas
            </Text>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default CampaignStats;
