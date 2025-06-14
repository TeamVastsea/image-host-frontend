"use client";

import { Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useImageLink from '@/hooks/useImageLink';
import { ImageInfo, LinkFormat, ImageFormat } from '@/lib/imageService';

interface ImageLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: ImageInfo | null;
}

export default function ImageLinkDialog({
  open,
  onOpenChange,
  image,
}: ImageLinkDialogProps) {
  // 图片格式
  const [imageFormat, setImageFormat] = useState<ImageFormat>(ImageFormat.ORIGINAL);
  // 链接格式
  const [linkFormat, setLinkFormat] = useState<LinkFormat>(LinkFormat.URL);

  // 使用链接钩子
  const { generatedLink, copied, generateLink, copyLink, resetCopied } = useImageLink();

  // 使用useEffect在对话框打开或图片/格式变更时生成链接
  useEffect(() => {
    if (open && image && image.url) {
      generateLink(image.url, { imageFormat, linkFormat });
    }
  }, [open, image, imageFormat, linkFormat, generateLink]);

  // 当对话框关闭时重置状态
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetCopied();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>图片链接</DialogTitle>
        </DialogHeader>

        {image && (
          <div className="w-full space-y-4 overflow-auto">
            {/* 图片预览 */}
            <div className="flex justify-center">
              <div className="w-32 h-32 overflow-hidden rounded border">
                <Image
                  src={image.thumbnailUrl || image.url}
                  alt={image.customName || image.filename}
                  className="w-full h-full object-cover"
                  width={128}
                  height={128}
                  unoptimized
                />
              </div>
            </div>

            {/* 图片名称 */}
            <div className="text-center">
              <p className="font-medium text-sm">
                {image.customName || image.filename}
              </p>
              {image.customName && (
                <p className="text-xs text-muted-foreground">
                  {image.filename}
                </p>
              )}
            </div>

            {/* 格式选项 */}
            <div className="space-y-3">
              {/* 图片格式 */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">图片格式</label>
                <Tabs
                  value={imageFormat}
                  onValueChange={(value) => setImageFormat(value as ImageFormat)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 h-8">
                    <TabsTrigger value={ImageFormat.ORIGINAL} className="text-xs">
                      原图
                    </TabsTrigger>
                    <TabsTrigger value={ImageFormat.THUMBNAIL} className="text-xs">
                      缩略图
                    </TabsTrigger>
                    <TabsTrigger value={ImageFormat.MEDIUM} className="text-xs">
                      中等
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* 链接格式 */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">链接格式</label>
                <Tabs
                  value={linkFormat}
                  onValueChange={(value) => setLinkFormat(value as LinkFormat)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 h-8">
                    <TabsTrigger value={LinkFormat.URL} className="text-xs">
                      URL
                    </TabsTrigger>
                    <TabsTrigger value={LinkFormat.HTML} className="text-xs">
                      HTML
                    </TabsTrigger>
                    <TabsTrigger value={LinkFormat.MARKDOWN} className="text-xs">
                      Markdown
                    </TabsTrigger>
                    <TabsTrigger value={LinkFormat.BBCODE} className="text-xs">
                      BBCode
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* 生成的链接 */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">生成的链接</label>
              <div className="flex items-center gap-2">
                <div className="flex-grow p-2 bg-muted rounded text-sm font-mono overflow-x-auto overscroll-none whitespace-nowrap" style={{'scrollbarWidth': 'none'}}>
                  {generatedLink}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyLink}
                  className="shrink-0"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}