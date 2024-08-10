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

// Étape 1 : Informations sur l'entreprise
const RegisterStep1 = ({
  nextStep,
  enterpriseName,
  setEnterpriseName,
  commune,
  setCommune,
  telephone,
  setTelephone,
  siteweb,
  setSiteweb,
  errors,
  setErrors,
}) => {
  const validateStep1 = () => {
    let errors = {};
    if (!enterpriseName) errors.enterpriseName = "Nom de l'entreprise est requis.";
    if (!commune) errors.commune = "Le nom de la commune est requis.";
    if (!telephone) errors.telephone = "Téléphone est requis.";

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
      <TextInput
        style={styles.input}
        placeholder="Ville, Commune de l'entreprise"
        value={commune}
        onChangeText={(text) => {
          setCommune(text);
          setErrors((prev) => ({ ...prev, commune: "" }));
        }}
      />
      {errors.commune && <Text style={styles.errorText}>{errors.commune}</Text>}
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
        placeholder="Site Internet"
        value={siteweb}
        onChangeText={(text) => {
          setSiteweb(text);
        }}
      />
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={validateStep1}>
          <Text style={styles.buttonText}>
            <AntDesign name="right" size={20} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Étape 2 : Informations sur l'utilisateur
const RegisterStep2 = ({
  nextStep,
  previousStep,
  nom,
  setNom,
  prenom,
  setPrenom,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errors,
  setErrors,
}) => {
  const validateStep2 = () => {
    let errors = {};
    if (!nom) errors.nom = "Nom est requis.";
    if (!prenom) errors.prenom = "Prénoms sont requis.";
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
        placeholder="Adresse mail"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
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
        autoCapitalize="none"
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
        autoCapitalize="none"
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={previousStep}>
          <Text style={styles.buttonText}>
            <AntDesign name="left" size={20} color="white" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={validateStep2}>
          <Text style={styles.buttonText}>
            <AntDesign name="right" size={20} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Étape 3 : Informations complémentaires
const RegisterStep3 = ({
  previousStep,
  handleRegister,
  secteurActivite,
  setSecteurActivite,
  nombreEmployes,
  setNombreEmployes,
  role,
  setRole,
  loading,
  errors,
  setErrors,
}) => {
  const validateStep3 = () => {
    let errors = {};
    if (!secteurActivite)
      errors.secteurActivite = "Secteur d'activité est requis.";
    if (!nombreEmployes)
      errors.nombreEmployes = "Nombre d'employés est requis.";
    if (!role) errors.role = "Rôle de l'utilisateur est requis.";

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
        placeholder="Secteur d'activité"
        value={secteurActivite}
        onChangeText={(text) => {
          setSecteurActivite(text);
          setErrors((prev) => ({ ...prev, secteurActivite: "" }));
        }}
      />
      {errors.secteurActivite && (
        <Text style={styles.errorText}>{errors.secteurActivite}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Nombre d'employés"
        value={nombreEmployes}
        onChangeText={(text) => {
          setNombreEmployes(text);
          setErrors((prev) => ({ ...prev, nombreEmployes: "" }));
        }}
        keyboardType="numeric"
      />
      {errors.nombreEmployes && (
        <Text style={styles.errorText}>{errors.nombreEmployes}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Rôle de l'utilisateur"
        value={role}
        onChangeText={(text) => {
          setRole(text);
          setErrors((prev) => ({ ...prev, role: "" }));
        }}
      />
      {errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.button} onPress={previousStep}>
          <Text style={styles.buttonText}>
            <AntDesign name="left" size={20} color="white" />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={validateStep3}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              <AntDesign name="check" size={20} color="white" />
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
  const [commune, setCommune] = useState("");
  const [siteweb, setSiteweb] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secteurActivite, setSecteurActivite] = useState("");
  const [nombreEmployes, setNombreEmployes] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
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
        commune,
        telephone,
        email,
        siteweb,
        secteurActivite,
        nombreEmployes,
        role,
      });
      setLoading(false);
      navigation.replace("Home");
    } catch (error) {
      setLoading(false);
      setErrors({ general: error.message });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {step === 1 ? (
          <RegisterStep1
            nextStep={() => setStep(2)}
            enterpriseName={enterpriseName}
            setEnterpriseName={setEnterpriseName}
            commune={commune}
            setCommune={setCommune}
            telephone={telephone}
            setTelephone={setTelephone}
            siteweb={siteweb}
            setSiteweb={setSiteweb}
            errors={errors}
            setErrors={setErrors}
          />
        ) : step === 2 ? (
          <RegisterStep2
            nextStep={() => setStep(3)}
            previousStep={() => setStep(1)}
            nom={nom}
            setNom={setNom}
            prenom={prenom}
            setPrenom={setPrenom}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            errors={errors}
            setErrors={setErrors}
          />
        ) : (
          <RegisterStep3
            previousStep={() => setStep(2)}
            handleRegister={handleRegister}
            secteurActivite={secteurActivite}
            setSecteurActivite={setSecteurActivite}
            nombreEmployes={nombreEmployes}
            setNombreEmployes={setNombreEmployes}
            role={role}
            setRole={setRole}
            loading={loading}
            errors={errors}
            setErrors={setErrors}
          />
        )}
        {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
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
    padding: 10,
    justifyContent: "center",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.accent,
    padding: 5,
    marginBottom: 8,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.highlight,
    padding: 10,
    borderRadius: 25, // Assurez-vous que c'est la moitié de la taille du bouton
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    width: 50, // Ajustez la largeur pour que le bouton soit circulaire
    height: 50, // Assurez-vous que la hauteur est égale à la largeur
  },
  buttonText: {
    color: colors.darkBackground,
    fontWeight: "bold",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    gap: 45,
    marginTop: 10,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginVertical: 4,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "normal",
  },
});

export default RegisterScreen;
