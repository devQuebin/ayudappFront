"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { ClientOnly } from "@chakra-ui/react"

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem} >
      <ClientOnly fallback={<div style={{ visibility: "hidden" }} />}>
        <ColorModeProvider {...props} />
      </ClientOnly>
    </ChakraProvider>
  )
}
