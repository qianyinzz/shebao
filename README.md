# 五险一金计算器

一个基于 Next.js + Supabase 的五险一金计算器 Web 应用，用于根据员工工资数据和城市社保标准计算企业应缴纳的社保公积金费用。

## 功能特点

- 📊 **数据上传**：支持上传 Excel 格式的社保标准和员工工资数据
- 🧮 **自动计算**：根据预设规则自动计算缴费基数和公司应缴费用
- 📈 **结果展示**：清晰展示计算结果，支持数据汇总和统计分析
- 🎨 **响应式设计**：适配各种屏幕尺寸，提供良好的用户体验

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI/样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **文件处理**: xlsx

## 快速开始

### 1. 环境准备

确保您的系统已安装：
- Node.js 18+
- npm 或 yarn

### 2. 项目安装

```bash
# 克隆或下载项目
cd shebao

# 安装依赖
npm install
```

### 3. 配置 Supabase

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 在项目设置中获取 URL 和 API Keys
3. 在项目根目录创建 `.env.local` 文件，填入配置：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 创建数据库表

在 Supabase 的 SQL 编辑器中执行 `database.sql` 文件中的 SQL 命令，创建三张数据表。

### 5. 启动项目

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

### 数据格式要求

#### 社保标准数据 (cities.xlsx)
| 列名 | 说明 | 示例 |
|------|------|------|
| 城市名 | 城市名称 | 佛山 |
| 年份 | YYYY 格式 | 2024 |
| 社保基数下限 | 数值 | 1900 |
| 社保基数上限 | 数值 | 21000 |
| 综合缴纳比例 | 小数（如 0.15 表示 15%） | 0.15 |

#### 员工工资数据 (salaries.xlsx)
| 列名 | 说明 | 示例 |
|------|------|------|
| 员工工号 | 员工编号 | EMP001 |
| 员工姓名 | 员工姓名 | 张三 |
| 年月份 | YYYYMM 格式 | 202401 |
| 工资金额 | 数值 | 8000 |

### 计算规则

1. **年度月平均工资**：按员工汇总全年工资，计算月平均值
2. **缴费基数确定**：
   - 低于基数下限：使用下限值
   - 高于基数上限：使用上限值
   - 在区间内：使用实际平均工资
3. **公司缴纳金额**：缴费基数 × 综合缴纳比例

### 操作流程

1. **数据上传**
   - 在主页点击"数据上传"或访问 /upload
   - 分别上传社保标准数据 (cities.xlsx) 和员工工资数据 (salaries.xlsx)
   - 点击"执行计算并存储结果"按钮

2. **结果查看**
   - 在主页点击"结果查询"或访问 /results
   - 查看计算结果表格和统计信息
   - 可查看员工明细和汇总数据

## 项目结构

```
shebao/
├── app/                    # Next.js App Router
│   ├── page.js            # 主页
│   ├── upload/            # 上传页面
│   │   └── page.js
│   ├── results/           # 结果页面
│   │   └── page.js
│   ├── layout.js          # 根布局
│   └── globals.css        # 全局样式
├── lib/                   # 核心功能模块
│   ├── supabase.ts        # Supabase 操作
│   ├── excel.ts           # Excel 处理
│   └── calculator.ts      # 计算逻辑
├── public/               # 静态资源
├── .env.local           # 环境变量
├── database.sql         # 数据库建表脚本
└── README.md           # 项目说明
```

## 注意事项

1. 上传数据前请确保 Excel 文件格式正确
2. 每次上传会清空原有数据
3. 计算结果基于佛山市的社保标准
4. 系统会根据工资数据的年份自动匹配对应年份的社保标准

## 开发说明

### 环境变量

开发环境需要配置以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 构建部署

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 扩展功能

系统架构支持以下扩展：

1. **多城市支持**： cities 表已包含 city_name 字段，可支持多个城市
2. **年度对比**：支持存储和展示不同年份的计算结果
3. **详细计算**：可扩展支持五险一金分别计算
4. **用户认证**：可集成 Supabase Auth 实现用户系统

## 许可证

MIT License