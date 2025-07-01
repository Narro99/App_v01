import { supabase } from "./supabase"
import { Alert } from "react-native"

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      Alert.alert("Error", error.message)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    Alert.alert("Error", "Ocurrió un error inesperado")
    return { success: false, error }
  }
}

export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      Alert.alert("Error", error.message)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    Alert.alert("Error", "Ocurrió un error inesperado")
    return { success: false, error }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      Alert.alert("Error", error.message)
      return { success: false, error }
    }
    return { success: true }
  } catch (error) {
    Alert.alert("Error", "Ocurrió un error inesperado")
    return { success: false, error }
  }
}
