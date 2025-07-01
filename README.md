# Nóminas Mobile App

Una aplicación móvil completa para la gestión de nóminas, empleados y asistencia, desarrollada con React Native y Expo.

## 🚀 Características

### 📊 Dashboard
- Resumen de estadísticas principales
- Empleados totales y nómina total
- Asistencia del día (presentes/ausentes)
- Nóminas recientes
- Acciones rápidas

### 👥 Gestión de Empleados
- Lista completa de empleados
- Búsqueda y filtrado
- Agregar, editar y eliminar empleados
- Perfiles detallados con foto
- Información de contacto y salario

### 💰 Nóminas
- Cálculo automático de nóminas
- Salario base, horas extra, bonificaciones
- Deducciones e impuestos
- Historial completo de pagos
- Generación de recibos

### 📅 Control de Asistencia
- Registro de entrada y salida
- Cálculo automático de horas trabajadas
- Estados: presente, ausente, tarde
- Historial de asistencia
- Reportes por empleado

### 🔐 Autenticación
- Login seguro con Supabase
- Registro de nuevos usuarios
- Gestión de sesiones
- Protección de rutas

## 🛠️ Stack Tecnológico

- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **Supabase** - Backend y base de datos
- **React Native Paper** - Componentes UI
- **Expo Router** - Navegación
- **React Hook Form** - Manejo de formularios

## 📱 Funcionalidades Móviles

- **Cámara nativa** para fotos de perfil
- **Notificaciones push** para recordatorios
- **Exportación de PDFs** para recibos
- **Interfaz táctil optimizada**
- **Navegación nativa** con tabs y stack
- **Pull-to-refresh** en todas las listas
- **Búsqueda en tiempo real**

## 🚀 Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone <repository-url>
cd nominas-mobile
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env
# Editar .env con tus credenciales de Supabase
\`\`\`

4. **Ejecutar la aplicación**
\`\`\`bash
# iOS
npm run ios

# Android
npm run android

# Web (para desarrollo)
npm run web
\`\`\`

## 📊 Base de Datos

La aplicación utiliza las siguientes tablas en Supabase:

- **employees** - Información de empleados
- **payrolls** - Registros de nóminas
- **attendance** - Control de asistencia

## 🔧 Configuración de Supabase

1. Crear un proyecto en Supabase
2. Ejecutar las migraciones SQL
3. Configurar las políticas RLS
4. Obtener las claves de API
5. Configurar las variables de entorno

## 📱 Compilación para Producción

\`\`\`bash
# Compilar para iOS
eas build --platform ios

# Compilar para Android
eas build --platform android

# Publicar en las tiendas
eas submit
\`\`\`

## 🎨 Personalización

- Colores y temas en `theme.ts`
- Componentes reutilizables en `components/`
- Estilos globales en cada pantalla
- Iconos personalizables con Material Icons

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
