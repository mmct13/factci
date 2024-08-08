import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

const InvoiceForm = () => {
  const [clientName, setClientName] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    description: "",
    quantity: "",
    unitPrice: "",
  });
  const [erreurs, setErreurs] = useState({});
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
        navigation.navigate("InvoiceList");
      } catch (error) {
        console.error("Error adding invoice: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom du Client</Text>
      <TextInput
        style={styles.input}
        value={clientName}
        onChangeText={setClientName}
      />
      {erreurs.clientName && (
        <Text style={styles.error}>{erreurs.clientName}</Text>
      )}
      <Text style={styles.label}>Nouvel Article</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={newItem.description}
        onChangeText={(text) => setNewItem({ ...newItem, description: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantité"
        value={newItem.quantity}
        keyboardType="numeric"
        onChangeText={(text) =>
          setNewItem({ ...newItem, quantity: parseInt(text) })
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Prix Unitaire"
        value={newItem.unitPrice}
        keyboardType="numeric"
        onChangeText={(text) =>
          setNewItem({ ...newItem, unitPrice: parseFloat(text) })
        }
      />

      {erreurs.items && <Text style={styles.error}>{erreurs.items}</Text>}
      <TouchableOpacity style={styles.button} onPress={addItem}>
        <Text style={styles.buttonText}>Ajouter l'Article</Text>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.description}</Text>
            <Text>
              {item.quantity} x {item.unitPrice} F CFA
            </Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Enregistrer la Facture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#4A90E2", padding: 10, marginVertical: 10 },
  buttonText: { color: "white", textAlign: "center" },
  submitButton: { backgroundColor: "#27AE60", padding: 10, marginVertical: 10 },
  submitButtonText: { color: "white", textAlign: "center" },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  error: { color: "red", fontSize: 12, marginBottom: 10 },
});

export default InvoiceForm;
