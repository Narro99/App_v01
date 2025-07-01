"use client"

import { useEffect, useState } from "react"
import { Stack } from "expo-router"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { AuthProvider } from "../contexts/AuthContext"
import { PaperProvider } from "react-native-paper"
import { StatusBar } from "expo-status-bar"

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) {
    return null // O un componente de loading
  }

  return (
    <PaperProvider>
      <AuthProvider session={session}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  )
}
