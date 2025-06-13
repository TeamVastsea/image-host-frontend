"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, X, Link2, UploadCloud } from 'lucide-react';
import useImageUpload from '@/hooks/useImageUpload';
import { UploadOptions } from '@/lib/uploadService';
import useStagingStore from '@/store/stagingStore';
import StagingArea from './StagingArea';

export default function UploadArea() {
  // 上传选项
  const [uploadOptions, setUploadOptions] = useState<UploadOptions>({
    removeExif: true,
    addWatermark: false,
    watermarkText: '',
    generateThumbnail: true,
  });

  // URL输入
  const [urlInput, setUrlInput] = useState('');

  // 暂存区状态
  const { addImages } = useStagingStore();

  // 拖放区配置
  const {
    uploadStatus,
    dropzoneProps,
    dropzoneInputProps,
    isDragActive,
    resetStatus,
  } = useImageUpload({
    ...uploadOptions,
    onDropCallback: (files) => {
      // 当文件被拖放时，添加到暂存区而不是上传
      addImages(files);
      // 返回空对象，阻止默认上传行为
      return { preventUpload: true };
    }
  });

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // 添加到暂存区而不是直接上传
      addImages(Array.from(files));
      // 清空文件选择
      e.target.value = '';
    }
  };

  // 处理URL上传
  const handleUrlUpload = async () => {
    if (!urlInput) return;

    try {
      // 从URL获取图片
      const response = await fetch(urlInput);
      if (!response.ok) {
        throw new Error('无法获取URL图片');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL不是有效的图片');
      }

      const blob = await response.blob();
      const filename = urlInput.split('/').pop() || 'image.jpg';
      const file = new File([blob], filename, { type: contentType });

      // 添加到暂存区
      addImages([file]);

      // 清空URL输入
      setUrlInput('');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'URL上传失败');
    }
  };

  // 处理选项变更
  const handleOptionChange = (key: keyof UploadOptions, value: any) => {
    setUploadOptions(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6">
          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="file" className="flex items-center gap-2">
                <ImageIcon size={16} />
                文件上传
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link2 size={16} />
                URL上传
              </TabsTrigger>
            </TabsList>

            <TabsContent value="file" className="space-y-4">
              {/* 拖放区域 */}
              <div
                {...dropzoneProps}
                className={`
                border-2 border-dashed rounded-lg p-8
                flex flex-col items-center justify-center
                transition-colors cursor-pointer
                ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
                ${uploadStatus.isUploading ? 'pointer-events-none opacity-70' : ''}
              `}
              >
                <input {...dropzoneInputProps} />

                <UploadCloud
                  size={40}
                  className={`mb-4 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`}
                />

                {uploadStatus.isUploading ? (
                  <div className="w-full space-y-2">
                    <p className="text-center text-sm text-muted-foreground">
                      上传中... {uploadStatus.progress}%
                    </p>
                    <Progress value={uploadStatus.progress} className="h-2" />
                  </div>
                ) : (
                  <>
                    <p className="text-center mb-2">
                      <span className="font-medium">点击上传</span> 或拖放图片到此处
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      支持 PNG, JPG, GIF, WEBP, SVG 等格式，单个文件最大 10MB
                    </p>
                  </>
                )}
              </div>

              {/* 文件选择按钮 */}
              <div className="flex justify-center">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
                    <UploadCloud size={16} />
                    选择文件
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    disabled={uploadStatus.isUploading}
                  />
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-4">
              {/* URL输入 */}
              <div className="flex items-center gap-2">
                <Input
                  type="url"
                  placeholder="输入图片URL"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={uploadStatus.isUploading}
                />
                <Button
                  onClick={handleUrlUpload}
                  disabled={!urlInput || uploadStatus.isUploading}
                >
                  上传
                </Button>
              </div>

              {uploadStatus.isUploading && (
                <div className="w-full space-y-2">
                  <p className="text-sm text-muted-foreground">
                    上传中... {uploadStatus.progress}%
                  </p>
                  <Progress value={uploadStatus.progress} className="h-2" />
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* 上传选项 */}
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium">上传选项</h3>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remove-exif"
                  checked={uploadOptions.removeExif}
                  onChange={(e) => handleOptionChange('removeExif', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="remove-exif" className="text-sm cursor-pointer">
                  移除EXIF信息
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="add-watermark"
                  checked={uploadOptions.addWatermark}
                  onChange={(e) => handleOptionChange('addWatermark', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="add-watermark" className="text-sm cursor-pointer">
                  添加水印
                </Label>
              </div>

              {uploadOptions.addWatermark && (
                <div className="pl-6">
                  <Input
                    type="text"
                    placeholder="水印文字"
                    value={uploadOptions.watermarkText || ''}
                    onChange={(e) => handleOptionChange('watermarkText', e.target.value)}
                    className="text-sm"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="generate-thumbnail"
                  checked={uploadOptions.generateThumbnail}
                  onChange={(e) => handleOptionChange('generateThumbnail', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="generate-thumbnail" className="text-sm cursor-pointer">
                  生成缩略图
                </Label>
              </div>
            </div>
          </div>

          {uploadStatus.error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-center justify-between">
              <p className="text-sm">{uploadStatus.error}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetStatus}
                className="h-6 w-6"
              >
                <X size={14} />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <StagingArea uploadOptions={uploadOptions} />

    </>

  );
}