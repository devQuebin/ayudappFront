'use client'

import {
  Button,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import {
  getCurrentUser,
  updateUserData,
  updatePassword
} from "@/services/user"
import { useRouter } from "next/navigation"

interface FormValues {
  name: string
  lastName: string
  password?: string
}

export default function ProfileForm() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>()

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser()
      reset({
        name: user.name,
        lastName: user.lastName,
        password: "", // siempre limpia el campo de contraseña
      })
    } catch (err) {
      setError("No se pudo cargar el perfil.")
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const [userCampaigns, setUserCampaigns] = useState([])

  useEffect(() => {
    const fetchUserCampaigns = async () => {
      const uid = localStorage.getItem("uid")
      if (!uid) return
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaign`)
        const result = await res.json()
        const campaigns = result.data?.filter((c: any) => c.ownerId === uid) || []
        setUserCampaigns(campaigns)
      } catch (err) {
        console.error("Error al cargar campañas del usuario:", err)
      }
    }

    fetchUserCampaigns()
  }, [])

  const onSubmit = handleSubmit(async (data) => {
    try {
      setError(null)
      setSuccess(null)

      const uid = localStorage.getItem('uid')
      if (!uid) throw new Error("Usuario no disponible")

      // Actualizar nombre y apellido
      await updateUserData(uid, {
        name: data.name,
        lastName: data.lastName,
      })

      setSuccess("Datos actualizados correctamente.")
      // Recargar valores desde el backend
      await fetchUser()
    } catch (err: any) {
      setError(err.message || "Error al actualizar.")
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Input
          placeholder="Nombre"
          {...register("name", { required: true })}
        />
        <Input
          placeholder="Apellido"
          {...register("lastName", { required: true })}
        />

        {error && <Text color="red.500">{error}</Text>}
        {success && <Text color="green.500">{success}</Text>}

        <Button type="submit" colorScheme="teal">Guardar cambios</Button>
        {userCampaigns.length > 0 && (
          <Stack mt={8}>
            <Text fontSize="lg" fontWeight="bold">Mis campañas</Text>
            {userCampaigns.map((campaign: any) => (
              <Button
                as="a"
                href={`/campaign/edit/${campaign.id}`} 
                variant="outline"
                key={campaign.id}
                justifyContent="flex-start"
              >
                {campaign.name}
              </Button>
            ))}
          </Stack>
        )}
      </Stack>
    </form>
  )
}
