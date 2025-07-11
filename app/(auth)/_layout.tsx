import { Redirect, Stack } from "expo-router"
import { useAuth } from "../../contexts/AuthContext"

export default function AuthLayout() {
  const { session } = useAuth()

  if (session) {
    return <Redirect href="/(tabs)" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  )
}