"use client";

import {
  Card,
  Box,
  CardBody,
  Heading,
  Input,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Collapse,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  async function login() {
    if (isLoading) return;

    setIsloading(true);
    if (username.length < 3) {
      setError("玩家ID长度至少为3");

      setTimeout(() => {
        setIsloading(false);
      }, 1000);

      return;
    }

    // Some API requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (username !== "test") {
      setError("玩家不存在");
      setIsloading(false);
      return;
    }

    localStorage.setItem("username", username);
    router.push("/dash");
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="100vh"
    >
      <Card>
        <CardBody p={"10"}>
          <Heading textAlign={"center"} fontSize="30">
            登录
          </Heading>

          <Input
            my="5"
            placeholder="玩家ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
          />

          <Button
            pt="1.5"
            w="full"
            colorScheme="blue"
            isLoading={isLoading}
            onClick={login}
          >
            继续
          </Button>

          <Collapse in={!!error} animateOpacity>
            <Alert status="error" mt="5">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </Collapse>
        </CardBody>
      </Card>
    </Box>
  );
}
