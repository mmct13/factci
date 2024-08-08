import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, onSnapshot, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import GeneratePDF from './GeneratePDF';
import { getAuth } from 'firebase/auth';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const db = getFirestore();
  const navigation = useNavigation();

  useEffect(() => {
    const user = getAuth().currentUser;
    if(!user) {
      navigation.replace('Login');
    }
    const q = query(collection(db, 'invoices'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const invoicesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInvoices(invoicesData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.invoiceItem}>
            <Text>Client: {item.clientName}</Text>
            <Text>Total: {item.total} F CFA</Text>
            <GeneratePDF invoice={item} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  invoiceItem: { padding: 15, borderWidth: 1, borderColor: '#ccc', marginVertical: 10 }
});

export default InvoiceList;
