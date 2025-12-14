import * as XLSX from 'xlsx'

export interface CityData {
  id?: number
  city_name: string
  year: string
  base_min: number
  base_max: number
  rate: number
}

export interface SalaryData {
  id?: number
  employee_id: string
  employee_name: string
  month: string
  salary_amount: number
}

/**
 * 读取 Excel 文件中的社保标准数据
 */
export function parseCitiesExcel(file: File): Promise<CityData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // 跳过表头，从第二行开始读取
        const cities: CityData[] = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[]
          if (row.length >= 6 && row[1]) {  // 确保行不为空且有足够的数据
            cities.push({
              city_name: String(row[1]).trim(),  // 第1列是城市名
              year: String(row[2]).trim(),      // 第2列是年份
              base_min: Number(row[4]) || 0,    // 第4列是基数下限
              base_max: Number(row[5]) || 0,    // 第5列是基数上限
              rate: Number(row[3]) || 0         // 第3列是比例
            })
          }
        }

        resolve(cities)
      } catch (error) {
        reject(new Error('解析社保标准数据失败：' + (error as Error).message))
      }
    }

    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsBinaryString(file)
  })
}

/**
 * 读取 Excel 文件中的工资数据
 */
export function parseSalariesExcel(file: File): Promise<SalaryData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // 跳过表头，从第二行开始读取
        const salaries: SalaryData[] = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[]
          if (row.length >= 5 && row[2]) {  // 确保行不为空且有足够的数据
            salaries.push({
              employee_id: String(row[1]).trim(),      // 第1列是员工ID
              employee_name: String(row[2]).trim(),    // 第2列是员工姓名
              month: String(row[3]).trim(),            // 第3列是月份
              salary_amount: Number(row[4]) || 0       // 第4列是工资金额
            })
          }
        }

        resolve(salaries)
      } catch (error) {
        reject(new Error('解析工资数据失败：' + (error as Error).message))
      }
    }

    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsBinaryString(file)
  })
}