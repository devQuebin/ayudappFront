"use client"
import React, { useState } from "react"
import { Campaign } from "@/interfaces/ICampaign.interface"
import { useRouter } from "next/navigation"
import { createCampaign, updateCampaign } from "@/services/campaign"
import {
  Button,
  Field,
  Fieldset,
  Input,
  Textarea,
  Stack,
  HStack,
  Text
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { TbTrash } from "react-icons/tb"

interface CampaignFormProps {
  isEditing?: boolean
  initialData?: Campaign
  campaignId?: string
}

const defaultCampaign: Campaign = {
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  dueDate: "",
  images: [""],
  categories: [""],
  amountTarget: 0,
  ownerId: "",
  status: "active",
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  isEditing = false,
  initialData,
  campaignId
}) => {
  const [formData, setFormData] = useState<Campaign>(initialData || defaultCampaign)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Campaign>({
    defaultValues: initialData || defaultCampaign
  })

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData(prev => ({
      ...prev,
      images: newImages
    }))
  }

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...formData.categories]
    newCategories[index] = value
    setFormData(prev => ({
      ...prev,
      categories: newCategories
    }))
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }))
  }

  const removeImage = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        images: newImages
      }))
    }
  }

  const addCategory = () => {
    setFormData(prev => ({
      ...prev,
      categories: [...prev.categories, ""]
    }))
  }

  const removeCategory = (index: number) => {
    if (formData.categories.length > 1) {
      const newCategories = formData.categories.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        categories: newCategories
      }))
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    setSuccessMessage(null)
    setErrorMessage(null)
    setIsSubmitting(true)

    console.log("Submitting data:", data)

    // Aplicar las imágenes y categorías del estado
    data.images = formData.images.filter(img => img.trim() !== "")
    data.categories = formData.categories.filter(cat => cat.trim() !== "")

    // Validar que haya al menos una imagen y una categoría
    if (data.images.length === 0) {
      setErrorMessage("Debe incluir al menos una URL de imagen")
      setIsSubmitting(false)
      return
    }

    if (data.categories.length === 0) {
      setErrorMessage("Debe incluir al menos una categoría")
      setIsSubmitting(false)
      return
    }

    try {
      if (isEditing && campaignId) {
        await updateCampaign(campaignId, data)
        setSuccessMessage("La campaña ha sido actualizada exitosamente")
      } else {
        await createCampaign(data)
        setSuccessMessage("La campaña ha sido creada exitosamente")
      }

      // Redireccionar después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push("/campaign")
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      setErrorMessage(`${isEditing ? "Error al actualizar" : "Error al crear"} la campaña`)
    } finally {
      setIsSubmitting(false)
    }
  })

  // Formatear fechas para inputs HTML
  const formatDateForInput = (isoString: string) => {
    if (!isoString) return ""
    return isoString.split("T")[0]
  }

  return (
    <form onSubmit={onSubmit}>
      <Fieldset.Root size="lg" maxW="md" mx="auto" mt={12}>
        <Stack pt={8}>
          <Fieldset.Legend>{isEditing ? "Editar Campaña" : "Crear Nueva Campaña"}</Fieldset.Legend>
        </Stack>

        <Fieldset.Content>
          <Field.Root required invalid={!!errors.name}>
            <Field.Label>Nombre de la Campaña <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("name", { required: "Este campo es obligatorio" })}
              placeholder="Nombre de la campaña"
            />
            <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.description}>
            <Field.Label>Descripción <Field.RequiredIndicator /></Field.Label>
            <Textarea
              {...register("description", { required: "Este campo es obligatorio" })}
              placeholder="Descripción detallada de la campaña"
              rows={4}
            />
            <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.startDate}>
            <Field.Label>Fecha de Inicio <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("startDate", { required: "Este campo es obligatorio" })}
              type="date"
              defaultValue={formatDateForInput(formData.startDate)}
            />
            <Field.ErrorText>{errors.startDate?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.endDate}>
            <Field.Label>Fecha de Fin <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("endDate", { required: "Este campo es obligatorio" })}
              type="date"
              defaultValue={formatDateForInput(formData.endDate)}
            />
            <Field.ErrorText>{errors.endDate?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.dueDate}>
            <Field.Label>Fecha Límite <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("dueDate", { required: "Este campo es obligatorio" })}
              type="date"
              defaultValue={formatDateForInput(formData.dueDate)}
            />
            <Field.ErrorText>{errors.dueDate?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required invalid={!!errors.amountTarget}>
            <Field.Label>Monto Objetivo <Field.RequiredIndicator /></Field.Label>
            <Input
              {...register("amountTarget", {
                required: "Este campo es obligatorio",
                min: { value: 1, message: "El monto debe ser mayor a 0" }
              })}
              type="number"
              min="1"
              step="1"
            />
            <Field.ErrorText>{errors.amountTarget?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root required>
            <Field.Label>URLs de Imágenes <Field.RequiredIndicator /></Field.Label>
            {formData.images.map((image, index) => (
              <HStack key={`image-${index}`} mb={2}>
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                <Button
                  aria-label="Eliminar imagen"
                  onClick={() => removeImage(index)}
                  size="sm" >
                  <TbTrash />
                </Button>
              </HStack>
            ))}
            <Button onClick={addImage} size="sm" mt={2}>
              + Añadir otra imagen
            </Button>
          </Field.Root>

          <Field.Root required>
            <Field.Label>Categorías <Field.RequiredIndicator /></Field.Label>
            {formData.categories.map((category, index) => (
              <HStack key={`category-${index}`} mb={2}>
                <Input
                  value={category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  placeholder="salud, educación, etc."
                />
                <Button
                  aria-label="Eliminar categoría"
                  onClick={() => removeCategory(index)}
                  size="sm" >
                  <TbTrash />
                </Button>
              </HStack>
            ))}
            <Button onClick={addCategory} size="sm" mt={2}>
              + Añadir otra categoría
            </Button>
          </Field.Root>
        </Fieldset.Content>

        <Button
          type="submit"
          alignSelf="flex-start"
          mt={4}
          loadingText={isSubmitting && (isEditing ? "Actualizando..." : "Creando...")}
        >
          {isEditing ? "Actualizar Campaña" : "Crear Campaña"}
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
      </Fieldset.Root>
    </form>
  )
}

export default CampaignForm
