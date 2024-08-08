import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const GeneratePDF = ({ invoice }) => {

  const generateHTMLContent = (invoice) => {
    return `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 10px;
              text-align: left;
            }
            .header, .footer {
              text-align: center;
              margin-bottom: 20px;
            }
            .header {
              font-size: 24px;
              font-weight: bold;
            }
            .footer {
              font-size: 12px;
              color: gray;
            }
          </style>
        </head>
        <body>
          <div class="header">FACTURE</div>
          <div>
            <strong>Nom du Client:</strong> ${invoice.clientName}
          </div>
          <div>
            <strong>Date:</strong> ${new Date(invoice.createdAt.seconds * 1000).toLocaleDateString()}
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
              ${invoice.items.map(item => `
                <tr>
                  <td>${item.quantity}</td>
                  <td>${item.description}</td>
                  <td>${item.unitPrice} €</td>
                  <td>${item.quantity * item.unitPrice} €</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div>
            <strong>Total Hors Taxe:</strong> ${invoice.total} €
          </div>
          <div>
            <strong>TVA à 20%:</strong> ${(invoice.total * 0.2).toFixed(2)} €
          </div>
          <div>
            <strong>Total TTC en euros:</strong> ${(invoice.total * 1.2).toFixed(2)} €
          </div>
          <div class="footer">
            En votre aimable règlement, Cordialement.
          </div>
        </body>
      </html>
    `;
  };

  const handleGeneratePDF = async () => {
    const htmlContent = generateHTMLContent(invoice);
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri);
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
    backgroundColor: '#4A90E2',
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default GeneratePDF;
