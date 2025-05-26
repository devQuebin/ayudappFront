"use client";

import { useState } from "react";
import {
  Button,
  Field,
  Fieldset,
  Input,
  Stack,
  Flex,
} from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Search({ categories }: { categories: string[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams);

    if (searchTerm) {
      params.set("query", searchTerm);
    } else {
      params.delete("query");
    }

    // Verificar si el término de búsqueda coincide con alguna categoría
    const matchingCategory = categories.find(
      cat => cat.toLowerCase() === searchTerm.toLowerCase()
    );

    if (matchingCategory) {
      params.set("category", matchingCategory);
    } else {
      params.delete("category");
    }

    // Reset to first page when searching
    params.delete("page");

    replace(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setSearchTerm("");
    replace(pathname);
  };

  return (
    <form onSubmit={handleSearch}>
      <Fieldset.Root size="md" mb={6}>
        <Fieldset.Legend>Buscar Campañas</Fieldset.Legend>

        <Fieldset.Content>
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={4}
            align={{ base: "stretch", md: "flex-end" }}
          >
            <Field.Root flex={1}>
              <Input
                placeholder="Buscar por palabra o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Field.Root>

            <Stack direction="row" gap={2} >
              <Button type="submit" colorScheme="blue">
                Buscar
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Limpiar
              </Button>
            </Stack>
          </Flex>
        </Fieldset.Content>
      </Fieldset.Root>
    </form>
  );
}
