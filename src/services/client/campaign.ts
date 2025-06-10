import {
  Campaign,
  CampaignResponse,
  ICampaignResponse,
} from "../../interfaces/ICampaign.interface"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const getCampaigns = async (): Promise<ICampaignResponse> => {
  try {
    const response = await fetch(`${API_URL}/campaign`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60 // revalidate cache every 60 seconds
      }
    })

    if (!response.ok) {
      throw new Error("Failed to fetch campaigns")
    }

    return response.json()
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return { data: [], message: "Error fetching campaigns", status: 500 }
  }
}

export const getCampaignById = async (id: string): Promise<CampaignResponse> => {
  const response = await fetch(`${API_URL}/campaign/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 30 // revalidate cache every 30 seconds
    }
  })

  if (!response.ok) {
    throw new Error("Failed to fetch campaign")
  }

  return response.json()
}

export const createCampaign = async (campaign: Campaign, token: string): Promise<Campaign> => {
  try {
    const response = await fetch(`${API_URL}/campaign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(campaign),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to create campaign")
    }

    return response.json()
  } catch (error) {
    console.error("Error creating campaign:", error)
    throw error
  }
}

export const updateCampaign = async (
  campaignId: string,
  campaign: Campaign,
  token: string
): Promise<Campaign> => {

  const response = await fetch(`${API_URL}/campaign/${campaignId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,

    },
    body: JSON.stringify(campaign),

  })

  if (!response.ok) {
    throw new Error("Failed to update campaign")
  }

  return response.json()
}
