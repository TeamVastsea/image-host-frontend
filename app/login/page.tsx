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
  AlertDescription,
  Collapse,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { checkUsername } from "../api";

import { BsMicrosoft } from "react-icons/bs";

export default function Login() {
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  function goMicrosoft() {
    const current = window.location.href;
    const url =
      "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=217fe7a1-7aaa-4d3b-8293-c328ee3a1548&response_type=code&redirect_uri=" +
      encodeURIComponent(current) +
      "&scope=XboxLive.signin%20offline_access%20openid%20email&prompt=select_account&response_mode=fragment";
    location.href = url;
  }

  async function login() {
    if (isLoading) return;

    setIsloading(true);
    if (username.length < 3) {
      setError("Auth Code 长度不足");

      setTimeout(() => {
        setIsloading(false);
      }, 1000);

      return;
    }
    if (!(await checkUsername(username))) {
      setError("Auth Code 无效");
      setIsloading(false);
      return;
    }

    localStorage.setItem("username", username);
    router.push("/dash");
  }

  useEffect(() => {
    let rawHash = window.location.hash;
    if (rawHash.length < 2) return;

    rawHash = rawHash.substring(1);
    const hash = new URLSearchParams(rawHash);

    if (hash.has("error")) {
      setError("登录失败: " + hash.get("error_description"));
      return;
    }
    if (hash.has("code")) {
      const code = hash.get("code")!;
      setUsername(code);
      login();
      return;
    }
  }, []);

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

          <Button
            onClick={goMicrosoft}
            colorScheme="blue"
            variant="outline"
            m="auto"
            mt="5"
            display="block"
            w="full"
          >
            <Icon as={BsMicrosoft} mr="2"></Icon>
            使用微软登录
          </Button>

          <Divider my="5" />

          <Input
            mb="5"
            placeholder="Auth Code"
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
