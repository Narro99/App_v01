"use client"

import { useEffect, useState } from "react"
import { View, StyleSheet, FlatList, RefreshControl, Alert } from "react-native"
import { Text, Card, Appbar, FAB, Avatar, IconButton, Searchbar } from "react-native-paper"
import { router } from "expo-router"
import { supabase, type Employee } from "../../lib/supabase"

export default function EmployeesScreen() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase.from("employees").select("*").order("name")

      if (error) throw error

      setEmployees(data || [])
      setFilteredEmployees(data || [])
    } catch (error) {
      console.error("Error loading employees:", error)
      Alert.alert("Error", "No se pudieron cargar los empleados")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.position.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredEmployees(filtered)
    } else {
      setFilteredEmployees(employees)
    }
  }, [searchQuery, employees])

  const onRefresh = () => {
    setRefreshing(true)
    loadEmployees()
  }

  const deleteEmployee = async (id: string) => {
    Alert.alert("Confirmar eliminación", "¿Estás seguro de que quieres eliminar este empleado?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.from("employees").delete().eq("id", id)

            if (error) throw error

            loadEmployees()
            Alert.alert("Éxito", "Empleado eliminado correctamente")
          } catch (error) {
            console.error("Error deleting employee:", error)
            Alert.alert("Error", "No se pudo eliminar el empleado")
          }
        },
      },
    ])
  }

  const renderEmployee = ({ item }: { item: Employee }) => (
    <Card style={styles.employeeCard}>
      <Card.Content>
        <View style={styles.employeeHeader}>
          <Avatar.Text
            size={50}
            label={item.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          />
          <View style={styles.employeeInfo}>
            <Text variant="titleMedium">{item.name}</Text>
            <Text variant="bodyMedium" style={styles.position}>
              {item.position}
            </Text>
            <Text variant="bodySmall" style={styles.department}>
              {item.department}
            </Text>
          </View>
          <View style={styles.employeeActions}>
            <IconButton icon="pencil" size={20} onPress={() => router.push(`/employee/${item.id}`)} />
            <IconButton icon="delete" size={20} iconColor="#f44336" onPress={() => deleteEmployee(item.id)} />
          </View>
        </View>
        <View style={styles.employeeDetails}>
          <Text variant="bodySmall">📧 {item.email}</Text>
          <Text variant="bodySmall">💰 ${item.salary.toLocaleString()}</Text>
        </View>
      </Card.Content>
    </Card>
  )

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Empleados" />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Buscar empleados..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <FlatList
          data={filteredEmployees}
          renderItem={renderEmployee}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FAB icon="plus" style={styles.fab} onPress={() => router.push("/employee/new")} />
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
  searchbar: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 80,
  },
  employeeCard: {
    marginBottom: 12,
  },
  employeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  employeeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  position: {
    color: "#6200ee",
    fontWeight: "500",
  },
  department: {
    color: "#666",
  },
  employeeActions: {
    flexDirection: "row",
  },
  employeeDetails: {
    marginTop: 8,
    gap: 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
})
