"use client"
import { Campaign } from "@/interfaces/ICampaign.interface";
import { Box, Image, Text, Stack, Button, HStack, useDisclosure, Dialog, Flex, Progress } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import CategoryBadge from "@/components/ui/CategoryBadge";
import PaymentModal from "@/components/donations/PaymentModal";
import { useDonation } from "@/hooks/useDonation";

interface CardProps extends Campaign {
  currentUserId?: string | null;
}

const Card = ({
  id,
  amountTarget,
  createdAt,
  description,
  dueDate,
  endDate,
  name,
  ownerId,
  startDate,
  status,
  currentUserId,
  images,
  categories
}: CardProps) => {
  const [isOwner, setIsOwner] = useState(false);
  const { open, onOpen, onClose } = useDisclosure();
  const { open: donationOpen, onOpen: onDonationOpen, onClose: onDonationClose } = useDisclosure();
  // Default image path
  const [campaignImage, setCampaignImage] = useState<string>('/img/campaigns/1.jpeg');
  const [totalRaised, setTotalRaised] = useState<number>(0);
  const { getCampaignTotalRaised } = useDonation();

  const handleDonateClick = () => {
    if (!currentUserId) {
      // Redirigir al login si no está autenticado
      window.location.href = '/login?message=Debes iniciar sesión para realizar una donación';
      return;
    }
    onDonationOpen();
  };
  useEffect(() => {
    // Set ownership directly from the passed currentUserId
    setIsOwner(currentUserId === ownerId);

    // If there's at least one image in the images array, use it
    if (images && images.length > 0 && images[0]) {
      setCampaignImage(images[0]);
    } else {
      // Otherwise use a random image as fallback
      const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * 5) + 1;
        return `/img/campaigns/${randomIndex}.jpeg`;
      };

      setCampaignImage(getRandomImage());
    }    // Load total raised for this campaign
    const loadTotalRaised = async () => {
      if (!id) return;
      try {
        const total = await getCampaignTotalRaised(id);
        setTotalRaised(total);
      } catch (error) {
        console.error('Error loading total raised:', error);
        setTotalRaised(0);
      }
    };

    loadTotalRaised();
  }, [currentUserId, ownerId, images, id, getCampaignTotalRaised]);

  // Helper function to format dates consistently between server and client
  const formatDate = (date: string | Date) => {
    if (!date) return "No disponible";
    // Use ISO format for consistent rendering
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <Flex
      direction="column"
      justifyContent={"space-between"}
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      p={4}
      position="relative"
    >
      {isOwner && (
        <Link href={`/campaign/edit/${id}`} passHref>
          <Button
            size="sm"
            colorScheme="blue"
            position="absolute"
            top={2}
            right={2}
            zIndex={1}
          >
            Editar
          </Button>
        </Link>
      )}      <Image
        src={campaignImage}
        alt={name}
        borderRadius="md"
        onClick={onOpen}
        cursor="pointer"
        loading="lazy"
        width={300}
        height={200}
        onError={() => setCampaignImage('/img/campaigns/1.jpeg')}
      />

      <Stack mt={4}>
        <Flex align="center" mt={1} gap={2}>
          <Text fontWeight="bold" fontSize="lg">
            {name}
          </Text>
          <Box
            w="10px"
            h="10px"
            borderRadius="full"
            bg={status === "active" ? "green.500" : "red.500"}
            mr={2}
          />
        </Flex>
        {/* Display categories */}
        {categories && categories.length > 0 && (
          <Flex wrap="wrap" gap={1} mt={1}>
            {categories.map((category, index) => (
              <CategoryBadge key={index} category={category} />
            ))}
          </Flex>
        )}        <Text fontSize="sm" color="gray.600" >
          {description}
        </Text>
        <Text fontSize="sm" color="gray.500" fontWeight="bold">
          Meta: ${amountTarget}
        </Text>
        <Text fontSize="sm" color="green.600" fontWeight="bold">
          Recaudado: ${totalRaised}
        </Text>
        <Progress.Root
          value={
            amountTarget && amountTarget > 0
              ? Math.min((totalRaised / amountTarget) * 100, 100)
              : 0
          }
          size="sm"
          colorPalette="green"
        >
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        <Text fontSize="xs" color="gray.500">
          {amountTarget && amountTarget > 0
            ? `${((totalRaised / amountTarget) * 100).toFixed(1)}% completado`
            : "0% completado"}
        </Text>
        <Text fontSize="xs" color="gray.400">
          Creado el: {formatDate(createdAt!)}
        </Text>
        <Text fontSize="xs" color="gray.400">
          Fecha de inicio: {formatDate(startDate)}
        </Text>
        <Text fontSize="xs" color="gray.400">
          Fecha de fin: {formatDate(endDate)}
        </Text>        <HStack gap={2} mt={"auto"}>
          <Button colorScheme="teal" size="sm" flexGrow={1} onClick={handleDonateClick}>
            Donar
          </Button>
          <Button colorScheme="gray" size="sm" onClick={onOpen}>
            Ver más
          </Button>
        </HStack>
      </Stack>

      {/* Dialog con detalles completos */}
      <Dialog.Root open={open} onOpenChange={onClose}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="lg">
            <Dialog.Header>
              <Dialog.Title>{name}</Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body pb={6}>
              <Image
                src={campaignImage}
                alt={name}
                borderRadius="md"
                mb={4}
              />              {/* Display categories in dialog */}
              {categories && categories.length > 0 && (
                <Flex wrap="wrap" gap={2} mb={3}>
                  {categories.map((category, index) => (
                    <CategoryBadge key={index} category={category} />
                  ))}
                </Flex>
              )}

              <Text mb={4}>{description}</Text>
              <Stack gap={2}>
                <Text fontWeight="bold">Meta: ${amountTarget}</Text>
                <Text>Estado: {status === "active" ? "Activa" : "Inactiva"}</Text>
                <Text>Fecha de inicio: {formatDate(startDate)}</Text>
                <Text>Fecha de fin: {formatDate(endDate)}</Text>
                <Text>Fecha límite: {formatDate(dueDate)}</Text>
                <Text>Creado el: {formatDate(createdAt!)}</Text>
              </Stack>
            </Dialog.Body>            <Dialog.Footer>
              <Button colorScheme="teal" w="full" onClick={handleDonateClick}>
                Donar a esta campaña
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>      {/* Modal de Donación */}
      <PaymentModal
        isOpen={donationOpen}
        onClose={onDonationClose}
        campaignId={id || ''}
        campaignName={name}
        userId={currentUserId}
      />
    </Flex>
  );
};

export default Card;
