import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '五险一金计算器',
  description: '企业社保公积金费用计算工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}