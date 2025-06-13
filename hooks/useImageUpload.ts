import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import eventBus, { EventTypes } from '@/lib/eventBus';
import uploadService, { UploadOptions } from '@/lib/uploadService';
import useImageStore from '@/store/imageStore';

// 上传状态
export interface UploadStatus {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

// 上传钩子返回值
export interface UseImageUploadReturn {
  // 上传状态
  uploadStatus: UploadStatus;
  // 拖放区属性
  dropzoneProps: ReturnType<typeof useDropzone>['getRootProps'];
  // 拖放区输入属性
  dropzoneInputProps: ReturnType<typeof useDropzone>['getInputProps'] extends (props?: any) => infer R ? R : never;
  // 拖放区是否处于活动状态
  isDragActive: boolean;
  // 上传单个文件
  uploadFile: (file: File, options?: UploadOptions) => Promise<void>;
  // 上传多个文件
  uploadFiles: (files: File[], options?: UploadOptions) => Promise<void>;
  // 从URL上传
  uploadFromUrl: (url: string, options?: UploadOptions) => Promise<void>;
  // 重置上传状态
  resetStatus: () => void;
}

/**
 * 图片上传钩子
 * @param options 上传选项
 */
export default function useImageUpload(defaultOptions?: UploadOptions): UseImageUploadReturn {
  // 上传状态
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  // 图片存储
  const addImage = useImageStore(state => state.addImage);

  // 重置上传状态
  const resetStatus = useCallback(() => {
    setUploadStatus({
      isUploading: false,
      progress: 0,
      error: null,
    });
  }, []);

  // 上传单个文件
  const uploadFile = useCallback(async (file: File, options?: UploadOptions) => {
    try {
      setUploadStatus(prev => ({
        ...prev,
        isUploading: true,
        error: null,
      }));

      // 上传文件
      const result = await uploadService.uploadFile(file, {
        ...defaultOptions,
        ...options,
      });

      // 添加到图片存储（使用哈希值作为ID）
      addImage({
        id: result.hash, // 使用哈希值作为ID
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        filename: file.name,
        // 如果提供了自定义名称，则使用它
        customName: options?.metadata?.customName || '',
        size: file.size,
        uploadTime: Date.now(),
        deleteToken: result.deleteToken,
      });

      // 显示成功提示
      toast.success(`图片 ${file.name} 上传成功`);

      // 重置状态
      resetStatus();
    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : '上传失败',
      }));

      // 显示错误提示
      toast.error(error instanceof Error ? error.message : '上传失败');
    }
  }, [addImage, defaultOptions, resetStatus]);

  // 上传多个文件
  const uploadFiles = useCallback(async (files: File[], options?: UploadOptions) => {
    try {
      setUploadStatus(prev => ({
        ...prev,
        isUploading: true,
        error: null,
      }));

      // 上传文件
      const results = await uploadService.uploadMultiple(files, {
        ...defaultOptions,
        ...options,
      });

      // 添加到图片存储
      results.forEach((result, index) => {
        const file = files[index];
        let customName = '';
        
        // 确定自定义名称
        if (options?.metadata?.customNames && typeof options.metadata.customNames === 'object') {
          // 如果提供了自定义名称映射，使用对应索引的名称
          customName = options.metadata.customNames[index] || '';
        } else if (options?.metadata?.customName) {
          // 如果提供了单个自定义名称
          // 对于多文件上传，如果只有一个文件且有自定义名称，则使用它
          // 如果有多个文件，则只在自定义名称不为空时添加序号
          customName = files.length === 1 
            ? options.metadata.customName 
            : `${options.metadata.customName}_${index + 1}`;
        }
        
        addImage({
          // 使用哈希值作为ID
          id: result.hash,
          url: result.url,
          thumbnailUrl: result.thumbnailUrl,
          filename: file.name,
          customName,
          size: file.size,
          uploadTime: Date.now(),
          deleteToken: result.deleteToken,
        });
      });

      // 显示成功提示
      toast.success(`成功上传 ${results.length} 张图片`);

      // 重置状态
      resetStatus();
    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : '上传失败',
      }));

      // 显示错误提示
      toast.error(error instanceof Error ? error.message : '上传失败');
    }
  }, [addImage, defaultOptions, resetStatus]);

  // 从URL上传
  const uploadFromUrl = useCallback(async (url: string, options?: UploadOptions) => {
    try {
      setUploadStatus(prev => ({
        ...prev,
        isUploading: true,
        error: null,
      }));

      // 上传URL
      const result = await uploadService.uploadFromUrl(url, {
        ...defaultOptions,
        ...options,
      });

      // 从URL中提取文件名
      const filename = url.split('/').pop() || 'image.jpg';

      // 添加到图片存储
      addImage({
        id: result.hash, // 使用哈希值作为ID
        url: result.url,
        thumbnailUrl: result.thumbnailUrl,
        filename,
        // 如果提供了自定义名称，则使用它
        customName: options?.metadata?.customName || '',
        size: 0, // 无法获取URL图片大小
        uploadTime: Date.now(),
        deleteToken: result.deleteToken,
      });

      // 显示成功提示
      toast.success('URL图片上传成功');

      // 重置状态
      resetStatus();
    } catch (error) {
      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        error: error instanceof Error ? error.message : 'URL上传失败',
      }));

      // 显示错误提示
      toast.error(error instanceof Error ? error.message : 'URL上传失败');
    }
  }, [addImage, defaultOptions, resetStatus]);

  // 拖放区配置
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        // 如果提供了onDropCallback，则调用它获取元数据
        if (defaultOptions?.onDropCallback) {
          const metadata = defaultOptions.onDropCallback(acceptedFiles);
          // 检查是否阻止默认上传行为
          if (metadata.preventUpload) {
            return;
          }
          uploadFiles(acceptedFiles, {
            ...defaultOptions,
            metadata
          });
        } else {
          uploadFiles(acceptedFiles, defaultOptions);
        }
      }
    },
    disabled: uploadStatus.isUploading,
  });

  // 监听上传进度事件
  useEffect(() => {
    const handleProgress = (data: { filename: string; progress: number }) => {
      setUploadStatus(prev => ({
        ...prev,
        progress: data.progress,
      }));
    };

    const handleError = (error: string) => {
      setUploadStatus(prev => ({
        ...prev,
        isUploading: false,
        error,
      }));

      // 显示错误提示
      toast.error(error);
    };

    // 订阅事件
    eventBus.on(EventTypes.UPLOAD_PROGRESS, handleProgress);
    eventBus.on(EventTypes.UPLOAD_ERROR, handleError);

    // 清理订阅
    return () => {
      eventBus.off(EventTypes.UPLOAD_PROGRESS, handleProgress);
      eventBus.off(EventTypes.UPLOAD_ERROR, handleError);
    };
  }, []);

  // 监听粘贴事件
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (uploadStatus.isUploading) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      // 查找图片类型的数据
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            // 上传粘贴的图片
            uploadFile(file);
            break;
          }
        }
      }
    };

    // 添加全局粘贴事件监听
    document.addEventListener('paste', handlePaste);

    // 清理事件监听
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [uploadFile, uploadStatus.isUploading]);

  return {
    uploadStatus,
    dropzoneProps: getRootProps(),
    dropzoneInputProps: getInputProps(),
    isDragActive,
    uploadFile,
    uploadFiles,
    uploadFromUrl,
    resetStatus,
  };
}