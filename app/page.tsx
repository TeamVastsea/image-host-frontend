import { Upload, Image as ImageIcon, Link2, Shield } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Home() {
  // 特性列表
  const features = [
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: '多种上传方式',
      description: '支持拖拽上传、粘贴上传、URL上传等多种方式, 满足不同场景需求。',
    },
    {
      icon: <ImageIcon className="h-8 w-8 text-primary" />,
      title: '图片管理',
      description: '提供图片分类、搜索、删除等功能, 轻松管理您的图片资源。',
    },
    {
      icon: <Link2 className="h-8 w-8 text-primary" />,
      title: '多格式链接',
      description: '支持生成HTML、Markdown、BBCode等多种格式的图片链接, 方便在不同平台使用。',
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: '隐私保护',
      description: '自动移除图片EXIF信息, 保护您的隐私安全。',
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* 英雄区域 */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          简单、高效的图片托管服务
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          快速上传、管理和分享您的图片, 支持多种上传方式和链接格式, 让图片分享变得更加简单。
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/upload" className="gap-2">
              <Upload size={18} />
              开始上传
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/gallery" className="gap-2">
              <ImageIcon size={18} />
              浏览图库
            </Link>
          </Button>
        </div>
      </section>

      {/* 特性区域 */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">强大的功能</h2>
          <p className="text-muted-foreground mt-2">为您提供全方位的图片托管解决方案</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border rounded-lg bg-card">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 使用流程 */}
      <section className="bg-muted/50 py-12 rounded-lg">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">简单三步, 开始使用</h2>
          <p className="text-muted-foreground mt-2">快速上手, 轻松分享</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mx-auto font-bold text-lg">1</div>
            <h3 className="text-xl font-semibold">上传图片</h3>
            <p className="text-muted-foreground">拖拽、粘贴或选择文件上传</p>
          </div>
          <div className="text-center space-y-2">
            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mx-auto font-bold text-lg">2</div>
            <h3 className="text-xl font-semibold">获取链接</h3>
            <p className="text-muted-foreground">自动生成多种格式的图片链接</p>
          </div>
          <div className="text-center space-y-2">
            <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mx-auto font-bold text-lg">3</div>
            <h3 className="text-xl font-semibold">分享使用</h3>
            <p className="text-muted-foreground">在任何平台分享您的图片</p>
          </div>
        </div>
      </section>

      {/* 行动召唤 */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">立即开始使用</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          免费注册, 开始享受便捷的图片托管服务
        </p>
        <Button size="lg" asChild>
          <Link href="/upload">开始上传</Link>
        </Button>
      </section>
    </div>
  );
}
