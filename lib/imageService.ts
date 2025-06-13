import { generateId } from './utils';

// 图片格式类型
export enum ImageFormat {
  ORIGINAL = 'original',
  THUMBNAIL = 'thumbnail',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

// 图片链接格式类型
export enum LinkFormat {
  HTML = 'html',
  MARKDOWN = 'markdown',
  BBCODE = 'bbcode',
  URL = 'url',
}

// 图片分类
export interface ImageCategory {
  id: string;
  name: string;
  description?: string;
}

// 图片信息
export interface ImageInfo {
  id: string;
  url: string;
  thumbnailUrl: string;
  filename: string;
  customName?: string; // 用户自定义的图片名称
  size: number;
  width?: number;
  height?: number;
  format?: string;
  uploadTime: number;
  deleteToken: string;
  categoryId?: string;
}

/**
 * 图片服务
 */
class ImageService {
  private baseUrl: string = 'https://image.vastsea.cc';

  // 默认图片分类
  private defaultCategories: ImageCategory[] = [
    { id: 'default', name: '默认分类', description: '默认图片分类' },
    { id: 'screenshots', name: '截图', description: '屏幕截图' },
    { id: 'avatars', name: '头像', description: '个人头像' },
  ];

  /**
   * 获取图片分类列表
   */
  getCategories(): ImageCategory[] {
    // 从本地存储获取分类, 如果没有则使用默认分类
    const storedCategories = localStorage.getItem('image-categories');
    return storedCategories ? JSON.parse(storedCategories) : this.defaultCategories;
  }

  /**
   * 添加图片分类
   * @param name 分类名称
   * @param description 分类描述
   */
  addCategory(name: string, description?: string): ImageCategory {
    const categories = this.getCategories();

    // 检查分类名称是否已存在
    if (categories.some(c => c.name === name)) {
      throw new Error(`分类 "${name}" 已存在`);
    }

    // 创建新分类
    const newCategory: ImageCategory = {
      id: generateId(),
      name,
      description,
    };

    // 添加到分类列表
    const updatedCategories = [...categories, newCategory];
    localStorage.setItem('image-categories', JSON.stringify(updatedCategories));

    return newCategory;
  }

  /**
   * 删除图片分类
   * @param id 分类ID
   */
  deleteCategory(id: string): boolean {
    // 不允许删除默认分类
    if (id === 'default') {
      throw new Error('不能删除默认分类');
    }

    const categories = this.getCategories();
    const updatedCategories = categories.filter(c => c.id !== id);

    // 如果长度相同, 说明没有找到要删除的分类
    if (updatedCategories.length === categories.length) {
      return false;
    }

    localStorage.setItem('image-categories', JSON.stringify(updatedCategories));
    return true;
  }

  /**
   * 获取不同格式的图片URL
   * @param imageUrl 原始图片URL
   * @param format 图片格式
   */
  getImageUrl(imageUrl: string, format: ImageFormat = ImageFormat.ORIGINAL): string {
    // 从URL中提取哈希值或文件名
    const urlParts = imageUrl.split('/');
    const hashOrFilename = urlParts[urlParts.length - 1];

    // 检查是否是哈希值格式（10个字符的字母数字组合）
    // 注意：这里只是为了文档说明，实际上不需要检查格式

    // 根据格式生成URL
    switch (format) {
      case ImageFormat.THUMBNAIL:
        return `${this.baseUrl}/t/${hashOrFilename}`;
      case ImageFormat.MEDIUM:
        return `${this.baseUrl}/m/${hashOrFilename}`;
      case ImageFormat.ORIGINAL:
      default:
        return imageUrl;
    }
  }

  /**
   * 生成不同格式的图片链接
   * @param imageUrl 图片URL
   * @param format 链接格式
   */
  generateLink(imageUrl: string, format: LinkFormat = LinkFormat.URL): string {
    switch (format) {
      case LinkFormat.HTML:
        return `<img src="${imageUrl}" alt="Image" />`;
      case LinkFormat.MARKDOWN:
        return `![Image](${imageUrl})`;
      case LinkFormat.BBCODE:
        return `[img]${imageUrl}[/img]`;
      case LinkFormat.URL:
      default:
        return imageUrl;
    }
  }

  /**
   * 获取图片信息
   * @param url 图片URL
   */
  async getImageInfo(url: string): Promise<Partial<ImageInfo>> {
    try {
      // 模拟获取图片信息
      // 注意：实际应该从服务器获取或加载图片获取尺寸等信息
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];

      // 创建图片对象获取尺寸
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            url,
            filename,
            width: img.width,
            height: img.height,
            format: filename.split('.').pop()?.toLowerCase(),
          });
        };
        img.onerror = () => {
          resolve({
            url,
            filename,
          });
        };
        img.src = url;
      });
    } catch (error) {
      console.error('获取图片信息失败:', error);
      return { url };
    }
  }
}

// 创建单例
const imageService = new ImageService();
export default imageService;