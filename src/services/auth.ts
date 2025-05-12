"use server"
import { cookies } from "next/headers"

const API_URL = process.env.API_URL

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const cookieStore = cookies()

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  const data = await response.json()

  ;(await cookieStore).set("token", data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  })

  return data.token
}

export const registerUser = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error("Registration failed")
  }

  const data = await response.json()
  return data.token
}

export const getUserFromCookie = async () => {
  const cookieStore = cookies()
  const userToken = (await cookieStore).get("token")
  return userToken?.value || null
}

export const deleteUserFromCookie = async () => {
  const cookieStore = cookies()
  ;(await cookieStore).delete("token")
}
