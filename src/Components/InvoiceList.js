import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
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
import { MaterialIcons } from "@expo/vector-icons";
import rien from "../../assets/rienici.png"; // Assurez-vous que le chemin est correct

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

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) {
      navigation.replace("Login");
      return;
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
      setLoading(false);
    });

    return () => {
      unsubscribe();
      setLoading(false);
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
      ) : invoices.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image source={rien} style={styles.emptyImage} />
          <Text style={styles.emptyText}>Aucune facture enregistrée</Text>
        </View>
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
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: colors.secondary,
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
