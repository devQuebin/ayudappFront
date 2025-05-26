import { Campaign } from "@/interfaces/ICampaign.interface"

export type CampaignSearchParams = {
  query?: string
  category?: string
  page?: string
  limit?: string
}

// Función para filtrar campañas según los parámetros de búsqueda
export function filterCampaigns(
  campaigns: Campaign[],
  searchParams: CampaignSearchParams
): Campaign[] {
  const { query, category } = searchParams

  return campaigns.filter((campaign) => {
    // Filtro por nombre o descripción (query)
    const matchesQuery =
      !query ||
      campaign.name.toLowerCase().includes(query.toLowerCase()) ||
      campaign.description.toLowerCase().includes(query.toLowerCase()) ||
      (campaign.categories &&
        campaign.categories.some((cat) =>
          cat.toLowerCase().includes(query.toLowerCase())
        ))

    // Filtro por categoría específica (si está presente)
    const matchesCategory =
      !category ||
      (campaign.categories && campaign.categories.includes(category))

    // Ambos filtros deben coincidir
    return matchesQuery && matchesCategory
  })
}

// Función para paginar campañas
export function paginateCampaigns(
  campaigns: Campaign[],
  searchParams: CampaignSearchParams
): Campaign[] {
  const page = parseInt(searchParams.page || "1")
  const limit = parseInt(searchParams.limit || "9")
  const startIndex = (page - 1) * limit

  return campaigns.slice(startIndex, startIndex + limit)
}

// Función para obtener todas las categorías únicas de las campañas
export function getUniqueCategories(campaigns: Campaign[]): string[] {
  const categoriesSet = new Set<string>()

  campaigns.forEach((campaign) => {
    if (campaign.categories && campaign.categories.length > 0) {
      campaign.categories.forEach((category) => {
        categoriesSet.add(category)
      })
    }
  })

  return Array.from(categoriesSet).sort()
}
