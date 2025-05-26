"use client"
import { Badge, BadgeProps } from "@chakra-ui/react";
import { useMemo } from "react";

interface CategoryBadgeProps extends Omit<BadgeProps, 'colorScheme'> {
  category: string;
}

// Mapeo de categorías a colores específicos
const CATEGORY_COLORS: Record<string, { bg: string; color: string; border?: string }> = {
  // Salud
  "salud": { bg: "red.100", color: "red.800", border: "red.300" },

  // Educación
  "educacion": { bg: "blue.100", color: "blue.800", border: "blue.300" },
  "educación": { bg: "blue.100", color: "blue.800", border: "blue.300" },

  // Medio ambiente
  "medio ambiente": { bg: "green.100", color: "green.800", border: "green.300" },
  "ambiental": { bg: "green.100", color: "green.800", border: "green.300" },

  // Animales
  "animales": { bg: "orange.100", color: "orange.800", border: "orange.300" },
  "mascotas": { bg: "orange.100", color: "orange.800", border: "orange.300" },

  // Alimentación
  "alimentacion": { bg: "yellow.100", color: "yellow.800", border: "yellow.300" },
  "alimentación": { bg: "yellow.100", color: "yellow.800", border: "yellow.300" },
  "comida": { bg: "yellow.100", color: "yellow.800", border: "yellow.300" },

  // Comunidad
  "comunidad": { bg: "purple.100", color: "purple.800", border: "purple.300" },
  "comunitario": { bg: "purple.100", color: "purple.800", border: "purple.300" },

  // Tecnología
  "tecnologia": { bg: "cyan.100", color: "cyan.800", border: "cyan.300" },
  "tecnología": { bg: "cyan.100", color: "cyan.800", border: "cyan.300" },
  "tech": { bg: "cyan.100", color: "cyan.800", border: "cyan.300" },

  // Emergencias
  "emergencia": { bg: "red.100", color: "red.800", border: "red.300" },
  "desastre": { bg: "red.100", color: "red.800", border: "red.300" },

  // Vivienda
  "vivienda": { bg: "teal.100", color: "teal.800", border: "teal.300" },
  "hogar": { bg: "teal.100", color: "teal.800", border: "teal.300" },

  // Deportes
  "deporte": { bg: "blue.100", color: "blue.800", border: "blue.300" },
  "deportes": { bg: "blue.100", color: "blue.800", border: "blue.300" },

  // Cultura
  "cultura": { bg: "pink.100", color: "pink.800", border: "pink.300" },
  "arte": { bg: "pink.100", color: "pink.800", border: "pink.300" },

  // Infancia
  "infancia": { bg: "purple.100", color: "purple.800", border: "purple.300" },
  "niños": { bg: "purple.100", color: "purple.800", border: "purple.300" },
  "niñez": { bg: "purple.100", color: "purple.800", border: "purple.300" },
};

// Color por defecto para categorías no reconocidas
const DEFAULT_CATEGORY = { bg: "gray.50", color: "gray.800", border: "gray.200" };

export const CategoryBadge = ({ category, ...props }: CategoryBadgeProps) => {
  const categoryStyle = useMemo(() => {
    const normalizedCategory = category.toLowerCase().trim();
    return CATEGORY_COLORS[normalizedCategory] || DEFAULT_CATEGORY;
  }, [category]);

  return (
    <Badge
      variant="subtle"
      px={2}
      py={1}
      fontSize="xs"
      bgColor={categoryStyle.bg}
      color={categoryStyle.color}
      borderWidth="1px"
      borderColor={categoryStyle.border}
      {...props}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  );
};

export default CategoryBadge;
