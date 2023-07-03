"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  useColorMode,
  Box,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  Divider,
  Text,
  Link,
  Button,
} from "@chakra-ui/react";

import { SunIcon, MoonIcon, CopyIcon } from "@chakra-ui/icons";
import FileUpload from "@/components/FileUpload";
import { useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  if (!localStorage.getItem("username")) {
    router.push("/login");
  }

  const username = localStorage.getItem("username");

  function upload(file) {
    console.log(file);
  }

  const [modalOpen, setModalOpen] = useState(false);

  function copy() { }

  return (
    <Box p="10">
      <Card p="15" m="auto" maxW={"1500"}>
        <CardHeader>
          <HStack justify={"space-between"}>
            <Heading size="md">{username}, 您好！</Heading>
            <IconButton
              aria-label="Color Scheme"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            />
          </HStack>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={3} spacing={10}>
            <FileUpload onFileAccepted={upload} />
            <Image
              w="full"
              height={200}
              objectFit={"cover"}
              onClick={() => setModalOpen(true)}
              fallbackSrc="https://via.placeholder.com/150"
            />
            <Image
              w="full"
              height={200}
              objectFit={"cover"}
              fallbackSrc="https://via.placeholder.com/150"
            />
          </SimpleGrid>
        </CardBody>
      </Card>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">图片详情</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image fallbackSrc="https://via.placeholder.com/2000" />

            <HStack mt="4">
              <Text>图片链接：</Text>
              <Link color="teal.500" isExternal>
                123
              </Link>

              <Box flex="1" />
              <IconButton
                aria-label="copy"
                onClick={copy}
                icon={<CopyIcon />}
              />
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
