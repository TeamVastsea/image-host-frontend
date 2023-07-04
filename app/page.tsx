"use client";

import {
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Link,
  Card,
  useColorMode,
  Text,
  CardBody,
} from "@chakra-ui/react";

import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  return (
    <Box
      w="full"
      p={3}
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
    >
      <Card maxW="max" px={7} py={10} mb={10} textAlign="center">
        <Heading textAlign="center" w="max" m="auto">
          Image Host
        </Heading>

        <Text maxW={300} opacity={0.8} mt={2}>
          Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
          cillum sint consectetur cupidatat.
        </Text>

        <HStack justify="center" mt={5}>
          <Button onClick={() => router.push("/login")}>登录</Button>
          <IconButton
            aria-label="Color Scheme"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
          />
          <Button
            variant="outline"
            onClick={() => window.open("https://www.vastsea.cc")}
          >
            官网
          </Button>
        </HStack>
      </Card>
    </Box>
  );
}
