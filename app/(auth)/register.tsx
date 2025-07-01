import { useState } from "react"
import { View, StyleSheet, Alert } from "react-native"
import { TextInput, Button, Text, Card } from "react-native-paper"
import { Link } from "expo-router"
import { signUp } from "../../lib/auth"

export default function RegisterScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)
    const result = await signUp(email, password)
    setLoading(false)

    if (result.success) {
      Alert.alert("Éxito", "Cuenta creada exitosamente. Revisa tu email para confirmar.")
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Crear Cuenta
          </Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button mode="contained" onPress={handleRegister} loading={loading} style={styles.button}>
            Crear Cuenta
          </Button>

          <View style={styles.linkContainer}>
            <Text>¿Ya tienes cuenta? </Text>
            <Link href="/(auth)/login">
              <Text style={styles.link}>Inicia Sesión</Text>
            </Link>
          </View>
        </Card.Content>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  link: {
    color: "#6200ee",
    fontWeight: "bold",
  },
})