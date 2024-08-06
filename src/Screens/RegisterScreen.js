import React, { useState } from "react";
import {
  View,
  Text,
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
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

const RegisterStep1 = ({
  nextStep,
  nom,
  setNom,
  prenom,
  setPrenom,
  enterpriseName,
  setEnterpriseName,
  errors,
  setErrors,
}) => {
  const validateStep1 = () => {
    let errors = {};
    if (!nom) errors.nom = "Nom est requis.";
    if (!prenom) errors.prenom = "Prénoms sont requis.";
    if (!enterpriseName)
      errors.enterpriseName = "Nom de l'entreprise est requis.";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      nextStep();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={(text) => {
          setNom(text);
          setErrors((prev) => ({ ...prev, nom: "" }));
        }}
      />
      {errors.nom && <Text style={styles.errorText}>{errors.nom}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Prénoms"
        value={prenom}
        onChangeText={(text) => {
          setPrenom(text);
          setErrors((prev) => ({ ...prev, prenom: "" }));
        }}
      />
      {errors.prenom && <Text style={styles.errorText}>{errors.prenom}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Nom de l'entreprise"
        value={enterpriseName}
        onChangeText={(text) => {
          setEnterpriseName(text);
          setErrors((prev) => ({ ...prev, enterpriseName: "" }));
        }}
      />
      {errors.enterpriseName && (
        <Text style={styles.errorText}>{errors.enterpriseName}</Text>
      )}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={validateStep1}>
          <Text style={styles.buttonText}>
            <AntDesign name="right" size={30} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const RegisterStep2 = ({
  previousStep,
  handleRegister,
  adresse,
  setAdresse,
  telephone,
  setTelephone,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  errors,
  setErrors,
}) => {
  const validateStep2 = () => {
    let errors = {};
    if (!adresse) errors.adresse = "Adresse est requise.";
    if (!telephone) errors.telephone = "Téléphone est requis.";
    if (!email) errors.email = "Adresse mail est requise.";
    if (!password) errors.password = "Mot de passe est requis.";
    if (!confirmPassword)
      errors.confirmPassword = "Confirmation du mot de passe est requise.";
    if (password !== confirmPassword)
      errors.confirmPassword = "Les mots de passe ne correspondent pas.";
    if (password.length < 8)
      errors.password = "Le mot de passe doit contenir au moins 8 caractères.";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      handleRegister();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Adresse de l'entreprise"
        value={adresse}
        onChangeText={(text) => {
          setAdresse(text);
          setErrors((prev) => ({ ...prev, adresse: "" }));
        }}
      />
      {errors.adresse && <Text style={styles.errorText}>{errors.adresse}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Téléphone de l'entreprise"
        value={telephone}
        onChangeText={(text) => {
          setTelephone(text);
          setErrors((prev) => ({ ...prev, telephone: "" }));
        }}
        keyboardType="numeric"
      />
      {errors.telephone && (
        <Text style={styles.errorText}>{errors.telephone}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Adresse mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: "" }));
        }}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors((prev) => ({ ...prev, password: "" }));
        }}
        secureTextEntry
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }}
        secureTextEntry
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={previousStep}>
          <Text style={styles.buttonText}>
            <AntDesign name="left" size={30} color="white" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={validateStep2}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              <AntDesign name="check" size={30} color="white" />
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [enterpriseName, setEnterpriseName] = useState("");
  const [adresse, setAdresse] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Les mots de passe ne correspondent pas.",
      }));
      return;
    } else if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Le mot de passe doit contenir au moins 8 caractères.",
      }));
      return;
    }

    setLoading(true);
    setErrors({}); // Réinitialiser les erreurs avant l'envoi

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        nom,
        prenom,
        enterpriseName,
        adresse,
        telephone,
        email,
      });
      setLoading(false);
      navigation.navigate("Login");
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {step === 1 ? (
          <RegisterStep1
            nextStep={() => setStep(2)}
            nom={nom}
            setNom={setNom}
            prenom={prenom}
            setPrenom={setPrenom}
            enterpriseName={enterpriseName}
            setEnterpriseName={setEnterpriseName}
            errors={errors}
            setErrors={setErrors}
          />
        ) : (
          <RegisterStep2
            previousStep={() => setStep(1)}
            handleRegister={handleRegister}
            adresse={adresse}
            setAdresse={setAdresse}
            telephone={telephone}
            setTelephone={setTelephone}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            loading={loading}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => navigation.replace("Login")}>
            <Text style={styles.linkText}>Déjà un compte ? Connectez-vous</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.text,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.accent,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.highlight,
    padding: 10,
    borderRadius: 50, // Assurez-vous que c'est la moitié de la taille du bouton
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: 60, // Ajustez la largeur pour que le bouton soit circulaire
    height: 60, // Assurez-vous que la hauteur est égale à la largeur
  },
  buttonText: {
    color: colors.darkBackground,
    fontWeight: "bold",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 45,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginBottom: 10,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
