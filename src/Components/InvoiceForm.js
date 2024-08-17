import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

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


const InvoiceForm = () => {
  const [clientName, setClientName] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    description: "",
    quantity: "",
    unitPrice: "",
  });
  const [erreurs, setErreurs] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigation = useNavigation();
  const db = getFirestore();
  const userId = getAuth().currentUser.uid;

  const addItem = () => {
    if (!newItem.description || !newItem.quantity || !newItem.unitPrice) {
      setErreurs({
        ...erreurs,
        newItem: "Veuillez remplir tous les champs.",
      });
      return;
    } else {
      setItems([...items, newItem]);
      setNewItem({ description: "", quantity: "", unitPrice: "" });
      setErreurs({});
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    let errors = {};

    if (!clientName) errors.clientName = "Le nom du client est requis.";
    if (items.length === 0)
      errors.items = "Veuillez ajouter au moins un article.";

    if (Object.keys(errors).length > 0) {
      setErreurs(errors);
      return;
    } else {
      try {
        setSubmitting(true);
        await addDoc(collection(db, "invoices"), {
          clientName,
          items,
          total: items.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0
          ),
          createdAt: new Date(),
          userId,
        });

        setSubmitting(false);
        navigation.navigate("InvoiceList");
      } catch (error) {
        console.error("Error adding invoice: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom du client</Text>
      <TextInput
        style={styles.input}
        value={clientName}
        onChangeText={setClientName}
        placeholder="Entrez le nom du client"
      />
      {erreurs.clientName && (
        <Text style={styles.error}>{erreurs.clientName}</Text>
      )}
      <Text style={styles.label}>Nouvel article</Text>
      <TextInput
        style={styles.input}
        placeholder="Designation"
        value={newItem.description}
        onChangeText={(text) => setNewItem({ ...newItem, description: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantité"
        value={newItem.quantity}
        keyboardType="numeric"
        onChangeText={(text) =>
          setNewItem({ ...newItem, quantity: text ? parseInt(text) : "" })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Prix unitaire"
        value={newItem.unitPrice}
        keyboardType="numeric"
        onChangeText={(text) =>
          setNewItem({ ...newItem, unitPrice: text ? parseFloat(text) : "" })
        }
      />
      {erreurs.newItem && <Text style={styles.error}>{erreurs.newItem}</Text>}
      <TouchableOpacity style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Ajouter l'article</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <View>
              <Text>{item.description}</Text>
              <Text>
                {item.quantity} x {item.unitPrice} F CFA
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(index)}>
              <Text style={styles.removeButton}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {erreurs.items && <Text style={styles.error}>{erreurs.items}</Text>}
      <TouchableOpacity style={styles.submitButton} disabled={submitting} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {submitting ? <ActivityIndicator size="small" color="white" /> : "Enregistrer la facture"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: colors.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: colors.contrast,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.highlight,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: colors.contrast,
    textAlign: "center",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: colors.success,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  submitButtonText: {
    color: colors.contrast,
    textAlign: "center",
    fontWeight: "bold",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    marginBottom: 10,
  },
  removeButton: {
    color: colors.error,
    fontWeight: "bold",
  },
  error: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 10,
  },
});

export default InvoiceForm;
