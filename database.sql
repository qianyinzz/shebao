-- 创建 cities 表（城市社保标准）
CREATE TABLE cities (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  city_name TEXT NOT NULL,           -- 城市名（如"佛山"）
  year TEXT NOT NULL,                -- 年份（YYYY格式）
  base_min INT NOT NULL,            -- 社保基数下限
  base_max INT NOT NULL,            -- 社保基数上限
  rate FLOAT NOT NULL               -- 综合缴纳比例（如0.15）
);

-- 创建 salaries 表（员工工资）
CREATE TABLE salaries (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  employee_id TEXT NOT NULL,        -- 员工工号
  employee_name TEXT NOT NULL,      -- 员工姓名
  month TEXT NOT NULL,              -- 年份月份（YYYYMM格式）
  salary_amount INT NOT NULL        -- 该月工资金额
);

-- 创建 results 表（计算结果）
CREATE TABLE results (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  employee_name TEXT NOT NULL,      -- 员工姓名
  avg_salary FLOAT NOT NULL,        -- 年度月平均工资
  contribution_base FLOAT NOT NULL, -- 最终缴费基数
  company_fee FLOAT NOT NULL        -- 公司缴纳金额
);

-- 创建索引以提高查询性能
CREATE INDEX idx_cities_city_year ON cities(city_name, year);
CREATE INDEX idx_salaries_employee_name ON salaries(employee_name);
CREATE INDEX idx_salaries_month ON salaries(month);
CREATE INDEX idx_results_employee_name ON results(employee_name);

-- 可选：插入一条示例数据
-- INSERT INTO cities (city_name, year, base_min, base_max, rate) VALUES
-- ('佛山', '2024', 1900, 21000, 0.15);

-- 可选：设置行级安全策略（RLS）
-- ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE salaries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE results ENABLE ROW LEVEL SECURITY;

-- 创建允许公开读取的策略
-- CREATE POLICY "Enable read access for all users" ON cities FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON salaries FOR SELECT USING (true);
-- CREATE POLICY "Enable read access for all users" ON results FOR SELECT USING (true);

-- 创建允许所有插入操作的政策（仅开发环境使用）
-- CREATE POLICY "Enable insert for all users" ON cities FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable insert for all users" ON salaries FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable insert for all users" ON results FOR INSERT WITH CHECK (true);

-- 创建允许所有更新操作的政策（仅开发环境使用）
-- CREATE POLICY "Enable update for all users" ON cities FOR UPDATE USING (true);
-- CREATE POLICY "Enable update for all users" ON salaries FOR UPDATE USING (true);
-- CREATE POLICY "Enable update for all users" ON results FOR UPDATE USING (true);

-- 创建允许所有删除操作的政策（仅开发环境使用）
-- CREATE POLICY "Enable delete for all users" ON cities FOR DELETE USING (true);
-- CREATE POLICY "Enable delete for all users" ON salaries FOR DELETE USING (true);
-- CREATE POLICY "Enable delete for all users" ON results FOR DELETE USING (true);