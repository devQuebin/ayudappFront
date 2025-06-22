'use client'

import { registerUser } from "@/services/auth"
import {
  Button,
  Field,
  Fieldset,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation" // ✅ se agregó esta línea

interface FormValues {
  name: string
  lastName: string
  email: string
  password: string
}

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>()

  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter() // ✅ se agregó esta línea

  const onSubmit = handleSubmit(async (data) => {
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      await registerUser(data.email, data.password, data.name, data.lastName)
      setSuccessMessage("Usuario registrado correctamente.")

      // ✅ Redirigir automáticamente a /login después de un pequeño delay
      setTimeout(() => {
        router.push("/login")
      }, 1000)

    } catch (error: any) {
      console.error(error)
      setErrorMessage(error.message || "No se pudo registrar el usuario.")
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <Fieldset.Root size="lg" maxW="md" mx="auto" mt={12}>
        <Stack pt={20}>
          <Fieldset.Legend>Registrarse</Fieldset.Legend>
        </Stack>

        <Fieldset.Content>
          <Field.Root required invalid={!!errors.name}>
            <Field.Label>Nombre <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("name", { required: "Este campo es obligatorio" })}
              type="text"
            />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.lastName}>
            <Field.Label>Apellido <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("lastName", { required: "Este campo es obligatorio" })}
              type="text"
            />
            <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.email}>
            <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("email", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Correo inválido",
                },
              })}
              type="email"
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.password}>
            <Field.Label>Contraseña <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("password", { required: "Este campo es obligatorio" })}
              type="password"
            />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>
        </Fieldset.Content>

        <Button type="submit" alignSelf="flex-start" mt={4}>
          Crear cuenta
        </Button>

        {successMessage && (
          <Text color="green.500" mt={4}>
            {successMessage}
          </Text>
        )}
        {errorMessage && (
          <Text color="red.500" mt={4}>
            {errorMessage}
          </Text>
        )}

        <Stack pt={6}>
          <Fieldset.HelperText>
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login">
              <Button>Iniciar Sesión</Button>
            </Link>
          </Fieldset.HelperText>
        </Stack>
      </Fieldset.Root>
    </form>
  )
}
