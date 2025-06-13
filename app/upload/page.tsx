import UploadArea from '@/components/upload/UploadArea';

export const metadata = {
  title: '上传图片 - 图床 | 瀚海工艺',
  description: '上传您的图片, 支持拖拽、粘贴、URL等多种上传方式',
};

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">上传图片</h1>
        <p className="text-muted-foreground">
          支持拖拽上传、粘贴上传、URL上传等多种方式
        </p>
      </div>

      <UploadArea />

      <div className="max-w-3xl mx-auto bg-muted/30 rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">上传说明</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>支持的图片格式: PNG、JPG、GIF、WEBP、SVG等</li>
          <li>单个文件最大限制: 10MB</li>
          <li>上传的图片将自动移除EXIF信息, 保护您的隐私</li>
          <li>可以通过拖拽、粘贴、选择文件或URL等多种方式上传图片</li>
          <li>上传成功后, 可以在图库中查看和管理您的图片</li>
        </ul>
      </div>
    </div>
  );
}