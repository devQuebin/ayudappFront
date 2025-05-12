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

interface FormValues {
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

  const onSubmit = handleSubmit((data) => {
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      registerUser(data.email, data.password)
      setSuccessMessage("User registered successfully!")
    } catch (error) {
      console.log(error)
      setErrorMessage("Failed to register user. Please try again.")
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <Fieldset.Root size="lg" maxW="md" mx="auto" mt={12}>
        <Stack pt={20}>
          <Fieldset.Legend>Registrarse</Fieldset.Legend>
        </Stack>

        <Fieldset.Content>

          <Field.Root required invalid={!!errors.email}>
            <Field.Label>Email <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("email", {
                required: "This field is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              type="email"
            />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.password} className="relative">
            <Field.Label>Contraseña <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("password", { required: "This field is required" })}
              type={"password"}
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
            Ya tiene cuenta? <Link href="/login"><Button>Iniciar Sesión</Button></Link>
          </Fieldset.HelperText>
        </Stack>
      </Fieldset.Root>
    </form>
  )
}
