import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import logo from "../../assets/logoA.png";
import recu from "../../assets/recu.png";
// Couleurs de l'interface
const colors = {
  primary: "#2A3B47",
  secondary: "#BDC3C7",
  success: "#27AE60",
  error: "#C0392B",
  background: "#ECF0F1",
  text: "#2A3B47",
  contrast: "#FFFFFF",
  accent: "#7F8C8D",
  highlight: "#4A90E2",
  darkBackground: "#1C2833",
};

const GetStarted = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={logo} style={styles.logo} />
        <Image source={recu} style={styles.recu} />
        <Text style={styles.slogan}>Votre allié pour des factures sans effort.</Text>

      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonW}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace("Register")}
        >
          <Text style={styles.buttonTextR}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: colors.background, // Utilise la couleur de fond
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 500, // Ajuste la largeur selon la taille de ton logo
    height: 200, // Ajuste la hauteur selon la taille de ton logo
    resizeMode: "contain", // Maintient les proportions de l'image
  },
  recu: {
    width: 400, // Ajuste la largeur selon la taille de ton logo
    height: 200, // Ajuste la hauteur selon la taille de ton logo
    resizeMode: "contain", // Maintient les proportions de l'image
  },
  slogan: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: colors.text, // Utilise la couleur du texte
  },
  buttonContainer: {
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: "center",
    width: "45%",
    borderColor: colors.primary,
    borderWidth: 2,
  },
  buttonW: {
    backgroundColor: colors.primary, // Utilise la couleur principale pour les boutons
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
    alignItems: "center",
    width: "45%",
  },
  buttonText: {
    color: colors.contrast, // Utilise la couleur de contraste pour le texte des boutons
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextR: {
    color: colors.primary, // Utilise la couleur de contraste pour le texte des boutons
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GetStarted;
