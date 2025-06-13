import ImageGallery from '@/components/gallery/ImageGallery';

export const metadata = {
  title: '图片库 - 图床',
  description: '查看和管理您上传的所有图片',
};

export default function GalleryPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">图片库</h1>
        <p className="text-muted-foreground">
          查看和管理您上传的所有图片
        </p>
      </div>
      
      <ImageGallery />
    </div>
  );
}