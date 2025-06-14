"use client";

import { Moon, Sun, Upload, Image as ImageIcon, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuthStore from '@/store/authStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  // 主题切换
  const { theme, setTheme } = useTheme();
  // 挂载状态
  const [mounted, setMounted] = useState(false);
  // 当前路径
  const pathname = usePathname();
  // 认证状态
  const { user, isAuthenticated, logout } = useAuthStore();

  // 在客户端挂载后再渲染主题切换按钮
  useEffect(() => {
    setMounted(true);
  }, []);

  // 导航链接
  const navLinks = [
    { href: '/upload', label: '上传', icon: <Upload size={16} /> },
    { href: '/gallery', label: '图库', icon: <ImageIcon size={16} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <ImageIcon size={24} />
            <span>图床</span>
          </Link>

          {/* 导航链接 */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant={pathname === link.href ? 'default' : 'ghost'}
                size="sm"
                asChild
              >
                <Link href={link.href} className="flex items-center gap-1">
                  {link.icon}
                  {link.label}
                </Link>
              </Button>
            ))}
          </nav>

          {/* 右侧操作 */}
          <div className="flex items-center gap-2">
            {/* 主题切换 */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            )}

            {/* 用户菜单 */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>个人资料</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link href="/auth/login">登录</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="flex flex-col flex-grow container mx-auto px-4 py-6">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="border-t py-6 bg-muted/40">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} 图床. 保留所有权利.</p>
        </div>
      </footer>

      {/* 提示消息 */}
      <Toaster position="top-center" richColors />
    </div>
  );
}