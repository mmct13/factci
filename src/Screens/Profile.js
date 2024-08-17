import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from"react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from"@expo/vector-icons";
import { useNavigation } from"@react-navigation/native";
import { getFirestore, doc, getDoc } from"firebase/firestore";
import { getAuth } from"firebase/auth";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid); // Fetch the document using the user's UID 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data()); // Set the user data from Firestore
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.container}><Text>Loading...</Text></View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.nomcomplet}>{`${userData.nom} ${userData.prenom} - ${userData.enterpriseName}`}
        </Text>
        <AntDesign name="right" size={16} color="black" style={styles.icon} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>{`Entreprise: ${userData.enterpriseName}`}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("CGU");
        }}
      >
        <Text style={styles.text}>
          Voir les Conditions Générales d'Utilisation
        </Text>
        <AntDesign name="right" size={14} color="black" style={styles.icon} />
        </TouchableOpacity>
      {/* Ajoutez ici d'autres éléments de la page de profil, si nécessaire */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 14,
    color: "#000",
    flex: 1,
  },
  icon: {
    alignSelf: "flex-end", // Assurez-vous que l'icône est alignée à la fin du bouton
  },
  nomcomplet: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
});

export default Profile;
