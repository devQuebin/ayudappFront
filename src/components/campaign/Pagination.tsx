"use client";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export default function Pagination({ totalItems, itemsPerPage, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Si solo hay una página, no mostrar la paginación
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  // Crear array con números de página a mostrar
  let pageNumbers = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    // Si hay menos páginas que el máximo a mostrar, mostrar todas
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    // Calcular qué páginas mostrar
    if (currentPage <= 3) {
      // Si estamos en las primeras páginas
      pageNumbers = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 2) {
      // Si estamos en las últimas páginas
      pageNumbers = [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      // Si estamos en el medio
      pageNumbers = [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
      ];
    }
  }

  return (
    <Flex justifyContent="center" alignItems="center" mt={8} gap={2} flexWrap="wrap">
      {/* Botón Anterior */}
      <Button
        size="sm"
        colorScheme="blue"
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Anterior
      </Button>

      {/* Botones de página */}
      {pageNumbers.map((page) => (
        <Button
          key={page}
          size="sm"
          colorScheme="blue"
          variant={currentPage === page ? "solid" : "outline"}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* Botón Siguiente */}
      <Button
        size="sm"
        colorScheme="blue"
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Siguiente
      </Button>

      {/* Información de paginación */}
      <Box ml={4}>
        <Text fontSize="sm" color="gray.600">
          Página {currentPage} de {totalPages}
        </Text>
      </Box>
    </Flex>
  );
}
