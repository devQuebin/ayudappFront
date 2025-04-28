import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Ayudapp",
  description: "Ayuda comunitaria",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className} suppressHydrationWarning>
        <Provider>
          <Flex direction="column" minHeight="100vh">
            <Header />
            {children}
            <Footer />
          </Flex>
        </Provider>
      </body>
    </html>
  );
}
