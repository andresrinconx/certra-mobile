import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Header = () => {
  return (
    <View style={styles.containerHeader}>
      <Text style={styles.textHeader}>Inventario</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  containerHeader: {
    backgroundColor: '#bed03c',
    padding: 30,
  },
  textHeader: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 20,
    textAlign: 'center',
  }
})

export default Header