import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome"; // Utilisation de FontAwesome pour les icônes
import create from "../../assets/create.png"; // Importer l'image create
import list from "../../assets/list.png"; // Importer l'image list

const colors = {
  primary: "#333333",
  secondary: "#B3B6B7",
  success: "#F1C40F",
  error: "#E74C3C",
  background: "#F2F3F4",
  text: "#333333",
  contrast: "#FFFFFF",
  accent: "#F39C12",
  highlight: "#E67E22",
  darkBackground: "#2C3E50",
};

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={create} style={styles.sideImage} />
        <TouchableOpacity
          style={[styles.squareBox, styles.createInvoice]}
          onPress={() => navigation.navigate("InvoiceForm")}
        >
          <Icon
            name="file-text"
            size={40}
            color={colors.contrast}
            style={styles.icon}
          />
          <Text style={styles.squareBoxText}>Créer une facture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rowr}>
        <Image source={list} style={styles.sideImagel} />
        <TouchableOpacity
          style={[styles.squareBox, styles.viewInvoices]}
          onPress={() => navigation.navigate("InvoiceList")}
        >
          <Icon
            name="list"
            size={40}
            color={colors.contrast}
            style={styles.icon}
          />
          <Text style={styles.squareBoxText}>Liste des factures</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50, // Espacement entre les lignes
  },
  rowr: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 50, // Espacement entre les lignes
  },
  squareBox: {
    width: "60%",
    height: 120,
    backgroundColor: colors.contrast,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flexDirection: "column", // Alignement de l'icône et du texte en colonne
  },
  createInvoice: {
    backgroundColor: colors.highlight,
  },
  viewInvoices: {
    backgroundColor: colors.primary,
  },
  squareBoxText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.contrast,
    marginTop: 10, // Espacement entre l'icône et le texte
  },
  icon: {
    marginBottom: 10, // Espacement entre l'icône et le texte
  },
  sideImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginRight: 20, // Espacement entre l'image et le bloc
  },
  sideImagel: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginLeft: 20, // Espacement entre l'image et le bloc
  },
});

export default HomeScreen;
