
import {
  CreateDonationRequest,
  CreateDonationAPIRequest,
  DonationResponse,
  BackendDonation,
} from "@/interfaces/IDonation.interface"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const createDonation = async (
  donationData: CreateDonationRequest,
  userId: string | null // <-- hacerlo obligatorio o pasarlo bien desde el frontend
): Promise<DonationResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Unauthenticated: No token found");
  }

  // Asegurate que userId no sea null
  const donorId = donationData.isAnonymous ? "anonymous" : userId;
  if (!donorId) {
    throw new Error("User ID is required to create donation");
  }

  const apiRequest: CreateDonationAPIRequest = {
    donorId,
    campaignId: donationData.campaignId,
    date: new Date().toISOString(),
    amount: donationData.amount,
  };

  const response = await fetch(`${API_URL}/donation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(apiRequest),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  return result;
};

export const getDonationsByUser = async (userId: string) => {
  try {
    // Since there's no specific endpoint for user donations,
    // we get all donations and filter on the frontend
    const response = await fetch(`${API_URL}/donation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    // Filter donations by donorId (backend uses donorId instead of userId)
    const userDonations =
      result.data?.filter(
        (donation: BackendDonation) => donation.donorId === userId
      ) || []
    
    return { data: userDonations }
  } catch (error) {
    console.error("❌ Error fetching user donations:", error)
    throw error
  }
}

export const getDonationsByCampaign = async (campaignId: string) => {
  try {
    // Since there's no specific endpoint for campaign donations,
    // we get all donations and filter on the frontend
    const response = await fetch(`${API_URL}/donation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    // Filter donations by campaignId on the frontend
    const campaignDonations =
      result.data?.filter(
        (donation: BackendDonation) => donation.campaignId === campaignId
      ) || []

    return { data: campaignDonations }
  } catch (error) {
    console.error("❌ Error fetching campaign donations:", error)
    throw error
  }
}

export const getAllDonations = async () => {
  try {
    const response = await fetch(`${API_URL}/donation`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("❌ Error fetching all donations:", error)
    throw error
  }
}

export const getDonationById = async (donationId: string) => {
  try {
    const response = await fetch(`${API_URL}/donation/${donationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("❌ Error fetching donation by ID:", error)
    throw error
  }
}

export const getTotalRaisedByCampaign = async (
  campaignId: string
): Promise<number> => {
  try {
    const campaignDonations = await getDonationsByCampaign(campaignId)

    const total =
      campaignDonations.data?.reduce(
        (sum: number, donation: BackendDonation) => {
          return sum + (donation.amount || 0)
        },
        0
      ) || 0

    return total
  } catch (error) {
    console.error("❌ Error calculating total raised:", error)
    return 0
  }
}

export const getCampaignStats = async (campaignId: string) => {
  try {
    const campaignDonations = await getDonationsByCampaign(campaignId)
    const donations = campaignDonations.data || []

    const totalRaised = donations.reduce(
      (sum: number, donation: BackendDonation) => sum + (donation.amount || 0),
      0
    )
    const donorCount = donations.filter(
      (donation: BackendDonation) => donation.donorId !== "anonymous"
    ).length
    const anonymousDonorCount = donations.filter(
      (donation: BackendDonation) => donation.donorId === "anonymous"
    ).length

    return {
      totalRaised,
      donorCount,
      anonymousDonorCount,
      totalDonations: donations.length,
      donations,
    }
  } catch (error) {
    console.error("❌ Error fetching campaign stats:", error)
    return {
      totalRaised: 0,
      donorCount: 0,
      anonymousDonorCount: 0,
      totalDonations: 0,
      donations: [],
    }
  }
}
