'use client'

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
  firstName: string
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

  const onSubmit = handleSubmit((data) => {
    setSuccessMessage(null)
    setErrorMessage(null)

    const url = `${process.env.NEXT_PUBLIC_API_URL}/user`
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to register')
        }
        return response.json()
      })
      .then((result) => {
        console.log('Registration successful:', result)
        setSuccessMessage('Registration successful!')
      })
      .catch((error) => {
        console.error('Error during registration:', error)
        setErrorMessage('Error during registration. Please try again.')
      })
  })

  return (
    <form onSubmit={onSubmit}>
      <Fieldset.Root size="lg" maxW="md" mx="auto" mt={12}>
        <Stack pt={20}>
          <Fieldset.Legend>Registrarse</Fieldset.Legend>
        </Stack>

        <Fieldset.Content>
          <Field.Root required invalid={!!errors.firstName}>
            <Field.Label>Nombre <Field.RequiredIndicator /></Field.Label>
            <Input {...register("firstName", { required: "This field is required" })} />
            <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.lastName}>
            <Field.Label>Apellido <Field.RequiredIndicator /></Field.Label>
            <Input {...register("lastName", { required: "This field is required" })} />
            <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
          </Field.Root>

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
