-- El propietario ejecuta esto para exportar el esquema
-- En Supabase SQL Editor

-- Exportar estructura de tablas
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public';

-- Exportar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public';
