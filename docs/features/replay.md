# 签名回放

动画重现签名绘制过程。

## 📹 简介

签名回放功能可以将保存的签名数据以动画形式重新播放，展示签名的绘制过程。适用于验证、演示、教学等场景。

## 🚀 基础用法

```typescript
import { createReplay } from '@ldesign/signature';

// 1. 获取签名数据
const signatureData = signature.toJSON();

// 2. 创建回放实例
const replay = createReplay(replayCanvas, signatureData);

// 3. 开始回放
replay.play();
```

## ⚙️ 配置选项

```typescript
replay.play({
  speed: 1,         // 回放速度倍数
  loop: false,      // 是否循环播放
  onFrame: (progress) => {
    console.log(`进度: ${(progress * 100).toFixed(0)}%`);
  },
  onComplete: () => {
    console.log('回放完成');
  }
});
```

## 🎯 控制方法

### play()

开始或继续回放。

```typescript
replay.play(options?: ReplayOptions): void
```

### pause()

暂停回放。

```typescript
replay.pause();
```

### resume()

恢复回放。

```typescript
replay.resume();
```

### stop()

停止回放。

```typescript
replay.stop();
```

### reset()

重置回放到开始。

```typescript
replay.reset();
```

### getProgress()

获取当前进度（0-1）。

```typescript
const progress = replay.getProgress();
console.log(`${(progress * 100).toFixed(0)}%`);
```

## 💡 使用示例

### 基础回放

```typescript
const replay = createReplay(canvas, signatureData);
replay.play();
```

### 2倍速回放

```typescript
replay.play({
  speed: 2,
  onComplete: () => {
    console.log('回放完成');
  }
});
```

### 循环播放

```typescript
replay.play({
  speed: 1,
  loop: true,
});
```

### 带进度条

```typescript
const progressBar = document.getElementById('progress');

replay.play({
  speed: 1,
  onFrame: (progress) => {
    progressBar.style.width = `${progress * 100}%`;
  },
  onComplete: () => {
    console.log('完成');
  }
});
```

### 控制面板

```html
<canvas id="replay-canvas" width="600" height="300"></canvas>

<div class="controls">
  <button id="play">播放</button>
  <button id="pause">暂停</button>
  <button id="stop">停止</button>
  <button id="reset">重置</button>
</div>

<div id="progress-bar"></div>

<script type="module">
  import { createReplay } from '@ldesign/signature';
  
  const replay = createReplay(canvas, signatureData);
  
  document.getElementById('play').onclick = () => {
    replay.play({
      speed: 1,
      onFrame: (p) => {
        document.getElementById('progress-bar').style.width = `${p * 100}%`;
      }
    });
  };
  
  document.getElementById('pause').onclick = () => replay.pause();
  document.getElementById('stop').onclick = () => replay.stop();
  document.getElementById('reset').onclick = () => replay.reset();
</script>
```

## 🎨 高级用法

### 可变速度回放

```typescript
let currentSpeed = 1;

function changeSpeed(speed: number) {
  currentSpeed = speed;
  replay.stop();
  replay.play({ speed });
}

// 按钮控制
document.getElementById('speed-1x').onclick = () => changeSpeed(1);
document.getElementById('speed-2x').onclick = () => changeSpeed(2);
document.getElementById('speed-05x').onclick = () => changeSpeed(0.5);
```

### 分段回放

```typescript
// 只回放前一半
const halfData = {
  ...signatureData,
  strokes: signatureData.strokes.slice(0, Math.floor(signatureData.strokes.length / 2)),
};

const replay = createReplay(canvas, halfData);
replay.play();
```

## 📚 API 参考

### ReplayOptions

```typescript
interface ReplayOptions {
  speed?: number;                      // 回放速度 (default: 1)
  loop?: boolean;                      // 循环播放 (default: false)
  onFrame?: (progress: number) => void; // 每帧回调
  onComplete?: () => void;             // 完成回调
}
```

### SignatureReplay 类

```typescript
class SignatureReplay {
  play(options?: ReplayOptions): void;
  pause(): void;
  resume(): void;
  stop(): void;
  reset(): void;
  getProgress(): number;
  destroy(): void;
}
```

## 🎯 使用场景

- **身份验证** - 回放签名过程验证真伪
- **教学演示** - 展示正确的签名方法
- **过程记录** - 记录签名绘制过程
- **防伪验证** - 通过回放检测异常

## 🔗 相关文档

- [基础用法](/guide/basic-usage)
- [高级功能](/guide/advanced-features)

