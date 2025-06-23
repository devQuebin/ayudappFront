"use server"
import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
  console.log(data)
  ;(await cookieStore).set("token", data.token, {
    httpOnly: true,
    path: "/",
  })
  ;(await cookieStore).set("uid", data.uid, {
    httpOnly: true,
    path: "/",
  })

  return data.token
}

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  lastName: string
): Promise<string> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name, lastName }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error al registrar el usuario")
  }

  const data = await response.json()
  return data.token
}