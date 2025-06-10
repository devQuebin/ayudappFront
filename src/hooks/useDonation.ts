"use client"
import { useState, useCallback } from "react"
import {
  createDonation,
  getDonationsByUser,
  getTotalRaisedByCampaign,
  getCampaignStats,
} from "@/services/donationService"
import {
  CreateDonationRequest,
  DonationResponse,
} from "@/interfaces/IDonation.interface"

export const useDonation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const makeDonation = async (
    donationData: CreateDonationRequest,
    userId?: string
  ): Promise<DonationResponse | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await createDonation(donationData, userId)
      return result
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear la donación"
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  const getUserDonations = async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const donations = await getDonationsByUser(userId)
      return donations
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al obtener las donaciones"
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }

  const getCampaignTotalRaised = useCallback(
    async (campaignId: string): Promise<number> => {
      setLoading(true)
      setError(null)

      try {
        const total = await getTotalRaisedByCampaign(campaignId)
        return total
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Error al obtener el total recaudado"
        setError(errorMessage)
        return 0
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const getCampaignStatistics = useCallback(async (campaignId: string) => {
    setLoading(true)
    setError(null)

    try {
      const stats = await getCampaignStats(campaignId)
      return stats
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al obtener las estadísticas"
      setError(errorMessage)
      return {
        totalRaised: 0,
        donorCount: 0,
        anonymousDonorCount: 0,
        totalDonations: 0,
        donations: [],
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    makeDonation,
    getUserDonations,
    getCampaignTotalRaised,
    getCampaignStatistics,
    loading,
    error,
  }
}

export default useDonation
