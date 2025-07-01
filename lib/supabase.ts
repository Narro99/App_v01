import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Tipos para la base de datos
export interface Employee {
  id: string
  name: string
  email: string
  position: string
  salary: number
  hire_date: string
  department: string
  phone?: string
  address?: string
  profile_image?: string
  created_at: string
  updated_at: string
}

export interface Payroll {
  id: string
  employee_id: string
  period_start: string
  period_end: string
  base_salary: number
  overtime_hours: number
  overtime_rate: number
  bonuses: number
  deductions: number
  gross_pay: number
  net_pay: number
  taxes: number
  created_at: string
  employee?: Employee
}

export interface Attendance {
  id: string
  employee_id: string
  date: string
  check_in: string
  check_out?: string
  hours_worked: number
  status: "present" | "absent" | "late"
  created_at: string
  employee?: Employee
}
