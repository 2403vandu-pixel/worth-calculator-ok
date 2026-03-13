import Calculator from '@/components/calculator';
import VerticalAd from '@/components/VerticalAd';
import HorizontalBanner from '@/components/HorizontalBanner';

export default function Home() {
  return (
    <>
      {/* 竖向广告弹窗 */}
      <VerticalAd />
      
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 顶部横向 Banner */}
        <HorizontalBanner />
        
        {/* 主要内容 */}
        <Calculator />
      </main>
    </>
  );
}