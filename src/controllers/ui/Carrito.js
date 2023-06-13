import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'

const Carrito = ({navigation, route}) => {
  const goCart = () => {
    navigation.navigate('Cart')
  }

  return (
    <Pressable 
      onPressOut={ () => goCart() }
    >
      <View style={styles.caja}>
        <Icon name="shopping-cart" size={24} color="#fff" />

        {1 > 0
          && (
            <View style={styles.contador}>
              <Text style={styles.textContador}>
                1
              </Text>
            </View>
            )
        }

      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  caja: {
    marginRight: 15
  },
  contador: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContador: {
    color: 'white',
    fontSize: 12
  },
})

export default Carrito