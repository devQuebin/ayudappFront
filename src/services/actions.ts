"use server";

import { cookies } from "next/headers";
import { ICampaignResponse, Campaign, CampaignResponse } from "../interfaces/ICampaign.interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCampaigns(): Promise<ICampaignResponse> {
  try {
    const response = await fetch(`${API_URL}/campaign`, {
      next: {
        revalidate: 60 // revalidate cache every 60 seconds
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch campaigns");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return { data: [], message: "Error fetching campaigns", status: 500 };
  }
}

export async function getCampaignById(id: string): Promise<CampaignResponse> {
  const response = await fetch(`${API_URL}/campaign/${id}`, {
    next: {
      revalidate: 30 // revalidate cache every 30 seconds
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch campaign");
  }

  return response.json();
}

export async function createCampaign(campaign: Campaign): Promise<Campaign> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const uid = cookieStore.get("uid");

  if (!token || !uid) {
    throw new Error("User not authenticated");
  }

  campaign.ownerId = uid.value;
  campaign.status = campaign.status || "active";

  if (typeof campaign.amountTarget === "string") {
    campaign.amountTarget = parseFloat(campaign.amountTarget);
  }

  const response = await fetch(`${API_URL}/campaign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${token.value}`
    },
    body: JSON.stringify(campaign),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create campaign");
  }

  return response.json();
}

export async function updateCampaign(campaignId: string, campaign: Campaign): Promise<Campaign> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  campaign.status = campaign.status || "active";
  
  const { id, createdAt, updatedAt, ...campaignDataToSend } = campaign;

  if (typeof campaignDataToSend.amountTarget === "string") {
    campaignDataToSend.amountTarget = parseFloat(campaignDataToSend.amountTarget);
  }

  const response = await fetch(`${API_URL}/campaign/${campaignId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token.value}`
    },
    body: JSON.stringify(campaignDataToSend)
  });

  if (!response.ok) {
    throw new Error("Failed to update campaign");
  }

  return response.json();
}
