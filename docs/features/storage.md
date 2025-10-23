# 本地存储

将签名自动保存到浏览器本地存储。

## 💾 简介

本地存储功能使用 LocalStorage API 保存签名数据，支持历史记录管理、标签系统、搜索功能等。

## 🚀 基础用法

```typescript
import { createStorage } from '@ldesign/signature';

const storage = createStorage();

// 保存签名
const data = signature.toJSON();
const id = storage.save(data);

// 加载签名
const record = storage.load(id);
if (record) {
  signature.fromJSON(record.data);
}
```

## ⚙️ 配置选项

```typescript
const storage = createStorage({
  keyPrefix: 'my_sig_',    // 存储键前缀
  maxHistory: 50,          // 最大历史记录数
  autoSave: true,          // 自动保存
});
```

## 📋 API 方法

### save()

保存签名。

```typescript
const id = storage.save(data, tags?: string[]): string
```

**参数**:
- `data` - 签名数据
- `tags` - 可选标签数组

**返回**: 签名ID

**示例**:

```typescript
const data = signature.toJSON();
const id = storage.save(data, ['重要', '合同']);
```

### load()

加载签名。

```typescript
const record = storage.load(id: string): SignatureRecord | null
```

**返回**: 签名记录或 null

### getHistory()

获取所有历史记录。

```typescript
const history = storage.getHistory(): SignatureRecord[]
```

### search()

搜索签名。

```typescript
const results = storage.search(query: string): SignatureRecord[]
```

### delete()

删除签名。

```typescript
storage.delete(id: string): void
```

### clearHistory()

清空所有历史。

```typescript
storage.clearHistory(): void
```

### getStorageInfo()

获取存储信息。

```typescript
const info = storage.getStorageInfo();
// { count: number, estimatedSize: number }
```

## 💡 使用示例

### 自动保存

```typescript
const storage = createStorage();

signature.on('end', () => {
  const data = signature.toJSON();
  const id = storage.save(data, ['自动保存']);
  console.log('已保存:', id);
});
```

### 历史记录列表

```typescript
const history = storage.getHistory();

history.forEach(record => {
  console.log(`
    ID: ${record.id}
    时间: ${new Date(record.createdAt).toLocaleString()}
    标签: ${record.tags?.join(', ')}
  `);
});
```

### 搜索功能

```typescript
// 搜索带"合同"标签的签名
const contracts = storage.search('合同');

contracts.forEach(record => {
  console.log('找到合同签名:', record.id);
});
```

### 存储管理

```typescript
// 获取存储信息
const info = storage.getStorageInfo();
console.log(`存储了 ${info.count} 个签名`);
console.log(`占用空间约 ${(info.estimatedSize / 1024).toFixed(2)} KB`);

// 清理旧签名
const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

storage.getHistory().forEach(record => {
  if (record.createdAt < thirtyDaysAgo) {
    storage.delete(record.id);
  }
});
```

## 🔗 相关文档

- [高级功能](/guide/advanced-features)
- [最佳实践](/guide/best-practices)

