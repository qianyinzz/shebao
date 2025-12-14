# 五险一金计算器项目文档

## 项目概述
本项目是一个基于 Next.js 的五险一金计算器 Web 应用，用于根据员工工资数据和城市社保标准计算公司应缴纳的社保公积金费用。

## 技术栈
- **前端框架**: Next.js (App Router)
- **UI/样式**: Tailwind CSS
- **数据库/后端**: Supabase
- **文件上传**: 支持 Excel 格式 (.xlsx)

## 数据库设计

### cities 表（城市社保标准）
```sql
CREATE TABLE cities (
  id INT PRIMARY KEY,
  city_name TEXT NOT NULL,           -- 城市名（如"佛山"）
  year TEXT NOT NULL,                -- 年份（YYYY格式）
  base_min INT NOT NULL,            -- 社保基数下限
  base_max INT NOT NULL,            -- 社保基数上限
  rate FLOAT NOT NULL               -- 综合缴纳比例（如0.15）
);
```

### salaries 表（员工工资）
```sql
CREATE TABLE salaries (
  id INT PRIMARY KEY,
  employee_id TEXT NOT NULL,        -- 员工工号
  employee_name TEXT NOT NULL,      -- 员工姓名
  month TEXT NOT NULL,              -- 年份月份（YYYYMM格式）
  salary_amount INT NOT NULL        -- 该月工资金额
);
```

### results 表（计算结果）
```sql
CREATE TABLE results (
  id INT PRIMARY KEY,
  employee_name TEXT NOT NULL,      -- 员工姓名
  avg_salary FLOAT NOT NULL,        -- 年度月平均工资
  contribution_base FLOAT NOT NULL, -- 最终缴费基数
  company_fee FLOAT NOT NULL        -- 公司缴纳金额
);
```

## 核心业务逻辑

### 计算函数执行步骤
1. **数据准备阶段**
   - 清空 results 表中的旧数据
   - 从 salaries 表读取所有工资数据

2. **数据处理阶段**
   - 按 employee_name 分组，计算每位员工的年度月平均工资
   - 从 cities 表获取佛山对应年份的社保标准（base_min, base_max, rate）
   - 年份匹配逻辑：使用 salaries 表中 month 的前4位与 cities 表的 year 匹配

3. **基数计算阶段**
   - 对于每位员工：
     - 若 avg_salary < base_min：使用 base_min
     - 若 avg_salary > base_max：使用 base_max
     - 若 base_min ≤ avg_salary ≤ base_max：使用 avg_salary

4. **结果计算阶段**
   - company_fee = contribution_base × rate
   - 将结果存入 results 表

## 前端页面设计

### 1. 主页 (/)
- **页面类型**: 导航首页
- **布局**: 响应式卡片布局（大屏幕并排，小屏幕垂直排列）
- **组件**:
  - Header: 项目标题
  - Navigation Cards:
    - 卡片1: "数据上传" - 链接到 /upload
    - 卡片2: "结果查询" - 链接到 /results
  - Footer: 版权信息

### 2. 数据上传页 (/upload)
- **页面类型**: 数据管理页面
- **功能模块**:
  - 上传区域1: "上传社保标准数据"
    - 文件类型限制: .xlsx
    - 目标表: cities
    - 操作: 上传后清空 cities 表并插入新数据
  - 上传区域2: "上传员工工资数据"
    - 文件类型限制: .xlsx
    - 目标表: salaries
    - 操作: 上传后清空 salaries 表并插入新数据
  - 计算按钮: "执行计算并存储结果"
    - 触发核心计算逻辑
    - 显示计算进度/结果状态

### 3. 结果展示页 (/results)
- **页面类型**: 数据展示页面
- **功能**:
  - 自动加载 results 表数据
  - 响应式表格展示
  - 表头: 员工姓名、年度月平均工资、缴费基数、公司缴纳金额
  - 数据格式化: 金额显示为千分位格式（如 10,000.00）

## 开发任务清单 (Todo List)

### Phase 1: 项目初始化
- [ ] 创建 Next.js 项目
- [ ] 安装并配置 Tailwind CSS
- [ ] 安装必要的依赖包（supabase-js, xlsx等）
- [ ] 配置 Supabase 客户端
- [ ] 设置环境变量（SUPABASE_URL, SUPABASE_ANON_KEY）

### Phase 2: 数据库设置
- [ ] 在 Supabase 中创建项目
- [ ] 执行 SQL 创建三张表
- [ ] 设置表的基本权限（公开读取需要权限）

### Phase 3: 核心功能开发
- [ ] 创建 Supabase 操作模块（lib/supabase.js）
  - [ ] 实现清空表功能
  - [ ] 实现批量插入功能
  - [ ] 实现查询功能
- [ ] 创建 Excel 处理模块（lib/excel.js）
  - [ ] 实现 Excel 读取功能
  - [ ] 实现数据验证和转换
- [ ] 创建计算核心模块（lib/calculator.js）
  - [ ] 实现社保计算逻辑
  - [ ] 实现结果存储功能

### Phase 4: 页面开发
- [ ] 创建主页面 (/)
  - [ ] 实现响应式卡片布局
  - [ ] 添加导航链接
- [ ] 创建上传页面 (/upload)
  - [ ] 实现文件上传组件
  - [ ] 实现数据上传逻辑
  - [ ] 实现计算触发功能
  - [ ] 添加进度提示
- [ ] 创建结果页面 (/results)
  - [ ] 实现数据获取
  - [ ] 实现响应式表格
  - [ ] 实现数据格式化
  - [ ] 添加空数据状态提示

### Phase 5: 优化与测试
- [ ] 添加错误处理机制
- [ ] 添加加载状态提示
- [ ] 优化用户体验
- [ ] 测试完整功能流程

### Phase 6: 部署准备
- [ ] 配置生产环境变量
- [ ] 优化构建配置
- [ ] 准备部署文档

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
│   ├── supabase.js        # Supabase 操作
│   ├── excel.js           # Excel 处理
│   └── calculator.js      # 计算逻辑
├── components/            # React 组件
│   ├── Card.js           # 卡片组件
│   ├── UploadButton.js   # 上传按钮
│   ├── DataTable.js      # 数据表格
│   └── LoadingSpinner.js # 加载动画
├── public/               # 静态资源
├── .env.local           # 环境变量
├── next.config.js       # Next.js 配置
├── tailwind.config.js   # Tailwind 配置
└── package.json         # 项目依赖
```

## 注意事项
1. **数据验证**: 上传时需要验证 Excel 格式和数据完整性
2. **错误处理**: 所有异步操作都需要 try-catch 处理
3. **用户反馈**: 所有操作（上传、计算）都需要明确的成功/失败提示
4. **性能考虑**: 大量数据上传和计算时需要显示进度
5. **扩展性**: 代码结构要便于后续支持多城市功能