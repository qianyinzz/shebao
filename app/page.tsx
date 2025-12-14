'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f9ff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
          五险一金计算器
        </h1>
        <p style={{ fontSize: '24px', textAlign: 'center', color: '#64748b', marginBottom: '60px' }}>
          智能计算企业社保公积金费用
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          <Link href="/upload" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              width: '350px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
            }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#3b82f6',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px', textAlign: 'center' }}>
                数据上传
              </h3>
              <p style={{ fontSize: '16px', color: '#6b7280', textAlign: 'center', lineHeight: '1.5' }}>
                批量导入城市社保标准与员工工资数据
              </p>
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#3b82f6', fontWeight: '600' }}>
                立即上传 →
              </p>
            </div>
          </Link>

          <Link href="/results" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              width: '350px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)'
            }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#10b981',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px', textAlign: 'center' }}>
                结果查询
              </h3>
              <p style={{ fontSize: '16px', color: '#6b7280', textAlign: 'center', lineHeight: '1.5' }}>
                查看详细的计算结果与数据分析报告
              </p>
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#10b981', fontWeight: '600' }}>
                查看结果 →
              </p>
            </div>
          </Link>
        </div>

        <footer style={{ textAlign: 'center', marginTop: '80px', color: '#9ca3af' }}>
          <p>&copy; 2024 五险一金计算器. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}