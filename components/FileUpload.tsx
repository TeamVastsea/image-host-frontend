import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Center,
  Box,
  useColorModeValue,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AiFillFileAdd } from "react-icons/ai";

export default function Dropzone({ onFileAccepted }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onFileAccepted(acceptedFiles[0]);
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    multiple: false,
  });

  const dropText = isDragActive ? "松开鼠标开始上传" : "拖拽图片到此处或点击";

  const activeBg = useColorModeValue("gray.100", "gray.600");
  const borderColor = useColorModeValue(
    isDragActive ? "teal.300" : "gray.300",
    isDragActive ? "teal.500" : "gray.500"
  );

  return (
    <Box
      p={5}
      height={200}
      cursor="pointer"
      bg={isDragActive ? activeBg : "transparent"}
      _hover={{ bg: activeBg }}
      transition="background-color 0.2s ease"
      borderRadius={4}
      border="3px dashed"
      borderColor={borderColor}
      {...getRootProps()}
    >
      <VStack justify="center" h="full">
        <input {...getInputProps()} />
        <Icon as={AiFillFileAdd} fontSize="50" />
        <Text mt="2">{dropText}</Text>
      </VStack>
    </Box>
  );
}
