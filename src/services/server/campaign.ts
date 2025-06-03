"use server"
import { cookies } from "next/headers"

export const getCampaignToken = async () => {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")
  return token?.value || null
}

export const getUserId = async () => {
  const cookieStore = cookies()
  const userId = (await cookieStore).get("uid")
  return userId?.value || null
}
