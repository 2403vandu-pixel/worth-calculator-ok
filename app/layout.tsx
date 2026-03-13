import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageContext";
import { Analytics } from "@vercel/analytics/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Job Worth Calculator",
    template: "%s | Job Worth Calculator"
  },
  alternates: {
    languages: {
      "en-US": "/en",
      "zh-CN": "/",
    },
  },
  description: "这b班上得值不值 - 计算你的工作性价比 | Job Worth Calculator - Calculate your job's value",
  verification: {
    google: "_OQGiIpYz87USAsgJV2C07-JJhQ8myV_4GoM1kDjFic",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="_OQGiIpYz87USAsgJV2C07-JJhQ8myV_4GoM1kDjFic" />
        <meta name="baidu-site-verification" content="codeva-pEoMg5F0Cv" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7207313144293144" crossOrigin="anonymous"></script> -->
        <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
      </head>
      <body style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
        <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: '20px 0 24px', marginTop: 16 }}>
          <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            {[
              { href: 'https://offerselect.zippland.com/', label: 'OfferSelect' },
              { href: 'https://citycompare.zippland.com/', label: '城市对比' }, 
             { href: 'https://snapsolver.zippland.com/', label: 'AI笔试' }, 
               { href: 'https://perlerbeads.zippland.com/', label: '拼豆图纸' }, 
            ].map(({ href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: 'var(--text-tertiary)', textDecoration: 'none', fontWeight: 500 }}>
                {label}
              </a>
            ))}
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', opacity: 0.6 }}>by zippland.com</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
