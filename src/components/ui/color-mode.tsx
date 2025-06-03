"use client"

import type { IconButtonProps } from "@chakra-ui/react"
import { IconButton } from "@chakra-ui/react"
import { useTheme } from "next-themes"
import * as React from "react"
import { LuMoon, LuSun } from "react-icons/lu"

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  Omit<IconButtonProps, "aria-label">
>(function ColorModeButton(props, ref) {
  const { resolvedTheme, setTheme } = useTheme()
  const Icon = resolvedTheme === "dark" ? LuMoon : LuSun
  
  return (
    <IconButton
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      variant="ghost"
      aria-label="Toggle color mode"
      size="sm"
      ref={ref}
      {...props}
    >
      <Icon />
    </IconButton>
  )
})
