import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import GeneratePDF from "./GeneratePDF";
import { getAuth } from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons"; // Assurez-vous d'avoir installé @expo/vector-icons

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

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true); // État pour le chargement
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) {
      navigation.replace("Login");
      return; // Assurer que le reste du code n'est pas exécuté si l'utilisateur n'est pas connecté
    }

    const q = query(
      collection(db, "invoices"),
      where("userId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invoicesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(invoicesData);
      setLoading(false); // Fin du chargement
    });

    return () => {
      unsubscribe();
      setLoading(false); // Assurer que le chargement est terminé si le composant est démonté
    };
  }, [db, navigation]);

  const confirmDelete = (id) => {
    Alert.alert(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cette facture ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => handleDelete(id),
        },
      ]
    );
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "invoices", id));
      Alert.alert("Succès", "La facture a été supprimée avec succès.");
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la suppression de la facture."
      );
      console.error("Erreur de suppression: ", error);
    }
  };

  const formatNumber = (number) => {
    return number.toLocaleString("fr-FR", { minimumFractionDigits: 0 });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.highlight} />
      ) : (
        <FlatList
          data={invoices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.invoiceItem}>
              <View style={styles.invoiceHeader}>
                <Text style={styles.invoiceText}>
                  Client: {item.clientName}
                </Text>
                <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                  <MaterialIcons name="delete" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.invoiceText}>
                {formatNumber(item.total)} F CFA
              </Text>
              <GeneratePDF invoice={item} />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: "center", // Centrer l'ActivityIndicator verticalement
  },
  invoiceItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: colors.contrast,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  invoiceText: {
    fontSize: 16,
    color: colors.primary,
  },
});

export default InvoiceList;
