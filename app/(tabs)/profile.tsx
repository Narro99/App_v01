"use client"

import { useState } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { Text, Card, Button, Appbar, Avatar, List } from "react-native-paper"
import { useAuth } from "../../contexts/AuthContext"
import { signOut } from "../../lib/auth"

export default function ProfileScreen() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar Sesión",
        style: "destructive",
        onPress: async () => {
          setLoading(true)
          await signOut()
          setLoading(false)
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Perfil" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* Información del usuario */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text size={80} label={user?.email?.charAt(0).toUpperCase() || "U"} style={styles.avatar} />
            <Text variant="headlineSmall" style={styles.userName}>
              {user?.email || "Usuario"}
            </Text>
            <Text variant="bodyMedium" style={styles.userRole}>
              Administrador
            </Text>
          </Card.Content>
        </Card>

        {/* Opciones del perfil */}
        <Card style={styles.optionsCard}>
          <List.Item
            title="Configuración"
            description="Ajustes de la aplicación"
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              /* Navegar a configuración */
            }}
          />

          <List.Item
            title="Notificaciones"
            description="Gestionar notificaciones"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              /* Navegar a notificaciones */
            }}
          />

          <List.Item
            title="Reportes"
            description="Generar reportes"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              /* Navegar a reportes */
            }}
          />

          <List.Item
            title="Ayuda"
            description="Centro de ayuda"
            left={(props) => <List.Icon {...props} icon="help-circle" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {
              /* Navegar a ayuda */
            }}
          />
        </Card>

        {/* Información de la app */}
        <Card style={styles.infoCard}>
          <Card.Title title="Información de la App" />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Versión:</Text>
              <Text variant="bodyMedium">1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Última actualización:</Text>
              <Text variant="bodyMedium">Enero 2025</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Botón de cerrar sesión */}
        <Button
          mode="contained"
          onPress={handleSignOut}
          loading={loading}
          style={styles.signOutButton}
          buttonColor="#f44336"
        >
          Cerrar Sesión
        </Button>
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
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 16,
  },
  userName: {
    marginBottom: 4,
  },
  userRole: {
    color: "#666",
  },
  optionsCard: {
    marginBottom: 16,
  },
  infoCard: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  signOutButton: {
    marginTop: 16,
    marginBottom: 32,
  },
})
