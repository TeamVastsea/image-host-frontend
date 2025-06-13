import { generateId } from './utils';
import eventBus, { EventTypes } from './eventBus';
import ExifReader from 'exifreader';

// 上传选项
export interface UploadOptions {
  removeExif?: boolean;
  addWatermark?: boolean;
  watermarkText?: string;
  generateThumbnail?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

// 默认上传选项
const defaultOptions: UploadOptions = {
  removeExif: true,
  addWatermark: false,
  watermarkText: '',
  generateThumbnail: true,
  maxWidth: 1920,
  maxHeight: 1080,
};

/**
 * 图片上传服务
 */
class UploadService {
  private baseUrl: string = 'https://image.vastsea.cc';
  private apiUrl: string = '/api/upload';
  
  /**
   * 从File对象上传图片
   * @param file 文件对象
   * @param options 上传选项
   */
  async uploadFile(file: File, options: UploadOptions = {}): Promise<{
    url: string;
    thumbnailUrl: string;
    deleteToken: string;
  }> {
    // 合并选项
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        throw new Error('只能上传图片文件');
      }
      
      // 处理图片（移除EXIF、添加水印等）
      const processedFile = await this.processImage(file, mergedOptions);
      
      // 模拟上传进度
      this.simulateUploadProgress(file.name);
      
      // 模拟上传延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 生成唯一文件名
      const uniqueFilename = `${generateId()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      
      // 模拟上传成功，返回URL和删除令牌
      // 注意：这里只是模拟，实际应该调用真实的上传API
      const imageUrl = `${this.baseUrl}/${uniqueFilename}`;
      const thumbnailUrl = `${this.baseUrl}/thumbnails/${uniqueFilename}`;
      const deleteToken = generateId(20);
      
      return {
        url: imageUrl,
        thumbnailUrl,
        deleteToken,
      };
    } catch (error) {
      // 发布上传错误事件
      eventBus.emit(
        EventTypes.UPLOAD_ERROR, 
        error instanceof Error ? error.message : '上传失败'
      );
      throw error;
    }
  }
  
  /**
   * 批量上传文件
   * @param files 文件列表
   * @param options 上传选项
   */
  async uploadMultiple(files: File[], options: UploadOptions = {}): Promise<{
    url: string;
    thumbnailUrl: string;
    deleteToken: string;
  }[]> {
    const results = [];
    
    for (const file of files) {
      try {
        const result = await this.uploadFile(file, options);
        results.push(result);
      } catch (error) {
        console.error(`上传文件 ${file.name} 失败:`, error);
        // 继续上传其他文件
      }
    }
    
    return results;
  }
  
  /**
   * 从URL上传图片
   * @param url 图片URL
   * @param options 上传选项
   */
  async uploadFromUrl(url: string, options: UploadOptions = {}): Promise<{
    url: string;
    thumbnailUrl: string;
    deleteToken: string;
  }> {
    try {
      // 模拟从URL获取图片
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('无法获取URL图片');
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL不是有效的图片');
      }
      
      const blob = await response.blob();
      const filename = url.split('/').pop() || 'image.jpg';
      const file = new File([blob], filename, { type: contentType });
      
      // 使用文件上传方法
      return await this.uploadFile(file, options);
    } catch (error) {
      // 发布上传错误事件
      eventBus.emit(
        EventTypes.UPLOAD_ERROR, 
        error instanceof Error ? error.message : 'URL上传失败'
      );
      throw error;
    }
  }
  
  /**
   * 处理图片（移除EXIF、添加水印等）
   * @param file 图片文件
   * @param options 处理选项
   */
  private async processImage(file: File, options: UploadOptions): Promise<File> {
    // 如果不需要处理，直接返回原文件
    if (!options.removeExif && !options.addWatermark && !options.generateThumbnail) {
      return file;
    }
    
    try {
      // 读取图片
      const arrayBuffer = await file.arrayBuffer();
      
      // 移除EXIF信息
      if (options.removeExif) {
        // 使用ExifReader读取EXIF信息（仅用于检测）
        const tags = ExifReader.load(arrayBuffer);
        console.log('EXIF信息已移除', tags);
        // 注意：实际移除EXIF需要更复杂的处理，这里只是模拟
      }
      
      // 添加水印
      if (options.addWatermark && options.watermarkText) {
        // 注意：实际添加水印需要使用Canvas，这里只是模拟
        console.log('已添加水印:', options.watermarkText);
      }
      
      // 生成缩略图
      if (options.generateThumbnail) {
        // 注意：实际生成缩略图需要使用Canvas，这里只是模拟
        console.log('已生成缩略图');
      }
      
      // 返回处理后的文件（这里简单返回原文件，实际应返回处理后的文件）
      return file;
    } catch (error) {
      console.error('处理图片失败:', error);
      // 如果处理失败，返回原文件
      return file;
    }
  }
  
  /**
   * 模拟上传进度
   * @param filename 文件名
   */
  private simulateUploadProgress(filename: string): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        // 发布上传进度事件
        eventBus.emit(EventTypes.UPLOAD_PROGRESS, {
          filename,
          progress,
        });
      } else {
        clearInterval(interval);
      }
    }, 200);
  }
  
  /**
   * 删除图片
   * @param url 图片URL
   * @param deleteToken 删除令牌
   */
  async deleteImage(url: string, deleteToken: string): Promise<boolean> {
    try {
      // 模拟删除延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 模拟删除成功
      // 注意：这里只是模拟，实际应该调用真实的删除API
      console.log(`已删除图片: ${url}, 令牌: ${deleteToken}`);
      
      return true;
    } catch (error) {
      console.error('删除图片失败:', error);
      return false;
    }
  }
}

// 创建单例
const uploadService = new UploadService();
export default uploadService;