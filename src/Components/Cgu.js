import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";

const Cgu = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>
        Conditions Générales d'Utilisation (CGU)
      </Text>

      <Text style={styles.sectionHeader}>1. Présentation de l'application</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>factCI</Text> est une application mobile
        développée par <Text style={styles.bold}>Marshall Christ</Text>,
        permettant aux utilisateurs en Côte d'Ivoire de créer des factures à
        partir d'un formulaire simple. L'application propose également une
        gestion des en-têtes des factures pour les entreprises professionnelles.
      </Text>

      <Text style={styles.sectionHeader}>2. Acceptation des conditions</Text>
      <Text style={styles.text}>
        En téléchargeant, installant ou utilisant l'application{" "}
        <Text style={styles.bold}>factCI</Text>, vous acceptez les présentes
        Conditions Générales d'Utilisation (CGU). Si vous n'acceptez pas ces
        conditions, veuillez ne pas utiliser l'application.
      </Text>

      <Text style={styles.sectionHeader}>3. Services proposés</Text>
      <Text style={styles.text}>
        L'application <Text style={styles.bold}>factCI</Text> offre les services
        suivants :{"\n"}- Création et personnalisation de factures à partir d'un
        formulaire
        {"\n"}- Gestion des en-têtes des factures pour les entreprises
        professionnelles
        {"\n"}- Archivage des factures générées
      </Text>

      <Text style={styles.sectionHeader}>4. Utilisation de l'application</Text>
      <Text style={styles.text}>
        L'utilisation de <Text style={styles.bold}>factCI</Text> est réservée
        aux utilisateurs âgés d'au moins 16 ans et résidant en Côte d'Ivoire.
        Vous vous engagez à utiliser l'application conformément aux lois en
        vigueur et à ne pas détourner son usage à des fins illicites.
      </Text>

      <Text style={styles.sectionHeader}>5. Propriété intellectuelle</Text>
      <Text style={styles.text}>
        Tous les contenus, fonctionnalités, et éléments graphiques de
        l'application <Text style={styles.bold}>factCI</Text>, y compris le
        logo, ont été créés par <Text style={styles.bold}>Marshall Christ</Text>{" "}
        et sont protégés par des droits de propriété intellectuelle. Toute
        reproduction, représentation, modification, ou utilisation non autorisée
        de ces éléments est strictement interdite.
      </Text>

      <Text style={styles.sectionHeader}>
        6. Protection des données personnelles
      </Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>factCI</Text> collecte des informations sur
        l'entreprise de l'utilisateur ainsi que sur l'utilisateur lui-même. Ces
        données sont traitées et stockées via Firebase.{" "}
        <Text style={styles.bold}>Marshall Christ</Text> s'engage à protéger vos
        données personnelles et à les utiliser exclusivement pour fournir les
        services proposés par l'application.
      </Text>

      <Text style={styles.sectionHeader}>7. Limitation de responsabilité</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Marshall Christ</Text> ne peut être tenu
        responsable des litiges liés aux factures générées par l'application ou
        des pertes de données de quelque nature que ce soit. L'utilisation de
        l'application <Text style={styles.bold}>factCI</Text> se fait à vos
        propres risques.
      </Text>

      <Text style={styles.sectionHeader}>8. Modification des CGU</Text>
      <Text style={styles.text}>
        <Text style={styles.bold}>Marshall Christ</Text> se réserve le droit de
        modifier les présentes CGU à tout moment. Les utilisateurs seront
        informés de ces modifications via l'application ou par tout autre moyen
        approprié.
      </Text>

      <Text style={styles.sectionHeader}>9. Droit applicable</Text>
      <Text style={styles.text}>
        Les présentes CGU sont régies par le droit ivoirien. Tout litige relatif
        à l'utilisation de l'application sera soumis à la compétence exclusive
        des tribunaux ivoiriens.
      </Text>

      <Text style={styles.sectionHeader}>10. Contact</Text>
      <Text style={[styles.text, { marginBottom: 30 }]}>
        Pour toute question concernant ces CGU, vous pouvez contacter{" "}
        <Text style={styles.bold}>Marshall Christ</Text> à l'adresse suivante :
        marshallchrist@yahoo.com.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
    lineHeight: 24,
    textAlign: "justify", // Ajoute la justification du texte
  },
  bold: {
    fontWeight: "bold",
  },
});

export default Cgu;
