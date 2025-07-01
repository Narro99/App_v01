"use client"

import { useEffect, useState } from "react"
import { View, StyleSheet, FlatList, RefreshControl, Alert } from "react-native"
import { Text, Card, Appbar, FAB, IconButton } from "react-native-paper"
import { router } from "expo-router"
import { supabase, type Payroll } from "../../lib/supabase"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function PayrollScreen() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadPayrolls = async () => {
    try {
      const { data, error } = await supabase
        .from("payrolls")
        .select(`
          *,
          employee:employees(*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      setPayrolls(data || [])
    } catch (error) {
      console.error("Error loading payrolls:", error)
      Alert.alert("Error", "No se pudieron cargar las nóminas")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadPayrolls()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    loadPayrolls()
  }

  const deletePayroll = async (id: string) => {
    Alert.alert("Confirmar eliminación", "¿Estás seguro de que quieres eliminar esta nómina?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.from("payrolls").delete().eq("id", id)

            if (error) throw error

            loadPayrolls()
            Alert.alert("Éxito", "Nómina eliminada correctamente")
          } catch (error) {
            console.error("Error deleting payroll:", error)
            Alert.alert("Error", "No se pudo eliminar la nómina")
          }
        },
      },
    ])
  }

  const renderPayroll = ({ item }: { item: Payroll }) => (
    <Card style={styles.payrollCard}>
      <Card.Content>
        <View style={styles.payrollHeader}>
          <View style={styles.payrollInfo}>
            <Text variant="titleMedium">{item.employee?.name || "Empleado"}</Text>
            <Text variant="bodyMedium" style={styles.period}>
              {format(new Date(item.period_start), "dd MMM", { locale: es })} -{" "}
              {format(new Date(item.period_end), "dd MMM yyyy", { locale: es })}
            </Text>
          </View>
          <View style={styles.payrollActions}>
            <IconButton icon="eye" size={20} onPress={() => router.push(`/payroll/${item.id}`)} />
            <IconButton icon="delete" size={20} iconColor="#f44336" onPress={() => deletePayroll(item.id)} />
          </View>
        </View>

        <View style={styles.payrollDetails}>
          <View style={styles.amountRow}>
            <Text variant="bodyMedium">Salario Base:</Text>
            <Text variant="bodyMedium">${item.base_salary.toLocaleString()}</Text>
          </View>

          {item.overtime_hours > 0 && (
            <View style={styles.amountRow}>
              <Text variant="bodyMedium">Horas Extra:</Text>
              <Text variant="bodyMedium">
                {item.overtime_hours}h × ${item.overtime_rate}
              </Text>
            </View>
          )}

          {item.bonuses > 0 && (
            <View style={styles.amountRow}>
              <Text variant="bodyMedium">Bonificaciones:</Text>
              <Text variant="bodyMedium" style={styles.bonus}>
                +${item.bonuses.toLocaleString()}
              </Text>
            </View>
          )}

          {item.deductions > 0 && (
            <View style={styles.amountRow}>
              <Text variant="bodyMedium">Deducciones:</Text>
              <Text variant="bodyMedium" style={styles.deduction}>
                -${item.deductions.toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.amountRow}>
            <Text variant="bodyMedium">Impuestos:</Text>
            <Text variant="bodyMedium" style={styles.deduction}>
              -${item.taxes.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.totalRow}>
          <Text variant="titleMedium">Total Neto:</Text>
          <Text variant="titleMedium" style={styles.netPay}>
            ${item.net_pay.toLocaleString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Nóminas" />
      </Appbar.Header>

      <View style={styles.content}>
        <FlatList
          data={payrolls}
          renderItem={renderPayroll}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FAB icon="plus" style={styles.fab} onPress={() => router.push("/payroll/new")} />
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
  payrollCard: {
    marginBottom: 12,
  },
  payrollHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  payrollInfo: {
    flex: 1,
  },
  period: {
    color: "#666",
  },
  payrollActions: {
    flexDirection: "row",
  },
  payrollDetails: {
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  bonus: {
    color: "#4caf50",
  },
  deduction: {
    color: "#f44336",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  netPay: {
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
