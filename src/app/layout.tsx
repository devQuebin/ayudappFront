"use client";
import { Roboto } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import { Flex } from "@chakra-ui/react";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import { useThemeSync } from "@/components/ui/theme-sync";
import "./globals.css"; // Importamos los estilos globales

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Page metadata (not exported in client component)
const pageMetadata = {
  title: "AyudApp - Plataforma de Ayuda",
  description: "Plataforma para conectar personas que necesitan ayuda con quienes pueden ofrecerla",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This hook safely handles client-side theme synchronization
  // and returns whether we're mounted on the client
  const isMounted = useThemeSync();
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>{pageMetadata.title}</title>
        <meta name="description" content={pageMetadata.description} />
      </head>
      <body className={roboto.className} suppressHydrationWarning>
        {/* Only fully render once client-side */}
        <div style={{ visibility: isMounted ? 'visible' : 'hidden' }}>
          <Provider>
            <Flex direction="column" minHeight="100vh" gap={1}>
              <Header />
              <Flex mt={20} as="main" flex="1" direction="column">
                {children}
              </Flex>
              <Footer />
            </Flex>
          </Provider>
        </div>
      </body>
    </html>);
}
