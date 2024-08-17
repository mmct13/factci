import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";

// Couleurs de l'interface
const colors = {
  primary: "#333333",       // Noir charbon
  secondary: "#B3B6B7",     // Gris métallique
  success: "#F1C40F",       // Or éclatant
  error: "#E74C3C",         // Rouge vif
  background: "#F2F3F4",    // Gris très clair
  text: "#333333",          // Noir profond pour le texte
  contrast: "#FFFFFF",      // Blanc pur
  accent: "#F39C12",        // Or pour les accents
  highlight: "#E67E22",     // Orange pour les éléments en surbrillance
  darkBackground: "#2C3E50",// Bleu foncé
};


const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    let errors = {};
    if (!email) errors.email = "Adresse mail est requise.";
    if (!password) errors.password = "Mot de passe est requis.";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setLoading(true);
    setErrors({}); // Réinitialiser les erreurs avant l'envoi

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigation.navigate("Home"); // Remplace par la page appropriée après connexion
    } catch (error) {
      setLoading(false);
      switch (error.code) {
        case 'auth/invalid-credential':
          setErrors({ email: "L'adresse email ou le mot de passe est incorrect." });
          break;
        case 'auth/user-disabled':
          setErrors({ email: "Ce compte a été désactivé." });
          break;
        case 'auth/user-not-found':
          setErrors({ email: "Aucun utilisateur trouvé avec cette adresse email." });
          break;
        case 'auth/wrong-password':
          setErrors({ password: "Le mot de passe est incorrect." });
          break;
        case 'auth/email-already-in-use':
          setErrors({ email: "Cette adresse email est déjà utilisée." });
          break;
        case 'auth/weak-password':
          setErrors({ password: "Le mot de passe est trop faible." });
          break;
        case 'auth/operation-not-allowed':
          setErrors({ email: "Cette méthode d'authentification n'est pas autorisée." });
          break;
        case 'auth/expired-action-code':
          setErrors({ email: "Le code d'action a expiré." });
          break;
        case 'auth/invalid-action-code':
          setErrors({ email: "Le code d'action est invalide." });
          break;
        case 'auth/invalid-verification-code':
          setErrors({ email: "Le code de vérification est invalide." });
          break;
        case 'auth/invalid-verification-id':
          setErrors({ email: "L'ID de vérification est invalide." });
          break;
        case 'auth/user-token-expired':
          setErrors({ email: "Le jeton de l'utilisateur a expiré. Veuillez vous reconnecter." });
          break;
        case 'auth/cancelled-popup-request':
          setErrors({ email: "La demande de fenêtre contextuelle a été annulée." });
          break;
        case 'auth/popup-closed-by-user':
          setErrors({ email: "La fenêtre contextuelle a été fermée avant la fin de la connexion." });
          break;
        case 'auth/too-many-requests':
          setErrors({ email: "Trop de tentatives échouées. Veuillez réessayer plus tard." });
          break;
        default:
          setErrors({ email: "Une erreur inconnue est survenue." });
          break;
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Adresse mail"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
          secureTextEntry
          autoCapitalize="none"
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                <AntDesign name="login" size={20} color="white" />
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Pas de compte ? Inscrivez-vous</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.accent,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.highlight,
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
  },
  buttonText: {
    color: colors.darkBackground,
    fontWeight: "bold",
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 10,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "light",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});

export default LoginScreen;
