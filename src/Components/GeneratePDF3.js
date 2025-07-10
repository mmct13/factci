import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const GeneratePDF3 = ({ invoice }) => {
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
            font-family: 'Times New Roman', serif;
            padding: 40px;
            background-color: #fff;
          }
          .invoice-container {
            max-width: 900px;
            margin: auto;
            border: 1px solid #ccc;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          .logo-placeholder {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
          }
          .company-info, .client-info {
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
            border: 1px solid #000;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #2c3e50;
            color: white;
          }
          .totals {
            text-align: right;
            font-size: 16px;
            margin-top: 20px;
            border-top: 2px solid #000;
            padding-top: 10px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #333;
            margin-top: 40px;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="logo-placeholder">${userData?.enterpriseName || "Votre Société"}</div>
            <p>Facture émise le: ${new Date(invoice.createdAt.seconds * 1000).toLocaleDateString()}</p>
          </div>
          <div class="info-grid">
            <div class="company-info">
              <strong>${userData?.enterpriseName || "Votre Société"}</strong><br/>
              ${userData?.commune || "Adresse"}<br/>
              ${userData?.telephone || "Téléphone"} / ${userData?.email || "Email"}<br/>
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
                <th>Prix Unitaire HT</th>
                <th>Total HT</th>
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
                  <td>${formatCurrency(item.quantity * item.unitPrice)} F CFA</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <div class="totals">
            <strong>Total Hors Taxe: ${formatCurrency(invoice.total)} F CFA</strong>
          </div>
          <div class="footer">
            Facture générée par ${userData?.enterpriseName || "Votre Société"}
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
    backgroundColor: "#2c3e50",
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

export default GeneratePDF3;