'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { parseCitiesExcel, parseSalariesExcel } from '../../lib/excel'
import { calculateAndStoreResults } from '../../lib/calculator'

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  const showMessage = (msg: string, type: 'success' | 'error' | 'info') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 5000)
  }

  const handleCitiesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.xlsx')) {
      showMessage('请上传 Excel 文件 (.xlsx)', 'error')
      return
    }

    if (!isSupabaseConfigured()) {
      showMessage('Supabase 未配置，请检查环境变量', 'error')
      return
    }

    setIsLoading(true)
    showMessage('正在处理社保标准数据...', 'info')

    try {
      const citiesData = await parseCitiesExcel(file)

      const { error: clearError } = await supabase!
        .from('cities')
        .delete()
        .neq('id', 0)

      if (clearError) {
        throw new Error('清空社保标准数据失败：' + clearError.message)
      }

      const { error: insertError } = await supabase!
        .from('cities')
        .insert(citiesData)

      if (insertError) {
        throw new Error('插入数据失败：' + insertError.message)
      }

      showMessage(`成功上传 ${citiesData.length} 条社保标准数据`, 'success')
      event.target.value = ''
    } catch (error) {
      showMessage((error as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSalariesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.xlsx')) {
      showMessage('请上传 Excel 文件 (.xlsx)', 'error')
      return
    }

    if (!isSupabaseConfigured()) {
      showMessage('Supabase 未配置，请检查环境变量', 'error')
      return
    }

    setIsLoading(true)
    showMessage('正在处理工资数据...', 'info')

    try {
      const salariesData = await parseSalariesExcel(file)

      const { error: clearError } = await supabase!
        .from('salaries')
        .delete()
        .neq('id', 0)

      if (clearError) {
        throw new Error('清空工资数据失败：' + clearError.message)
      }

      const { error: insertError } = await supabase!
        .from('salaries')
        .insert(salariesData)

      if (insertError) {
        throw new Error('插入数据失败：' + insertError.message)
      }

      showMessage(`成功上传 ${salariesData.length} 条工资数据`, 'success')
      event.target.value = ''
    } catch (error) {
      showMessage((error as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCalculate = async () => {
    if (!isSupabaseConfigured()) {
      showMessage('Supabase 未配置，请检查环境变量', 'error')
      return
    }

    setIsLoading(true)
    showMessage('正在执行计算...', 'info')

    try {
      await calculateAndStoreResults()
      showMessage('计算完成！已保存计算结果', 'success')
    } catch (error) {
      showMessage((error as Error).message, 'error')
    } finally {
      setIsLoading(false)
    }
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              数据管理中心
            </span>
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            上传社保标准与工资数据，智能计算企业社保费用
          </p>

          {message && (
            <div className={`mb-8 p-4 rounded-xl ${messageType === 'success' ? 'bg-green-50 text-green-800' : messageType === 'error' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
              {message}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">社保标准数据</h3>
                <p className="text-gray-600 text-sm">上传城市社保缴费标准</p>
              </div>
              <div className="mb-4 text-sm text-gray-600">
                <p className="mb-2">文件格式要求：</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>城市名称（如：佛山）</li>
                  <li>年份（如：2024）</li>
                  <li>社保缴费基数下限</li>
                  <li>社保缴费基数上限</li>
                  <li>综合缴纳比例（如：0.14）</li>
                </ul>
              </div>
              <label className="block">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleCitiesUpload}
                  disabled={isLoading}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-blue-500 transition-colors"
                />
              </label>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">员工工资数据</h3>
                <p className="text-gray-600 text-sm">批量导入员工工资信息</p>
              </div>
              <div className="mb-4 text-sm text-gray-600">
                <p className="mb-2">文件格式要求：</p>
                <ul className="list-disc list-inside space-y-1 text-gray-500">
                  <li>员工工号</li>
                  <li>员工姓名</li>
                  <li>工资月份（格式：YYYYMM）</li>
                  <li>工资金额</li>
                </ul>
              </div>
              <label className="block">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleSalariesUpload}
                  disabled={isLoading}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer hover:border-green-500 transition-colors"
                />
              </label>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? '正在处理...' : '开始智能计算'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}