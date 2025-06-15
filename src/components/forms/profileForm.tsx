import {
  Button,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { getUserData, updateUserData, updatePassword } from "@/services/user"
import { useRouter } from "next/navigation"

interface FormValues {
  name: string
  lastName: string
  password?: string
}

export default function ProfileForm({ uid }: { uid: string }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>()

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserData(uid)
        setValue("name", userData.name)
        setValue("lastName", userData.lastName)
      } catch (err: any) {
        setError("No se pudo cargar el perfil.")
      }
    }
    fetchData()
  }, [uid, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
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
      <Stack spacing={4}>
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
