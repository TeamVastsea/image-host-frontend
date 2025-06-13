import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并tailwind类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * 生成随机ID
 */
export function generateId(length: number = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 静默失败，返回false
    return false;
  }
}

/**
 * 从URL中提取文件名
 */
export function getFilenameFromUrl(url: string): string {
  return url.substring(url.lastIndexOf("/") + 1);
}

/**
 * 从URL中提取哈希值
 */
export function getHashFromUrl(url: string): string {
  const filename = getFilenameFromUrl(url);
  // 如果文件名是10个字符的哈希值格式
  if (/^[a-f0-9]{10}$/.test(filename)) {
    return filename;
  }
  // 如果文件名包含哈希值（旧格式：hash-filename.ext）
  const hashMatch = filename.match(/^([a-f0-9]{10})-/);
  if (hashMatch) {
    return hashMatch[1];
  }
  return '';
}

/**
 * 生成不同格式的图片链接
 */
export function generateImageLinks(imageUrl: string): {
  direct: string;
  markdown: string;
  html: string;
  bbcode: string;
} {
  const filename = getFilenameFromUrl(imageUrl);
  return {
    direct: imageUrl,
    markdown: `![${filename}](${imageUrl})`,
    html: `<img src="${imageUrl}" alt="${filename}" />`,
    bbcode: `[img]${imageUrl}[/img]`,
  };
}