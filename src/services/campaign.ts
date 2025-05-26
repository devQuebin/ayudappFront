"use server"
import { cookies } from "next/headers"
import {
  Campaign,
  CampaignResponse,
  ICampaignResponse,
} from "../interfaces/ICampaign.interface"

const API_URL = process.env.API_URL

export const createCampaign = async (campaign: Campaign): Promise<Campaign> => {
  console.log("url:", API_URL)
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")
  const uid = (await cookieStore).get("uid")

  if (!token || !uid) {
    throw new Error("User not authenticated")
  }

  // Asignar el ownerId automáticamente
  campaign.ownerId = uid.value

  // Establecer el estado como activo por defecto
  campaign.status = campaign.status || "active"

  // Convertir amountTarget a número si es string
  if (typeof campaign.amountTarget === "string") {
    campaign.amountTarget = parseFloat(campaign.amountTarget)
  }

  try {
    const response = await fetch(`${API_URL}/campaign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify(campaign),
    })

    if (!response.ok) {
      // Intentar obtener el mensaje de error del cuerpo de la respuesta
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
  campaign: Campaign
): Promise<Campaign> => {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")

  if (!token) {
    throw new Error("User not authenticated")
  }

  // Establecer el estado como activo por defecto
  campaign.status = campaign.status || "active"
  // Remove fields that should not be sent to the API
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, ...campaignDataToSend } = campaign

  // Convertir amountTarget a número si es string
  if (typeof campaign.amountTarget === "string") {
    campaign.amountTarget = parseFloat(campaign.amountTarget)
  }

  const response = await fetch(`${API_URL}/campaign/${campaignId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify(campaignDataToSend),
  })

  if (!response.ok) {
    throw new Error("Failed to update campaign")
  }

  return response.json()
}

export const getCampaignById = async (
  id: string
): Promise<CampaignResponse> => {
  const response = await fetch(`${API_URL}/campaign/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch campaign")
  }

  return response.json()
}

export const getCampaigns = async (): Promise<ICampaignResponse> => {
  try {
    const response = await fetch(`${API_URL}/campaign`, {
      cache: "no-store",
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
