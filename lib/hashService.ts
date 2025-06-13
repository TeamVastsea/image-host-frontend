import { generateId } from './utils';

// 哈希计算请求
interface HashRequest {
  id: string;
  resolve: (hash: string) => void;
  reject: (error: Error) => void;
}

/**
 * 哈希服务
 * 用于计算图片的哈希值，并检测重复图片
 */
class HashService {
  private worker: Worker | null = null;
  private requests: Map<string, HashRequest> = new Map();
  private hashCache: Map<string, string> = new Map(); // 缓存已计算的哈希值
  
  /**
   * 初始化哈希服务
   */
  constructor() {
    // 在浏览器环境中创建Worker
    if (typeof window !== 'undefined') {
      this.initWorker();
    }
  }
  
  /**
   * 初始化WebWorker
   */
  private initWorker(): void {
    try {
      // 创建Worker
      this.worker = new Worker(new URL('./workers/hashWorker.ts', import.meta.url));
      
      // 监听Worker消息
      this.worker.addEventListener('message', this.handleWorkerMessage);
    } catch (error) {
      console.error('Failed to initialize hash worker:', error);
    }
  }
  
  /**
   * 处理Worker消息
   */
  private handleWorkerMessage = (event: MessageEvent): void => {
    const { id, hash, success, error } = event.data;
    
    // 查找对应的请求
    const request = this.requests.get(id);
    if (!request) return;
    
    // 从请求列表中移除
    this.requests.delete(id);
    
    // 处理结果
    if (success) {
      // 缓存哈希值
      this.hashCache.set(hash, hash);
      request.resolve(hash);
    } else {
      request.reject(new Error(error || 'Hash calculation failed'));
    }
  };
  
  /**
   * 计算文件的哈希值
   * @param file 文件对象
   */
  async calculateHash(file: File): Promise<string> {
    // 如果Worker未初始化，则在主线程计算哈希
    if (!this.worker) {
      return this.calculateHashInMainThread(file);
    }
    
    return new Promise<string>(async (resolve, reject) => {
      try {
        // 读取文件内容
        const arrayBuffer = await file.arrayBuffer();
        
        // 创建请求ID
        const id = generateId();
        
        // 保存请求
        this.requests.set(id, { id, resolve, reject });
        
        // 发送消息到Worker
        this.worker?.postMessage({ id, data: arrayBuffer }, [arrayBuffer]);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  /**
   * 在主线程计算哈希（备用方案）
   * @param file 文件对象
   */
  private async calculateHashInMainThread(file: File): Promise<string> {
    try {
      // 读取文件内容
      const arrayBuffer = await file.arrayBuffer();
      
      // 使用Web Crypto API计算哈希
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      
      // 将哈希值转换为十六进制字符串
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // 返回前10个字符作为短哈希
      const shortHash = hashHex.substring(0, 10);
      
      // 缓存哈希值
      this.hashCache.set(shortHash, shortHash);
      
      return shortHash;
    } catch (error) {
      console.error('Hash calculation failed:', error);
      throw error;
    }
  }
  
  /**
   * 检查哈希值是否已存在（用于检测重复图片）
   * @param hash 哈希值
   */
  isHashExists(hash: string): boolean {
    return this.hashCache.has(hash);
  }
  
  /**
   * 添加哈希值到缓存
   * @param hash 哈希值
   */
  addHash(hash: string): void {
    this.hashCache.set(hash, hash);
  }
  
  /**
   * 清理资源
   */
  dispose(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.requests.clear();
  }
}

// 创建单例
const hashService = new HashService();
export default hashService;