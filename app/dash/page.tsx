"use client";

import {useRouter} from "next/navigation";
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    Heading,
    HStack,
    IconButton,
    Image,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    SimpleGrid,
    Skeleton,
    Text,
    useColorMode,
    useToast,
} from "@chakra-ui/react";

import {CheckIcon, CopyIcon, DeleteIcon, MoonIcon, SunIcon} from "@chakra-ui/icons";
import FileUpload from "@/components/FileUpload";
import {useEffect, useState} from "react";
import {deleteImage, getPlayerName, getUserImages, Image as IImage, upload} from "../api";

export default function Dashboard() {
    const router = useRouter();
    const {colorMode, toggleColorMode} = useColorMode();

    const [username, setUsername] = useState("");
    const [playerName, setPlayername] = useState("")
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<IImage[]>([]);

    useEffect(() => {
        if (!localStorage.getItem("username")) {
            router.push("/login");
            return;
        }
        setUsername(localStorage.getItem("username")!);
        getPlayerName(localStorage.getItem("username")!).then((res) => {
            setPlayername(res);
        })
        getUserImages(localStorage.getItem("username")!).then((res) => {
            console.log(res);
            setImages(res);
            setLoading(false);
        });
    }, []);

    const toast = useToast();

    function onFileAccepted(file: any) {
        const t = toast({
            position: "top",
            status: "loading",
            title: "正在上传图片",
        });
        console.log(file);
        upload(file, username)
            .then((res) => {
                setImages([res].concat(images));
                toast.update(t, {status: "success", description: "上传成功"});
                setTimeout(() => toast.close(t), 1000);
            }, (err) => {
                console.log(err);
                toast.update(t, {status: "error", description: "上传失败"})
            });
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

    function doDeleteImage() {
        const t = toast({
            position: "top",
            status: "loading",
            title: "正在删除图片",
        });

        deleteImage(username, currentImage!.id)
            .then((res) => {
                setImages(images.filter((image) => image.id !== currentImage!.id));

                toast.update(t, {status: "success", description: "图片删除成功！"});
                setTimeout(() => toast.close(t), 1000);

                setModalOpen(false)
            }, (err) => {
                console.log(err);
                toast.update(t, {status: "error", description: "图片删除失败！"});
            });
    }

    return (
        <Box p="10">
            <Skeleton isLoaded={!loading}>
                <Card p="15" m="auto" maxW={"1500"}>
                    <CardHeader>
                        <HStack justify={"space-between"}>
                            <Heading size="md">{playerName}, 您好！</Heading>
                            <HStack>
                                <IconButton
                                    aria-label="Color Scheme"
                                    icon={colorMode === "light" ? <MoonIcon/> : <SunIcon/>}
                                    onClick={toggleColorMode}
                                />
                                <Button colorScheme="red" onClick={exit}>
                                    退出
                                </Button>
                            </HStack>
                        </HStack>
                    </CardHeader>
                    <CardBody>
                        <SimpleGrid columns={{xl: 4, sm: 2, md: 3}} spacing={10}>
                            <FileUpload onFileAccepted={onFileAccepted}/>

                            {images.map((image) => (
                                <Image
                                    key={image.id}
                                    w="full"
                                    height={200}
                                    objectFit={"cover"}
                                    src={image.cover}
                                    onClick={() => {
                                        setModalOpen(true);
                                        setCurrentImage(image);
                                    }}
                                />
                            ))}
                        </SimpleGrid>
                    </CardBody>
                </Card>
            </Skeleton>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="3xl">
                <ModalOverlay/>
                <ModalContent mx={5}>
                    <ModalHeader>
                        <Heading size="md">图片详情</Heading>
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Image src={currentImage?.original}/>

                        <HStack mt="4">
                            <Text>图片链接：</Text>
                            <Link
                                flex="1"
                                color="blue.500"
                                isExternal
                                href={currentImage?.original}
                                target="_blank"
                                textOverflow="ellipsis"
                                overflow="hidden"
                                whiteSpace="nowrap"
                            >
                                {currentImage?.original}
                            </Link>

                            <IconButton
                                aria-label="copy"
                                onClick={copy}
                                color={copied ? "green.400" : ""}
                                icon={copied ? <CheckIcon/> : <CopyIcon/>}
                            />

                            <IconButton
                                aria-label="delete"
                                onClick={doDeleteImage}
                                color={"red.400"}
                                icon={<DeleteIcon/>}
                            />
                        </HStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
}
