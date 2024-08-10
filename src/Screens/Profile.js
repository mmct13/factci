import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const Profile = () => {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("CGU");
        }}
      >
        <Text style={styles.text}>
          Voir les Conditions Générales d'Utilisation
        </Text>
        <AntDesign name="right" size={16} color="black" style={styles.icon} />
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
    marginLeft: 10,
  },
});

export default Profile;
