/**
 * 图片哈希计算Worker
 * 用于在后台线程计算图片的哈希值，避免主线程阻塞
 */

// 使用SHA-256算法计算哈希
async function calculateHash(data: ArrayBuffer): Promise<string> {
  // 使用Web Crypto API计算哈希
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // 将哈希值转换为十六进制字符串
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // 返回前10个字符作为短哈希
  return hashHex.substring(0, 10);
}

// 监听消息事件
self.addEventListener('message', async (event) => {
  try {
    const { id, data } = event.data;

    // 计算哈希值
    const hash = await calculateHash(data);

    // 发送计算结果
    self.postMessage({
      id,
      hash,
      success: true
    });
  } catch (error) {
    // 发送错误信息
    self.postMessage({
      id: event.data.id,
      error: error instanceof Error ? error.message : 'Hash calculation failed',
      success: false
    });
  }
});

// 导出空对象以满足TypeScript模块要求
export { };