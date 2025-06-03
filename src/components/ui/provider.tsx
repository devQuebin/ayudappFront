"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ThemeProvider, type Attribute } from "next-themes"
import { ClientOnly } from "@chakra-ui/react"
import * as React from "react"

interface ProviderProps {
  children: React.ReactNode
  defaultTheme?: string
  attribute?: Attribute | Attribute[]
  enableSystem?: boolean
}

export function Provider({
  children,
  defaultTheme = "system",
  attribute = "class",
  enableSystem = true,
}: ProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ClientOnly fallback={<div style={{ visibility: "hidden" }} />}>
        <ThemeProvider
          attribute={attribute}
          defaultTheme={defaultTheme}
          enableSystem={enableSystem}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ClientOnly>
    </ChakraProvider>
  )
}
