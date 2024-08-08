import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Utilisation de FontAwesome pour les icônes

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

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.squareBoxes}>
        <TouchableOpacity
          style={[styles.squareBox, styles.createInvoice]}
          onPress={() => navigation.navigate('InvoiceForm')}
        >
          <Icon name="file-text" size={40} color={colors.contrast} style={styles.icon} />
          <Text style={styles.squareBoxText}>Créer une facture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.squareBox, styles.viewInvoices]}
          onPress={() => navigation.navigate('InvoiceList')}
        >
          <Icon name="list" size={40} color={colors.contrast} style={styles.icon} />
          <Text style={styles.squareBoxText}>Liste des factures</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  squareBoxes: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
  squareBox: {
    width: '100%',
    height: 120, // Augmenter la hauteur pour mieux accueillir les icônes
    backgroundColor: colors.contrast,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10, // Ajouter un peu de padding autour du contenu
  },
  createInvoice: {
    backgroundColor: colors.highlight,
  },
  viewInvoices: {
    backgroundColor: colors.primary,
  },
  squareBoxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.contrast,
    marginTop: 10, // Espacement entre l'icône et le texte
  },
  icon: {
    marginBottom: 10, // Espacement entre l'icône et le texte
  },
});

export default HomeScreen;
