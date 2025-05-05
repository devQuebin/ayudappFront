import { ICampaign } from "@/interfaces/ICampaign.interface";
import { Box, Image, Text, Stack, Button } from "@chakra-ui/react";


const Card = ({
  id,
  amount_target,
  created_at,
  description,
  due_date,
  end_date,
  name,
  owner_id,
  start_date,
  status,
  updated_at,
}: ICampaign) => {
  const parsedDate = new Date(created_at.seconds * 1000);
  const formattedDate = parsedDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedTime = parsedDate.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDateTime = `${formattedDate} ${formattedTime}`;
  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * 5) + 1;
    return `/img/campaigns/${randomIndex}.jpeg`;
  };

  const campaignImage = getRandomImage();
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      p={4}
    >
      <Image
        src={campaignImage}
        alt={name}
        borderRadius="md"
      />
      <Stack mt={4}>
        <Text fontWeight="bold" fontSize="lg">
          {name}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {description}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Meta: ${amount_target}
        </Text>
        <Text fontSize="xs" color="gray.400">
          Creado el: {new Date(formattedDateTime).toLocaleDateString()}
        </Text>
        <Text fontSize="xs" color="gray.400">
          Fecha de inicio: {new Date(start_date).toLocaleDateString()}
        </Text>
        <Text fontSize="xs" color="gray.400">
          Fecha de fin: {new Date(due_date).toLocaleDateString()}
        </Text>
        <Button colorScheme="teal" size="sm" mt={2}>
          Donar
        </Button>
      </Stack>
    </Box>
  );
};

export default Card;