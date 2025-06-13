"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Grid, List, Trash2, Copy, ExternalLink, Link2 } from 'lucide-react';
import useImageStore from '@/store/imageStore';
import uploadService from '@/lib/uploadService';
import { formatFileSize } from '@/lib/utils';
import { toast } from 'sonner';
import ImageLinkDialog from './ImageLinkDialog';
import { ImageInfo } from '@/lib/imageService';

export default function ImageGallery() {
  // 图片存储
  const images = useImageStore(state => state.images);
  const removeImage = useImageStore(state => state.removeImage);

  // 视图模式
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 搜索关键词
  const [searchTerm, setSearchTerm] = useState('');

  // 链接对话框
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);

  // 处理删除图片
  const handleDelete = async (image: ImageInfo) => {
    try {
      // 删除图片
      const success = await uploadService.deleteImage(image.url, image.deleteToken);

      if (success) {
        // 从存储中移除
        removeImage(image.id);
        toast.success('图片已删除');
      } else {
        toast.error('删除失败');
      }
    } catch (error) {
      toast.error('删除失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 处理复制链接
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => toast.success('链接已复制'))
      .catch(() => toast.error('复制失败'));
  };

  // 处理打开链接对话框
  const handleOpenLinkDialog = (image: ImageInfo) => {
    setSelectedImage(image);
    setLinkDialogOpen(true);
  };

  // 过滤图片
  const filteredImages = searchTerm
    ? images.filter(img =>
      img.filename.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : images;

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-64">
          <Input
            type="text"
            placeholder="搜索图片..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            title="网格视图"
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            title="列表视图"
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* 图片列表 */}
      {filteredImages.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {searchTerm ? '没有找到匹配的图片' : '还没有上传图片'}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        // 网格视图
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden group">
              <div className="relative aspect-square">
                <img
                  src={image.thumbnailUrl || image.url}
                  alt={image.filename}
                  className="w-full h-full object-cover"
                />

                {/* 悬停操作 */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyLink(image.url)}
                    title="复制链接"
                    className="h-8 w-8 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
                  >
                    <Copy size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenLinkDialog(image)}
                    title="生成链接"
                    className="h-8 w-8 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
                  >
                    <Link2 size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(image.url, '_blank')}
                    title="在新窗口打开"
                    className="h-8 w-8 bg-background/20 hover:bg-background/40 backdrop-blur-sm"
                  >
                    <ExternalLink size={14} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(image)}
                    title="删除图片"
                    className="h-8 w-8"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              <div className="p-2">
                <p className="text-xs truncate" title={image.customName || image.filename}>
                  {image.customName || image.filename}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(image.size)}
                  {image.customName && (
                    <span className="ml-1">· {image.filename}</span>
                  )}
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        // 列表视图
        <div className="space-y-2">
          {filteredImages.map((image) => (
            <Card key={image.id}>
              <div className="p-3 flex items-center gap-3">
                <div className="h-12 w-12 shrink-0">
                  <img
                    src={image.thumbnailUrl || image.url}
                    alt={image.filename}
                    className="h-full w-full object-cover rounded"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <p className="font-medium truncate" title={image.customName || image.filename}>
                    {image.customName || image.filename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(image.size)} ·
                    {new Date(image.uploadTime).toLocaleString()}
                    {image.customName && (
                      <span className="ml-1">· {image.filename}</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopyLink(image.url)}
                    title="复制链接"
                    className="h-8 w-8"
                  >
                    <Copy size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenLinkDialog(image)}
                    title="生成链接"
                    className="h-8 w-8"
                  >
                    <Link2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(image.url, '_blank')}
                    title="在新窗口打开"
                    className="h-8 w-8"
                  >
                    <ExternalLink size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(image)}
                    title="删除图片"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 链接对话框 */}
      <ImageLinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        image={selectedImage}
      />
    </div>
  );
}