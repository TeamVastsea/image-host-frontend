"use client";

import { Trash2, Eye, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import useImageUpload from '@/hooks/useImageUpload';
import { UploadOptions } from '@/lib/uploadService';
import useStagingStore, { StagingImage } from '@/store/stagingStore';

interface StagingAreaProps {
  uploadOptions: UploadOptions;
}

export default function StagingArea({ uploadOptions }: StagingAreaProps) {
  // 暂存区状态
  const {
    images,
    removeImage,
    clearImages,
    updateCustomName,
    updateSelected,
    selectAll,
    getSelectedImages,
  } = useStagingStore();

  // 上传状态
  const {
    uploadStatus,
    uploadFile,
    uploadFiles,
    resetStatus,
  } = useImageUpload();

  // 预览对话框状态
  const [previewImage, setPreviewImage] = useState<StagingImage | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  // 处理自定义名称变更
  const handleCustomNameChange = (id: string, customName: string) => {
    updateCustomName(id, customName);
  };

  // 处理选中状态变更
  const handleSelectedChange = (id: string, selected: boolean) => {
    updateSelected(id, selected);
  };

  // 处理预览
  const handlePreview = (image: StagingImage) => {
    setPreviewImage(image);
    setPreviewOpen(true);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    removeImage(id);
  };

  // 处理上传
  const handleUpload = async () => {
    // 获取选中的图片
    const selectedImages = getSelectedImages();
    if (selectedImages.length === 0) return;

    // 如果只有一个图片, 使用单个上传
    if (selectedImages.length === 1) {
      const image = selectedImages[0];
      await uploadFile(image.file, {
        ...uploadOptions,
        metadata: { customName: image.customName }
      });
    } else {
      // 多个图片, 使用批量上传
      const files = selectedImages.map(image => image.file);
      // 创建一个映射, 将文件与自定义名称关联
      const customNames = selectedImages.reduce((map, image, index) => {
        map[index] = image.customName;
        return map;
      }, {} as Record<number, string>);

      await uploadFiles(files, {
        ...uploadOptions,
        metadata: { customNames: JSON.stringify(customNames) }
      });
    }

    // 上传成功后, 清空已上传的图片
    selectedImages.forEach(image => removeImage(image.id));
  };

  // 如果暂存区为空, 不显示组件
  if (images.length === 0) return null;

  return (
    <Card className="w-full max-w-3xl mx-auto mt-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">暂存区 ({images.length})</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectAll(true)}
              disabled={uploadStatus.isUploading}
            >
              全选
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectAll(false)}
              disabled={uploadStatus.isUploading}
            >
              取消全选
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => clearImages()}
              disabled={uploadStatus.isUploading}
            >
              清空
            </Button>
          </div>
        </div>

        {/* 暂存图片列表 */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex items-start gap-3 p-3 border rounded-md"
            >
              {/* 选择框 */}
              <div className="pt-1">
                <input
                  type="checkbox"
                  checked={image.selected}
                  onChange={(e) => handleSelectedChange(image.id, e.target.checked)}
                  disabled={uploadStatus.isUploading}
                  className="h-4 w-4"
                />
              </div>

              {/* 缩略图 */}
              <div
                className="h-16 w-16 shrink-0 cursor-pointer"
                onClick={() => handlePreview(image)}
              >
                <Image
                  src={image.previewUrl}
                  alt={image.customName}
                  className="h-full w-full object-cover rounded"
                  width={64}
                  height={64}
                  unoptimized
                />
              </div>

              {/* 信息和操作 */}
              <div className="flex-grow space-y-2">
                {/* 自定义名称 */}
                <div>
                  <Label htmlFor={`custom-name-${image.id}`} className="text-xs mb-1 block">
                    自定义名称
                  </Label>
                  <Input
                    id={`custom-name-${image.id}`}
                    type="text"
                    value={image.customName}
                    onChange={(e) => handleCustomNameChange(image.id, e.target.value)}
                    disabled={uploadStatus.isUploading}
                    className="h-8 text-sm"
                  />
                </div>

                {/* 文件信息 */}
                <div className="text-xs text-muted-foreground">
                  {image.file.name} · {formatFileSize(image.file.size)}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePreview(image)}
                  disabled={uploadStatus.isUploading}
                  className="h-8 w-8"
                  title="预览"
                >
                  <Eye size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(image.id)}
                  disabled={uploadStatus.isUploading}
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="删除"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* 上传按钮 */}
        <div className="mt-4">
          {uploadStatus.isUploading ? (
            <div className="w-full space-y-2">
              <p className="text-sm text-muted-foreground">
                上传中... {uploadStatus.progress}%
              </p>
              <Progress value={uploadStatus.progress} className="h-2" />
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={getSelectedImages().length === 0}
            >
              上传选中的图片 ({getSelectedImages().length})
            </Button>
          )}
        </div>

        {/* 错误信息 */}
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

        {/* 预览对话框 */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="sm:max-w-md">
            {previewImage && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Image
                    src={previewImage.previewUrl}
                    alt={previewImage.customName}
                    className="max-h-[60vh] max-w-full object-contain rounded"
                    width={800}
                    height={600}
                    unoptimized
                  />
                </div>
                <div className="text-center">
                  <p className="font-medium">{previewImage.customName}</p>
                  <p className="text-sm text-muted-foreground">
                    {previewImage.file.name} · {formatFileSize(previewImage.file.size)}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

// 辅助函数：格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}