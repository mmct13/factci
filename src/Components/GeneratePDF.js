import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const GeneratePDF = ({ invoice }) => {
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
              font-family: Arial, sans-serif;
              padding: 20px;
              margin: 0;
              box-sizing: border-box;
            }
            .invoice-container {
              width: 100%;
              max-width: 800px;
              margin: auto;
              border: 1px solid #ddd;
              padding: 20px;
              box-sizing: border-box;
            }
            .header {
              text-align: right;
              margin-bottom: 40px;
            }
            .header .invoice-title {
              font-size: 24px;
              font-weight: bold;
              background-color: #E5EFF8;
              padding: 5px 15px;
              display: inline-block;
            }
            .company-info, .client-info {
              margin-bottom: 20px;
            }
            .company-info {
              float: left;
              width: 45%;
            }
            .client-info {
              float: right;
              width: 45%;
              text-align: right;
            }
            .clearfix {
              clear: both;
            }
            .invoice-details {
              margin-bottom: 30px;
            }
            .invoice-details strong {
              display: block;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 10px;
              text-align: left;
            }
            .totals {
              margin-top: 20px;
              text-align: right;
            }
            .totals div {
              margin-bottom: 5px;
            }
            .footer {
              text-align: left;
              font-size: 12px;
              color: gray;
              margin-top: 50px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="invoice-title">FACTURE</div>
            </div>
  
            <div class="company-info">
              <strong>${
                userData?.enterpriseName || "Le nom de votre société"
              }</strong>
              <p>${userData?.commune || "Adresse"}<br/>
              ${userData?.telephone || "Téléphone"} / ${
      userData?.email || "Email"
    }<br/>${userData?.siteweb || " "}</p>
            </div>
  
            <div class="client-info">
              <strong>${invoice.clientName}</strong>
            </div>
            <div class="clearfix"></div>
  
            <div class="invoice-details">
              <strong>Date:</strong> ${new Date(
                invoice.createdAt.seconds * 1000
              ).toLocaleDateString()}<br/>
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>Quantité</th>
                  <th>Désignation</th>
                  <th>Prix unitaire HT</th>
                  <th>Prix total HT</th>
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
              <div><strong>Total Hors Taxe :</strong> ${formatCurrency(
                invoice.total
              )} F CFA</div>             
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
    const { uri: tempUri } = await Print.printToFileAsync({ html: htmlContent });

    // Déplace le fichier vers un répertoire plus accessible
    const fileUri = FileSystem.documentDirectory + `facture_${new Date().getTime()}_${userData?.enterpriseName}.pdf`;

    try {
      await FileSystem.moveAsync({
        from: tempUri,
        to: fileUri,
      });

      // Ouvre le fichier PDF directement
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert("Erreur", "Le partage n'est pas disponible sur cet appareil.");
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
    padding: 20,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});

export default GeneratePDF;
