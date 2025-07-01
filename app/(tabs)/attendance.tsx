"use client"

import { useEffect, useState } from "react"
import { View, StyleSheet, FlatList, RefreshControl, Alert } from "react-native"
import { Text, Card, Appbar, FAB, Chip } from "react-native-paper"
import { router } from "expo-router"
import { supabase, type Attendance } from "../../lib/supabase"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function AttendanceScreen() {
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select(`
          *,
          employee:employees(*)
        `)
        .order("date", { ascending: false })
        .limit(50)

      if (error) throw error

      setAttendance(data || [])
    } catch (error) {
      console.error("Error loading attendance:", error)
      Alert.alert("Error", "No se pudo cargar la asistencia")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadAttendance()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    loadAttendance()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "#4caf50"
      case "late":
        return "#ff9800"
      case "absent":
        return "#f44336"
      default:
        return "#666"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "present":
        return "Presente"
      case "late":
        return "Tarde"
      case "absent":
        return "Ausente"
      default:
        return status
    }
  }

  const renderAttendance = ({ item }: { item: Attendance }) => (
    <Card style={styles.attendanceCard}>
      <Card.Content>
        <View style={styles.attendanceHeader}>
          <View style={styles.attendanceInfo}>
            <Text variant="titleMedium">{item.employee?.name || "Empleado"}</Text>
            <Text variant="bodyMedium" style={styles.date}>
              {format(new Date(item.date), "dd MMMM yyyy", { locale: es })}
            </Text>
          </View>
          <Chip
            mode="outlined"
            textStyle={{ color: getStatusColor(item.status) }}
            style={{ borderColor: getStatusColor(item.status) }}
          >
            {getStatusText(item.status)}
          </Chip>
        </View>

        <View style={styles.attendanceDetails}>
          <View style={styles.timeRow}>
            <Text variant="bodyMedium">Entrada:</Text>
            <Text variant="bodyMedium">{item.check_in ? format(new Date(item.check_in), "HH:mm") : "-"}</Text>
          </View>

          <View style={styles.timeRow}>
            <Text variant="bodyMedium">Salida:</Text>
            <Text variant="bodyMedium">{item.check_out ? format(new Date(item.check_out), "HH:mm") : "-"}</Text>
          </View>

          <View style={styles.timeRow}>
            <Text variant="bodyMedium">Horas Trabajadas:</Text>
            <Text variant="bodyMedium" style={styles.hoursWorked}>
              {item.hours_worked.toFixed(1)}h
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Asistencia" />
      </Appbar.Header>

      <View style={styles.content}>
        <FlatList
          data={attendance}
          renderItem={renderAttendance}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FAB icon="plus" style={styles.fab} onPress={() => router.push("/attendance/new")} />
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
  list: {
    paddingBottom: 80,
  },
  attendanceCard: {
    marginBottom: 12,
  },
  attendanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  attendanceInfo: {
    flex: 1,
  },
  date: {
    color: "#666",
  },
  attendanceDetails: {
    gap: 4,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  hoursWorked: {
    color: "#6200ee",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
})
