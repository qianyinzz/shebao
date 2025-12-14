import { supabase } from './supabase'

export interface CalculationResult {
  employee_name: string
  avg_salary: number
  contribution_base: number
  company_fee: number
}

/**
 * 计算社保公积金费用
 */
export async function calculateAndStoreResults(): Promise<void> {
  try {
    // 1. 清空 results 表
    await clearResultsTable()

    // 2. 获取所有工资数据
    const { data: salaries, error: salariesError } = await supabase
      .from('salaries')
      .select('*')

    if (salariesError) {
      throw new Error('获取工资数据失败：' + salariesError.message)
    }

    if (!salaries || salaries.length === 0) {
      throw new Error('没有找到工资数据，请先上传工资数据')
    }

    // 3. 按员工姓名分组，计算月平均工资
    const employeeGroups = salaries.reduce((acc: { [key: string]: any[] }, salary) => {
      const { employee_name, salary_amount, month } = salary
      if (!acc[employee_name]) {
        acc[employee_name] = []
      }
      acc[employee_name].push({ salary_amount, month })
      return acc
    }, {})

    // 4. 获取佛山的社保标准
    // 获取工资数据中的年份（取第一个员工的月份前4位）
    const firstEmployeeMonths = Object.values(employeeGroups)[0] as any[]
    const year = firstEmployeeMonths[0].month.substring(0, 4)

    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select('*')
      .eq('city_name', '佛山')
      .eq('year', year)
      .single()

    if (cityError || !cityData) {
      throw new Error(`获取佛山${year}年社保标准失败，请先上传该年份的社保标准数据`)
    }

    // 5. 计算每位员工的缴费基数和公司缴纳金额
    const results: CalculationResult[] = []

    for (const [employeeName, salaryRecords] of Object.entries(employeeGroups)) {
      const records = salaryRecords as any[]

      // 计算年度月平均工资
      const totalSalary = records.reduce((sum, record) => sum + record.salary_amount, 0)
      const avgSalary = totalSalary / records.length

      // 确定缴费基数
      let contributionBase: number
      if (avgSalary < cityData.base_min) {
        contributionBase = cityData.base_min
      } else if (avgSalary > cityData.base_max) {
        contributionBase = cityData.base_max
      } else {
        contributionBase = avgSalary
      }

      // 计算公司缴纳金额
      const companyFee = contributionBase * cityData.rate

      results.push({
        employee_name: employeeName,
        avg_salary: Math.round(avgSalary * 100) / 100,  // 保留两位小数
        contribution_base: Math.round(contributionBase * 100) / 100,
        company_fee: Math.round(companyFee * 100) / 100
      })
    }

    // 6. 批量插入 results 表
    const { error: insertError } = await supabase
      .from('results')
      .insert(results)

    if (insertError) {
      throw new Error('保存计算结果失败：' + insertError.message)
    }

    console.log(`成功计算并保存了 ${results.length} 位员工的社保费用`)
  } catch (error) {
    console.error('计算过程出错：', error)
    throw error
  }
}

/**
 * 清空 results 表
 */
async function clearResultsTable(): Promise<void> {
  const { error } = await supabase
    .from('results')
    .delete()
    .neq('id', 0)  // 删除所有记录

  if (error) {
    throw new Error('清空结果表失败：' + error.message)
  }
}