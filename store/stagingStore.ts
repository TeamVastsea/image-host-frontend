import { create } from 'zustand';

import { generateId } from '@/lib/utils';

// 暂存图片类型定义
export interface StagingImage {
  id: string;           // 暂存ID
  file: File;           // 原始文件
  previewUrl: string;   // 预览URL
  customName: string;   // 自定义名称
  selected: boolean;    // 是否选中
}

// 暂存区状态
interface StagingState {
  images: StagingImage[];
  // 添加图片到暂存区
  addImage: (file: File, previewUrl: string) => void;
  // 添加多个图片到暂存区
  addImages: (files: File[]) => void;
  // 从暂存区移除图片
  removeImage: (id: string) => void;
  // 清空暂存区
  clearImages: () => void;
  // 更新图片自定义名称
  updateCustomName: (id: string, customName: string) => void;
  // 更新图片选中状态
  updateSelected: (id: string, selected: boolean) => void;
  // 全选/取消全选
  selectAll: (selected: boolean) => void;
  // 获取选中的图片
  getSelectedImages: () => StagingImage[];
}

// 创建暂存区存储
const useStagingStore = create<StagingState>((set, get) => ({
  images: [],

  // 添加图片到暂存区
  addImage: (file, previewUrl) => {
    const newImage: StagingImage = {
      id: generateId(),
      file,
      previewUrl,
      customName: file.name, // 默认使用文件名
      selected: true,        // 默认选中
    };

    set((state) => ({
      images: [...state.images, newImage],
    }));
  },

  // 添加多个图片到暂存区
  addImages: (files) => {
    const newImages = files.map(file => {
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);

      return {
        id: generateId(),
        file,
        previewUrl,
        customName: file.name, // 默认使用文件名
        selected: true,        // 默认选中
      };
    });

    set((state) => ({
      images: [...state.images, ...newImages],
    }));
  },

  // 从暂存区移除图片
  removeImage: (id) => {
    set((state) => {
      // 找到要删除的图片
      const imageToRemove = state.images.find(img => img.id === id);

      // 如果找到了图片, 释放预览URL
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return {
        images: state.images.filter((image) => image.id !== id),
      };
    });
  },

  // 清空暂存区
  clearImages: () => {
    // 释放所有预览URL
    get().images.forEach(image => {
      URL.revokeObjectURL(image.previewUrl);
    });

    set({ images: [] });
  },

  // 更新图片自定义名称
  updateCustomName: (id, customName) => {
    set((state) => ({
      images: state.images.map((image) =>
        image.id === id ? { ...image, customName } : image
      ),
    }));
  },

  // 更新图片选中状态
  updateSelected: (id, selected) => {
    set((state) => ({
      images: state.images.map((image) =>
        image.id === id ? { ...image, selected } : image
      ),
    }));
  },

  // 全选/取消全选
  selectAll: (selected) => {
    set((state) => ({
      images: state.images.map((image) => ({ ...image, selected })),
    }));
  },

  // 获取选中的图片
  getSelectedImages: () => {
    return get().images.filter(image => image.selected);
  },
}));

export default useStagingStore;