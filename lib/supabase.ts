import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 创建一个安全的 Supabase 客户端，在构建时返回 null
function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not provided. Please check your environment variables.')
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

// 检查 Supabase 是否已配置的辅助函数
export function isSupabaseConfigured(): boolean {
  return !!(supabase && supabaseUrl && supabaseAnonKey)
}