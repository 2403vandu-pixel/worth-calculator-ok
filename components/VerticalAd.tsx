'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { isAdEnabled, getAdLink } from '@/utils/adConfig';

export default function VerticalAd() {
  const [isVisible, setIsVisible] = useState(false);
  const [imageExists, setImageExists] = useState(false);

  useEffect(() => {
    // 检查图片是否存在
    const img = new window.Image();
    img.onload = () => setImageExists(true);
    img.onerror = () => setImageExists(false);
    img.src = '/mainpage.png';
  }, []);

  useEffect(() => {
    // 检查广告是否应该显示
    if (!isAdEnabled() || !imageExists) {
      return;
    }

    // 延迟显示广告，避免影响首屏加载
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [imageExists]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative">
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 z-10 rounded-full bg-white p-1 shadow-lg hover:bg-gray-100 transition-colors"
          aria-label="关闭广告"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>

        {/* 广告内容 - 3:5 比例（宽:高） */}
        <a 
          href={getAdLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative bg-gray-200 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
          style={{
            width: 'min(300px, 60vw)',
            aspectRatio: '3/5'
          }}
        >
          {/* 实际广告图片 */}
          <Image 
            src="/mainpage.png"
            alt="广告"
            fill
            className="object-cover"
            priority
          />
        </a>
      </div>
    </div>
  );
}