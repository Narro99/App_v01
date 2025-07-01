import { useState } from "react"
import { View, StyleSheet, Alert } from "react-native"
import { TextInput, Button, Text, Card } from "react-native-paper"
import { Link } from "expo-router"
import { signIn } from "../../lib/auth"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos")
      return
    }

    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)

    if (!result.success) {
      Alert.alert("Error", "Credenciales incorrectas")
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Iniciar Sesión
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

          <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
            Iniciar Sesión
          </Button>

          <View style={styles.linkContainer}>
            <Text>¿No tienes cuenta? </Text>
            <Link href="/(auth)/register">
              <Text style={styles.link}>Regístrate</Text>
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