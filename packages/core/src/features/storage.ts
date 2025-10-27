/**
 * Local storage and history
 * 本地存储和历史记录
 */

import { SignatureData } from '../types';

export interface StorageOptions {
  /** 存储键前缀 */
  keyPrefix?: string;
  /** 最大历史记录数 */
  maxHistory?: number;
  /** 是否自动保存 */
  autoSave?: boolean;
}

export interface SignatureRecord {
  /** 记录ID */
  id: string;
  /** 签名数据 */
  data: SignatureData;
  /** 创建时间 */
  createdAt: number;
  /** 缩略图 (base64) */
  thumbnail?: string;
  /** 标签 */
  tags?: string[];
}

export class SignatureStorage {
  private keyPrefix: string;
  private maxHistory: number;

  constructor(options: StorageOptions = {}) {
    this.keyPrefix = options.keyPrefix || 'signature_';
    this.maxHistory = options.maxHistory || 50;
  }

  /**
   * 保存签名
   */
  save(data: SignatureData, tags?: string[]): string {
    const id = this.generateId();
    const record: SignatureRecord = {
      id,
      data,
      createdAt: Date.now(),
      tags,
    };

    const key = this.getKey(id);
    localStorage.setItem(key, JSON.stringify(record));

    // 添加到历史列表
    this.addToHistory(id);

    return id;
  }

  /**
   * 加载签名
   */
  load(id: string): SignatureRecord | null {
    const key = this.getKey(id);
    const data = localStorage.getItem(key);

    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse signature data:', e);
      return null;
    }
  }

  /**
   * 删除签名
   */
  delete(id: string): void {
    const key = this.getKey(id);
    localStorage.removeItem(key);

    // 从历史列表中移除
    this.removeFromHistory(id);
  }

  /**
   * 获取历史记录列表
   */
  getHistory(): SignatureRecord[] {
    const historyKey = `${this.keyPrefix}history`;
    const historyData = localStorage.getItem(historyKey);

    if (!historyData) return [];

    try {
      const ids: string[] = JSON.parse(historyData);
      return ids.map(id => this.load(id)).filter(Boolean) as SignatureRecord[];
    } catch (e) {
      console.error('Failed to parse history:', e);
      return [];
    }
  }

  /**
   * 清空历史记录
   */
  clearHistory(): void {
    const historyKey = `${this.keyPrefix}history`;
    const historyData = localStorage.getItem(historyKey);

    if (historyData) {
      try {
        const ids: string[] = JSON.parse(historyData);
        ids.forEach(id => {
          const key = this.getKey(id);
          localStorage.removeItem(key);
        });
      } catch (e) {
        console.error('Failed to clear history:', e);
      }
    }

    localStorage.removeItem(historyKey);
  }

  /**
   * 搜索签名
   */
  search(query: string): SignatureRecord[] {
    const history = this.getHistory();

    return history.filter(record => {
      // 按标签搜索
      if (record.tags && record.tags.some(tag => tag.includes(query))) {
        return true;
      }

      // 按ID搜索
      if (record.id.includes(query)) {
        return true;
      }

      return false;
    });
  }

  /**
   * 添加到历史列表
   */
  private addToHistory(id: string): void {
    const historyKey = `${this.keyPrefix}history`;
    const historyData = localStorage.getItem(historyKey);

    let ids: string[] = [];
    if (historyData) {
      try {
        ids = JSON.parse(historyData);
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }

    // 添加新ID到开头
    ids.unshift(id);

    // 限制历史记录数量
    if (ids.length > this.maxHistory) {
      const removedIds = ids.splice(this.maxHistory);
      // 删除超出的记录
      removedIds.forEach(rid => {
        const key = this.getKey(rid);
        localStorage.removeItem(key);
      });
    }

    localStorage.setItem(historyKey, JSON.stringify(ids));
  }

  /**
   * 从历史列表中移除
   */
  private removeFromHistory(id: string): void {
    const historyKey = `${this.keyPrefix}history`;
    const historyData = localStorage.getItem(historyKey);

    if (!historyData) return;

    try {
      let ids: string[] = JSON.parse(historyData);
      ids = ids.filter(i => i !== id);
      localStorage.setItem(historyKey, JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to remove from history:', e);
    }
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取存储键
   */
  private getKey(id: string): string {
    return `${this.keyPrefix}${id}`;
  }

  /**
   * 获取存储使用情况
   */
  getStorageInfo(): {
    count: number;
    estimatedSize: number;
  } {
    const history = this.getHistory();
    let estimatedSize = 0;

    history.forEach(record => {
      const key = this.getKey(record.id);
      const data = localStorage.getItem(key);
      if (data) {
        estimatedSize += data.length;
      }
    });

    return {
      count: history.length,
      estimatedSize, // bytes
    };
  }
}

/**
 * 创建存储实例
 */
export function createStorage(options?: StorageOptions): SignatureStorage {
  return new SignatureStorage(options);
}

