"use client"

import { Redirect, Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "../../contexts/AuthContext"

export default function TabLayout() {
  const { session } = useAuth()

  if (!session) {
    return <Redirect href="/(auth)/login" />
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6200ee",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: "Empleados",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="people" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="payroll"
        options={{
          title: "Nóminas",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="payment" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Asistencia",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="access-time" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}
