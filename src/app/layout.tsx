"use client";
import { Roboto } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import { Flex } from "@chakra-ui/react";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={roboto.className} suppressHydrationWarning>
        <Provider>
          <Flex direction="column" minHeight="100vh" gap={1}>
            <Header />
            <Flex mt={20} as="main" flex="1" direction="column">
              {children}
            </Flex>
            <Footer />
          </Flex>
        </Provider>
      </body>
    </html>
  );
}
