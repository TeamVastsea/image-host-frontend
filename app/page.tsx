"use client";

import {Box, Button, Card, Heading, HStack, IconButton, Text, useColorMode,} from "@chakra-ui/react";

import {MoonIcon, SunIcon} from "@chakra-ui/icons";
import {useRouter} from "next/navigation";

export default function Home() {
    const {colorMode, toggleColorMode} = useColorMode();
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
            <title>图床｜瀚海工艺</title>
            <Card maxW="max" px={7} py={10} mb={10} textAlign="center">
                <Heading textAlign="center" w="max" m="auto">
                    瀚海工艺 - 图床
                </Heading>

                <Text maxW={300} opacity={0.8} mt={2}>
                    为瀚海工艺服务器的用户提供了一个简单且稳定的图床网站
                </Text>

                <HStack justify="center" mt={5}>
                    <Button onClick={() => router.push("/login")}>登录</Button>
                    <IconButton
                        aria-label="Color Scheme"
                        icon={colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
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
