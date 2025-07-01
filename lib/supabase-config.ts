// Configuración que permite cambiar entre proyectos
const supabaseConfigs = {
  development: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL_DEV || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_DEV || "",
  },
  production: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL_PROD || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD || "",
  },
  shared: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL_SHARED || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_SHARED || "",
  },
}

const currentConfig = supabaseConfigs[process.env.NODE_ENV as keyof typeof supabaseConfigs] || supabaseConfigs.shared

export const supabaseUrl = currentConfig.url
export const supabaseAnonKey = currentConfig.anonKey
