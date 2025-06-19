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
    formState: { errors },
  } = useForm<FormValues>()

  const [uid, setUid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      setValue("name", user.name);
      setValue("lastName", user.lastName);
    } catch (err) {
      setError("No se pudo cargar el perfil.");
    }
  };

  fetchUser();
}, [setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!uid) throw new Error("Usuario no disponible")

      await updateUserData(uid, {
        name: data.name,
        lastName: data.lastName,
      })

      if (data.password) {
        await updatePassword(uid, data.password)
      }

      setSuccess("Datos actualizados correctamente.")
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
        <Input
          placeholder="Nueva contraseña (opcional)"
          type="password"
          {...register("password")}
        />

        {error && <Text color="red.500">{error}</Text>}
        {success && <Text color="green.500">{success}</Text>}

        <Button type="submit" colorScheme="teal">Guardar cambios</Button>
      </Stack>
    </form>
  )
}
