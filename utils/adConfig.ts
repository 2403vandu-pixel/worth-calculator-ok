// 广告配置工具函数

export function isAdEnabled(): boolean {
  // 检查是否启用广告
  const enabled = process.env.NEXT_PUBLIC_AD_ENABLED;
  if (enabled === 'false') {
    return false;
  }

  // 检查广告结束时间
  const endTimeStr = process.env.NEXT_PUBLIC_AD_END_TIME;
  if (!endTimeStr) {
    // 如果没有设置结束时间，默认显示广告
    return true;
  }

  try {
    const endTime = new Date(endTimeStr);
    const now = new Date();
    
    // 如果当前时间超过了结束时间，则不显示广告
    return now <= endTime;
  } catch (error) {
    console.error('Invalid ad end time format:', endTimeStr);
    return true; // 时间格式错误时默认显示广告
  }
}

export function getAdLink(): string {
  return process.env.NEXT_PUBLIC_AD_LINK || 'https://www.google.com';
}