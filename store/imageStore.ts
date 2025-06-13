import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import eventBus, { EventTypes } from '@/lib/eventBus';
import { generateId } from '@/lib/utils';

// 图片类型定义
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

// 图片存储状态
interface ImageState {
  images: ImageInfo[];
  isLoading: boolean;
  error: string | null;
  // 添加图片
  addImage: (image: Partial<Pick<ImageInfo, 'id'>> & Omit<ImageInfo, 'id'>) => void;
  // 删除图片
  removeImage: (id: string) => void;
  // 清空所有图片
  clearImages: () => void;
  // 设置加载状态
  setLoading: (isLoading: boolean) => void;
  // 设置错误信息
  setError: (error: string | null) => void;
}

// 创建图片存储
const useImageStore = create(
  persist(
    (set, get): ImageState => ({
      images: [],
      isLoading: false,
      error: null,

      // 添加图片
      addImage: (image) => {
        // 使用传入的 id（如果存在）, 否则生成新的 id
        const newImage: ImageInfo = {
          ...image,
          id: image.id || generateId(),
        };

        set((state: ImageState) => ({
          images: [newImage, ...state.images],
        }));

        // 发布图片上传成功事件
        eventBus.emit(EventTypes.UPLOAD_SUCCESS, newImage);
      },

      // 删除图片
      removeImage: (id) => {
        const { images } = get() as ImageState;
        const imageToRemove = images.find(img => img.id === id);

        set((state: ImageState) => ({
          images: state.images.filter((image) => image.id !== id),
        }));

        if (imageToRemove) {
          // 发布图片删除事件
          eventBus.emit(EventTypes.IMAGE_DELETED, imageToRemove);
        }
      },

      // 清空所有图片
      clearImages: () => {
        set({ images: [] });
      },

      // 设置加载状态
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      // 设置错误信息
      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'image-storage', // localStorage的key
      partialize: (state: ImageState) => ({ images: state.images }), // 只持久化images
    }
  )
);

export default useImageStore;