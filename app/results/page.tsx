'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

interface Result {
  id: number
  employee_name: string
  avg_salary: number
  contribution_base: number
  company_fee: number
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    if (!isSupabaseConfigured()) {
      setError('Supabase 未配置，请检查环境变量')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase!
        .from('results')
        .select('*')
        .order('employee_name')

      if (error) {
        throw error
      }

      setResults(data || [])
    } catch (error: any) {
      setError(error.message || '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const totalCompanyFee = results.reduce((sum, result) => sum + result.company_fee, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">正在加载数据...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </nav>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              计算结果报告
            </span>
          </h1>
          <p className="text-xl text-gray-600 text-center mb-10">
            员工社保公积金费用明细与统计分析
          </p>

          {error ? (
            <div className="bg-red-50 text-red-800 px-6 py-4 rounded-xl mb-8">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">暂无计算结果</h3>
              <p className="text-gray-600 mb-8">请先在数据上传页面上传数据并执行计算</p>
              <Link
                href="/upload"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
              >
                去上传数据
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">员工总数</p>
                      <p className="text-3xl font-bold text-gray-800">{results.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">人均缴费基数</p>
                      <p className="text-2xl font-bold text-gray-800">
                        ¥{formatCurrency(results.reduce((sum, r) => sum + r.contribution_base, 0) / results.length)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">月缴纳总额</p>
                      <p className="text-2xl font-bold text-green-600">
                        ¥{formatCurrency(totalCompanyFee)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">详细计算结果</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          序号
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          员工姓名
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          平均工资
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          缴费基数
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          公司缴纳
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.map((result, index) => (
                        <tr key={result.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {result.employee_name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            ¥{formatCurrency(result.avg_salary)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            ¥{formatCurrency(result.contribution_base)}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                            ¥{formatCurrency(result.company_fee)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan={4} className="px-6 py-4 text-sm font-semibold text-gray-800">
                          合计
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600">
                          ¥{formatCurrency(totalCompanyFee)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}