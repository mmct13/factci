import * as React from "react";
import { useState, useEffect } from "react";
import { auth } from "./src/utils/firebase";
import { NavigationContainer } from "@react-navigation/native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/Screens/HomeScreen";
import LoginScreen from "./src/Screens/LoginScreen";
import RegisterScreen from "./src/Screens/RegisterScreen";
import { StatusBar } from "expo-status-bar";
import logo from "./assets/logo.png";
import { Alert, Image, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import InvoiceForm from "./src/Components/InvoiceForm";
import InvoiceList from "./src/Components/InvoiceList";
import GetStarted from "./src/Screens/GetStarted";
import splash from "./assets/splash.png";
import { ActivityIndicator, StyleSheet } from "react-native";
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
      <View style={styles.activityIndicator}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </View>
  );
}

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
    marginBottom: 30, // Espace entre l'image et l'ActivityIndicator
  },
  activityIndicator: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",

  },
});

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
              backgroundColor: colors.primary, // Background color of the header
            },
            headerTintColor: colors.contrast, // Text color in the header
            headerTitleStyle: {
              fontWeight: "bold",
            },
            headerTitleAlign: "center", // Align the title to center
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
                      <Image
                        source={logo}
                        style={{ width: 100, height: 30 }} // Adjust padding as needed
                      />
                    </View>
                  ),
                  headerRight: () => (
                    <AntDesign
                      name="logout"
                      size={24}
                      color={colors.error}
                      onPress={handleLogout}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="InvoiceForm"
                component={InvoiceForm}
                options={{
                  title: "Formulaire de facture",
                  // headerLeft: () => (
                  //   <View
                  //     style={{
                  //       marginLeft: 10,
                  //       backgroundColor: "white",
                  //       borderRadius: 15,
                  //     }}
                  //   >
                  //     <Image
                  //       source={logo}
                  //       style={{ width: 100, height: 30 }} // Adjust padding as needed
                  //     />
                  //   </View>
                  // ),
                  headerRight: () => (
                    <AntDesign
                      name="logout"
                      size={24}
                      color={colors.error}
                      onPress={handleLogout}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="InvoiceList"
                component={InvoiceList}
                options={{
                  title: "Liste des factures",
                  // headerLeft: () => (
                  //   <View
                  //     style={{
                  //       marginLeft: 10,
                  //       backgroundColor: "white",
                  //       borderRadius: 15,
                  //     }}
                  //   >
                  //     <Image
                  //       source={logo}
                  //       style={{ width: 100, height: 30 }} // Adjust padding as needed
                  //     />
                  //   </View>
                  // ),
                  headerRight: () => (
                    <AntDesign
                      name="logout"
                      size={24}
                      color={colors.error}
                      onPress={handleLogout}
                    />
                  ),
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
                      <Image
                        source={logo}
                        style={{ width: 100, height: 30 }} // Adjust padding as needed
                      />
                    </View>
                  ),
                }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  title: "Login",
                  headerLeft: () => (
                    <View
                      style={{
                        marginLeft: 10,
                        backgroundColor: "white",
                        borderRadius: 15,
                      }}
                    >
                      <Image
                        source={logo}
                        style={{ width: 100, height: 30 }} // Adjust padding as needed
                      />
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
