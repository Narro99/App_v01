"use client"

import { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native"
import { Text, Card, Button, Appbar } from "react-native-paper"
import { MaterialIcons } from "@expo/vector-icons"
import { supabase, type Payroll } from "../../lib/supabase"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface DashboardStats {
  totalEmployees: number
  totalPayroll: number
  presentToday: number
  absentToday: number
}

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalPayroll: 0,
    presentToday: 0,
    absentToday: 0,
  })
  const [recentPayrolls, setRecentPayrolls] = useState<Payroll[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboardData = async () => {
    try {
      // Obtener estadísticas de empleados
      const { data: employees } = await supabase.from("employees").select("*")

      // Obtener nóminas del mes actual
      const currentMonth = format(new Date(), "yyyy-MM")
      const { data: payrolls } = await supabase
        .from("payrolls")
        .select("*, employee:employees(*)")
        .gte("period_start", `${currentMonth}-01`)
        .order("created_at", { ascending: false })
        .limit(5)

      // Obtener asistencia de hoy
      const today = format(new Date(), "yyyy-MM-dd")
      const { data: attendance } = await supabase.from("attendance").select("*").eq("date", today)

      // Calcular estadísticas
      const totalEmployees = employees?.length || 0
      const totalPayroll = payrolls?.reduce((sum, p) => sum + p.net_pay, 0) || 0
      const presentToday = attendance?.filter((a) => a.status === "present").length || 0
      const absentToday = totalEmployees - presentToday

      setStats({
        totalEmployees,
        totalPayroll,
        presentToday,
        absentToday,
      })

      setRecentPayrolls(payrolls || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    loadDashboardData()
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Dashboard" />
      </Appbar.Header>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Estadísticas principales */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialIcons name="people" size={32} color="#6200ee" />
              <Text variant="headlineSmall">{stats.totalEmployees}</Text>
              <Text variant="bodyMedium">Empleados</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialIcons name="payment" size={32} color="#03dac6" />
              <Text variant="headlineSmall">${stats.totalPayroll.toLocaleString()}</Text>
              <Text variant="bodyMedium">Nómina Total</Text>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialIcons name="check-circle" size={32} color="#4caf50" />
              <Text variant="headlineSmall">{stats.presentToday}</Text>
              <Text variant="bodyMedium">Presentes Hoy</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <MaterialIcons name="cancel" size={32} color="#f44336" />
              <Text variant="headlineSmall">{stats.absentToday}</Text>
              <Text variant="bodyMedium">Ausentes Hoy</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Nóminas recientes */}
        <Card style={styles.sectionCard}>
          <Card.Title title="Nóminas Recientes" />
          <Card.Content>
            {recentPayrolls.length > 0 ? (
              recentPayrolls.map((payroll) => (
                <View key={payroll.id} style={styles.payrollItem}>
                  <View style={styles.payrollInfo}>
                    <Text variant="bodyLarge">{payroll.employee?.name || "Empleado"}</Text>
                    <Text variant="bodyMedium" style={styles.payrollDate}>
                      {format(new Date(payroll.period_start), "dd MMM yyyy", { locale: es })}
                    </Text>
                  </View>
                  <Text variant="bodyLarge" style={styles.payrollAmount}>
                    ${payroll.net_pay.toLocaleString()}
                  </Text>
                </View>
              ))
            ) : (
              <Text>No hay nóminas recientes</Text>
            )}
          </Card.Content>
        </Card>

        {/* Acciones rápidas */}
        <Card style={styles.sectionCard}>
          <Card.Title title="Acciones Rápidas" />
          <Card.Content>
            <View style={styles.quickActions}>
              <Button
                mode="contained"
                icon="person-add"
                style={styles.actionButton}
                onPress={() => {
                  /* Navegar a agregar empleado */
                }}
              >
                Nuevo Empleado
              </Button>
              <Button
                mode="outlined"
                icon="payment"
                style={styles.actionButton}
                onPress={() => {
                  /* Navegar a nueva nómina */
                }}
              >
                Nueva Nómina
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  sectionCard: {
    marginBottom: 16,
  },
  payrollItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  payrollInfo: {
    flex: 1,
  },
  payrollDate: {
    color: "#666",
  },
  payrollAmount: {
    fontWeight: "bold",
    color: "#6200ee",
  },
  quickActions: {
    gap: 12,
  },
  actionButton: {
    marginVertical: 4,
  },
})
