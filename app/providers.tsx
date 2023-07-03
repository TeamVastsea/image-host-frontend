// app/providers.tsx
"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import { ColorModeScript } from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ColorModeScript initialColorMode={"system"} />
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );
}
