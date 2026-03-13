'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { isAdEnabled, getAdLink } from '@/utils/adConfig';

export default function HorizontalBanner() {
  const [imageExists, setImageExists] = useState(false);

  useEffect(() => {
    // 检查图片是否存在
    const img = new window.Image();
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
    img.src = '/banner.png';
  }, []);

  // 如果广告未启用或已过期，不显示
  if (!isAdEnabled()) {
    return null;
  }

  // 如果图片不存在，不显示
  if (!imageExists) {
    return null;
  }

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 py-2">
      <div className="max-w-4xl mx-auto px-4">
        {/* 横向 Banner - 7:1 比例 */}
        <a 
          href={getAdLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative w-full bg-gray-200 dark:bg-gray-800 overflow-hidden hover:opacity-90 transition-opacity duration-300 cursor-pointer rounded-lg shadow-sm"
          style={{
            aspectRatio: '7/1'
          }}
        >
          {/* 实际广告图片 */}
          <Image 
            src="/banner.png"
            alt="横幅广告"
            fill
            className="object-cover"
            priority
          />
        </a>
      </div>
    </div>
  );
}