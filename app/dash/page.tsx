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
  Text,
  Link,
  Button,
  Skeleton,
} from "@chakra-ui/react";

import { SunIcon, MoonIcon, CopyIcon, CheckIcon } from "@chakra-ui/icons";
import FileUpload from "@/components/FileUpload";
import { useEffect, useState } from "react";
import { getUserImages, Image as IImage } from "../api";

export default function Dashboard() {
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<IImage[]>([]);
  useEffect(() => {
    if (!localStorage.getItem("username")) {
      router.push("/login");
      return;
    }
    setUsername(localStorage.getItem("username")!);
    getUserImages(username).then((res) => {
      setLoading(false);
      setImages(res);
    });
  });

  function upload(file: any) {
    console.log(file);
  }

  function exit() {
    localStorage.removeItem("username");
    router.push("/");
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<IImage | null>(null);

  const [copied, setCopied] = useState(false);

  let timeout: any;
  function copy() {
    navigator.clipboard.writeText(currentImage?.original!);
    setCopied(true);

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Box p="10">
      <Skeleton isLoaded={!loading}>
        <Card p="15" m="auto" maxW={"1500"}>
          <CardHeader>
            <HStack justify={"space-between"}>
              <Heading size="md">{username}, 您好！</Heading>
              <HStack>
                <IconButton
                  aria-label="Color Scheme"
                  icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                />
                <Button colorScheme="red" onClick={exit}>
                  退出
                </Button>
              </HStack>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ xl: 4, sm: 2, md: 3 }} spacing={10}>
              <FileUpload onFileAccepted={upload} />

              {images.map((image) => (
                <Image
                  w="full"
                  height={200}
                  objectFit={"cover"}
                  src={image.cover}
                  onClick={() => {
                    setModalOpen(true);
                    setCurrentImage(image);
                  }}
                  fallbackSrc="https://via.placeholder.com/150"
                />
              ))}
            </SimpleGrid>
          </CardBody>
        </Card>
      </Skeleton>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="3xl">
        <ModalOverlay />
        <ModalContent mx={5}>
          <ModalHeader>
            <Heading size="md">图片详情</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image src={currentImage?.original} />

            <HStack mt="4">
              <Text>图片链接：</Text>
              <Link
                color="blue.500"
                isExternal
                href={currentImage?.original}
                target="_blank"
              >
                {currentImage?.original}
              </Link>

              <Box flex="1" />
              <IconButton
                aria-label="copy"
                onClick={copy}
                color={copied ? "green.400" : ""}
                icon={copied ? <CheckIcon /> : <CopyIcon />}
              />
            </HStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
