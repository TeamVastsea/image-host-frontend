import { useState, useCallback } from 'react';
import imageService, { LinkFormat, ImageFormat } from '@/lib/imageService';
import { copyToClipboard } from '@/lib/utils';
import { toast } from 'sonner';

// 链接选项
export interface LinkOptions {
  imageFormat: ImageFormat;
  linkFormat: LinkFormat;
}

// 链接钩子返回值
export interface UseImageLinkReturn {
  // 生成的链接
  generatedLink: string;
  // 是否已复制
  copied: boolean;
  // 生成链接
  generateLink: (imageUrl: string, options: LinkOptions) => void;
  // 复制链接
  copyLink: () => void;
  // 重置复制状态
  resetCopied: () => void;
}

/**
 * 图片链接钩子
 */
export default function useImageLink(): UseImageLinkReturn {
  // 生成的链接
  const [generatedLink, setGeneratedLink] = useState<string>('');
  // 是否已复制
  const [copied, setCopied] = useState<boolean>(false);
  
  // 生成链接
  const generateLink = useCallback((imageUrl: string, options: LinkOptions) => {
    // 获取指定格式的图片URL
    const formattedImageUrl = imageService.getImageUrl(imageUrl, options.imageFormat);
    
    // 生成指定格式的链接
    const link = imageService.generateLink(formattedImageUrl, options.linkFormat);
    
    // 设置生成的链接
    setGeneratedLink(link);
    
    // 重置复制状态
    setCopied(false);
  }, []);
  
  // 复制链接
  const copyLink = useCallback(() => {
    if (!generatedLink) return;
    
    // 复制到剪贴板
    copyToClipboard(generatedLink)
      .then(() => {
        // 设置复制状态
        setCopied(true);
        
        // 显示成功提示
        toast.success('链接已复制到剪贴板');
        
        // 3秒后重置复制状态
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch((error) => {
        // 显示错误提示
        toast.error('复制失败: ' + (error instanceof Error ? error.message : '未知错误'));
      });
  }, [generatedLink]);
  
  // 重置复制状态
  const resetCopied = useCallback(() => {
    setCopied(false);
  }, []);
  
  return {
    generatedLink,
    copied,
    generateLink,
    copyLink,
    resetCopied,
  };
}