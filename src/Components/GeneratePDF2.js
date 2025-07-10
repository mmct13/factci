import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const GeneratePDF2 = ({ invoice }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, []);

  const generateHTMLContent = (invoice) => {
    const formatCurrency = (value) => {
      return value.toLocaleString("fr-FR", { minimumFractionDigits: 2 });
    };

    return `
    <html>
      <head>
        <style>
          body {
            font-family: Helvetica, sans-serif;
            padding: 30px;
            background-color: #f5f5f5;
          }
          .invoice-container {
            max-width: 800px;
            margin: auto;
            background-color: white;
            padding: 30px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          .header h1 {
            font-size: 28px;
            color: #007bff;
            margin: 0;
          }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .company-info, .client-info {
            width: 45%;
            font-size: 14px;
          }
          .client-info {
            text-align: right;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #007bff;
            color: white;
          }
          .totals {
            text-align: right;
            font-size: 16px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>Facture - ${new Date(
              invoice.createdAt.seconds * 1000
            ).toLocaleDateString()}</h1>
          </div>
          <div class="info-section">
            <div class="company-info">
              <strong>${
                userData?.enterpriseName || "Votre Société"
              }</strong><br/>
              ${userData?.commune || "Adresse"}<br/>
              ${userData?.telephone || "Téléphone"} / ${
      userData?.email || "Email"
    }<br/>
              ${userData?.siteweb || ""}
            </div>
            <div class="client-info">
              <strong>Client: ${invoice.clientName}</strong>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Quantité</th>
                <th>Désignation</th>
                <th>Prix Unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.quantity}</td>
                  <td>${item.description}</td>
                  <td>${formatCurrency(item.unitPrice)} F CFA</td>
                  <td>${formatCurrency(
                    item.quantity * item.unitPrice
                  )} F CFA</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="totals">
            <strong>Total: ${formatCurrency(invoice.total)} F CFA</strong>
          </div>
          <div class="footer">
            Merci pour votre confiance
          </div>
        </div>
      </body>
    </html>
    `;
  };

  const handleGeneratePDF = async () => {
    if (!userData) {
      console.log("User data not loaded yet");
      return;
    }

    const htmlContent = generateHTMLContent(invoice);
    const { uri: tempUri } = await Print.printToFileAsync({
      html: htmlContent,
    });

    const fileUri =
      FileSystem.documentDirectory +
      `facture_${new Date().getTime()}_${userData?.enterpriseName}.pdf`;

    try {
      await FileSystem.moveAsync({
        from: tempUri,
        to: fileUri,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert(
          "Erreur",
          "Le partage n'est pas disponible sur cet appareil."
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture du fichier PDF", error);
      Alert.alert("Erreur", "Impossible d'ouvrir le fichier PDF");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleGeneratePDF}>
        <Text style={styles.buttonText}>Générer PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 2,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default GeneratePDF2;
