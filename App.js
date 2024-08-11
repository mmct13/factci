import * as React from "react";
import { useState, useEffect } from "react";
import { auth } from "./src/utils/firebase";
import { NavigationContainer } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/Screens/HomeScreen";
import LoginScreen from "./src/Screens/LoginScreen";
import Profile from "./src/Screens/Profile";
import RegisterScreen from "./src/Screens/RegisterScreen";
import Cgu from "./src/Components/Cgu";
import { StatusBar } from "expo-status-bar";
import logo from "./assets/logo.png";
import {
  Alert,
  Image,
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Button,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import InvoiceForm from "./src/Components/InvoiceForm";
import InvoiceList from "./src/Components/InvoiceList";
import GetStarted from "./src/Screens/GetStarted";
import splash from "./assets/splash.png";
import Entypo from "@expo/vector-icons/Entypo";
import { useNetInfo } from "@react-native-community/netinfo"; // Importation de useNetInfo

// Couleurs de l'interface
const colors = {
  primary: "#2A3B47",
  secondary: "#BDC3C7",
  success: "#27AE60",
  error: "#C0392B",
  background: "#ECF0F1",
  text: "#2A3B47",
  contrast: "#FFFFFF",
  accent: "#7F8C8D",
  highlight: "#4A90E2",
  darkBackground: "#1C2833",
};

const Stack = createNativeStackNavigator();

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={splash} style={styles.image} />
    </View>
  );
}

function OfflineScreen({ onRetry }) {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>Pas de connexion Internet</Text>
      <Button title="Réessayez" onPress={onRetry} color={colors.highlight} />
    </View>
  );
}

const DropdownMenu = ({ handleLogout }) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const openMenu = () => {
    setModalVisible(true);
  };

  const closeMenu = () => {
    setModalVisible(false);
  };

  const handleOpenProfile = () => {
    closeMenu();
    navigation.navigate("Profile");
  };
  return (
    <View>
      <TouchableOpacity onPress={openMenu}>
        <Entypo name="menu" size={30} color={colors.contrast} />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={dropdownStyles.modalBackground}
          onPress={closeMenu}
        >
          <View style={dropdownStyles.menuContainer}>
            <TouchableOpacity
              style={dropdownStyles.menuItem}
              onPress={() => {
                handleOpenProfile();
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign
                  name="user"
                  size={20}
                  color={colors.primary}
                  style={{ marginRight: 20 }}
                />
                <Text style={dropdownStyles.menuText}>Profil</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={dropdownStyles.menuItem}
              onPress={() => {
                closeMenu();
                handleLogout();
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign
                  name="logout"
                  size={20}
                  color={colors.error}
                  style={{ marginRight: 20 }}
                />
                <Text style={dropdownStyles.menuText}>Déconnexion</Text>
              </View>
            </TouchableOpacity>

            {/* Ajoutez d'autres boutons ici */}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const dropdownStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  menuContainer: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
  },
  menuText: {
    color: colors.text,
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.contrast, // Fond blanc
  },
  image: {
    width: "100%", // Adapter la largeur selon les besoins
    resizeMode: "contain", // Pour maintenir le ratio d'aspect de l'image
  },
  offlineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  offlineText: {
    fontSize: 18,
    marginBottom: 20,
    color: colors.text,
  },
});

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const netInfo = useNetInfo();

  const handleRetry = () => {
    // Réessayez l'action de connexion
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  if (!netInfo.isConnected) {
    return <OfflineScreen onRetry={handleRetry} />;
  }

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Oui",
          onPress: () => {
            const auth = getAuth();
            auth.signOut();
            setUser(null);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.contrast,
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerTitleAlign: "center",
          }}
          initialRouteName={user ? "Home" : "GetStarted"}
        >
          {user ? (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  title: "",
                  headerLeft: () => (
                    <View
                      style={{
                        marginLeft: 10,
                        backgroundColor: "white",
                        borderRadius: 15,
                      }}
                    >
                      <Image source={logo} style={{ width: 100, height: 30 }} />
                    </View>
                  ),
                  headerRight: () => (
                    <DropdownMenu handleLogout={handleLogout} />
                  ),
                }}
              />
              <Stack.Screen
                name="InvoiceForm"
                component={InvoiceForm}
                options={{
                  title: "Formulaire de facture",
                  headerRight: () => (
                    <DropdownMenu handleLogout={handleLogout} />
                  ),
                }}
              />
              <Stack.Screen
                name="InvoiceList"
                component={InvoiceList}
                options={{
                  title: "Liste des factures",
                  headerRight: () => (
                    <DropdownMenu handleLogout={handleLogout} />
                  ),
                }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                  title: "Profil",
                }}
              />
              <Stack.Screen
                name="CGU"
                component={Cgu}
                options={{
                  title: "Conditions d'utilisation",
                }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="GetStarted"
                component={GetStarted}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  title: "Inscription",
                  headerLeft: () => (
                    <View
                      style={{
                        marginLeft: 10,
                        backgroundColor: "white",
                        borderRadius: 15,
                      }}
                    >
                      <Image source={logo} style={{ width: 100, height: 30 }} />
                    </View>
                  ),
                }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  title: "Connexion",
                  headerLeft: () => (
                    <View
                      style={{
                        marginLeft: 10,
                        backgroundColor: "white",
                        borderRadius: 15,
                      }}
                    >
                      <Image source={logo} style={{ width: 100, height: 30 }} />
                    </View>
                  ),
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
