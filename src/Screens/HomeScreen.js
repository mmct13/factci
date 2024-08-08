import { View, Text, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


const HomeScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Button title='Nouvelle facture' onPress={() => navigation.navigate('InvoiceList')}/>
    </View>
  )
}

export default HomeScreen