import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import MainLayout from '@/components/layout/MainLayout';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '图床 - 简单、高效的图片托管服务 | 瀚海工艺',
  description: '快速上传、管理和分享您的图片, 支持多种上传方式和链接格式',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
