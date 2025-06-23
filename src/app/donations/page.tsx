'use client'

import { useEffect, useState } from "react"
import { Box, Button, Center, Flex, Heading, Spinner, Text, Stack } from "@chakra-ui/react"
import Link from "next/link"

interface Donation {
  id: string
  campaignName: string
  amount: number
  date: string
}

export default function DonationHistoryPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [uid, setUid] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const userId = typeof window !== "undefined" ? localStorage.getItem("uid") : null;
      setUid(userId)

      if (!userId) {
        setLoading(false) // <- 🔧 esto evita que quede cargando si no hay usuario
        return
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/donation/donor/${userId}`)
        const result = await response.json()

        if (Array.isArray(result.data)) {
          setDonations(result.data)
        } else {
          setDonations([])
        }
      } catch (error) {
        console.error("Error al obtener historial de donaciones:", error)
        setDonations([]) // opcional para prevenir render roto
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

  return (
    <Box maxW="container.xl" mx="auto" py={8}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading as="h1" size="xl">Historial de Donaciones</Heading>
      </Flex>

      <Flex my={8} wrap="wrap" justifyContent="center" gap={4}>
        {donations.length === 0 ? (
          <Box py={10}>
          </Box>
        ) : (
          donations.map((donation) => (
            <Box
              key={donation.id}
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              maxW="sm"
              minW="xs"
              boxShadow="md"
            >
              <Stack>
                <Text fontWeight="bold">Campaña: {donation.campaignName}</Text>
                <Text>Monto: ${donation.amount}</Text>
                <Text>Fecha: {new Date(donation.date).toLocaleDateString()}</Text>
              </Stack>
            </Box>
          ))
        )}
      </Flex>
    </Box>
  )
}
