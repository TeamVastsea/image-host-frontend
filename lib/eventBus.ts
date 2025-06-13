/**
 * 事件总线 - 实现发布订阅模式
 * 用于组件间通信, 实现解耦
 */

type EventCallback<T = unknown> = (...args: T[]) => void;

interface EventBus {
  on<T = unknown>(event: string, callback: EventCallback<T>): void;
  off<T = unknown>(event: string, callback: EventCallback<T>): void;
  emit<T = unknown>(event: string, ...args: T[]): void;
  once<T = unknown>(event: string, callback: EventCallback<T>): void;
}

class EventBusImpl implements EventBus {
  private events: Map<string, EventCallback<unknown>[]>;

  constructor() {
    this.events = new Map();
  }

  /**
   * 订阅事件
   * @param event 事件名称
   * @param callback 回调函数
   */
  on<T = unknown>(event: string, callback: EventCallback<T>): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)?.push(callback);
  }

  /**
   * 取消订阅
   * @param event 事件名称
   * @param callback 回调函数
   */
  off<T = unknown>(event: string, callback: EventCallback<T>): void {
    if (!this.events.has(event)) return;

    const callbacks = this.events.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
      // 如果没有回调函数了, 删除该事件
      if (callbacks.length === 0) {
        this.events.delete(event);
      }
    }
  }

  /**
   * 发布事件
   * @param event 事件名称
   * @param args 参数
   */
  emit<T = unknown>(event: string, ...args: T[]): void {
    if (!this.events.has(event)) return;

    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in event ${event} callback:`, error);
        }
      });
    }
  }

  /**
   * 订阅一次性事件
   * @param event 事件名称
   * @param callback 回调函数
   */
  once<T = unknown>(event: string, callback: EventCallback<T>): void {
    const onceCallback = (...args: T[]) => {
      callback(...args);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }
}

// 创建单例
const eventBus = new EventBusImpl();

// 定义事件类型
export enum EventTypes {
  UPLOAD_SUCCESS = 'upload:success',
  UPLOAD_ERROR = 'upload:error',
  UPLOAD_PROGRESS = 'upload:progress',
  IMAGE_DELETED = 'image:deleted',
  AUTH_LOGIN = 'auth:login',
  AUTH_LOGOUT = 'auth:logout',
}

export default eventBus;