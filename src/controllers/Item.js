import { 
  View, 
  Text, 
  StyleSheet ,
  Pressable,
  Alert
} from 'react-native'
import React, { useState } from 'react'

const Item = ({item}) => {

  const [cantidad, setCantidad] = useState(0)

  function handleClickDecremento() {
    const valor = cantidad - 1;
    if(valor < 0) {
      Alert.alert(
        'Cantidad no valida',
        'La cantidad debe ser mayor a 0.',
        [
          { text: 'Aceptar'}
        ]
      )
      return;
    }

    setCantidad(valor)
  };

  function handleClickIncremento() {
    const valor = cantidad + 1;
    console.log(valor);
    setCantidad(valor)
  };

  const { descrip, precio1 } = item;

  return (
    <Pressable 
      style={styles.containerItem}
    >
      <Text
        style={[styles.descripcion, styles.text]}
        numberOfLines={1}
      >
        {descrip}
      </Text>

      <Text style={[styles.precio, styles.text]}>
        {precio1}
      </Text>

      <View style={styles.cantidad}>
        <Pressable 
          style={styles.btnCantidad} 
          onPress={handleClickDecremento}
        >
          <Text style={styles.textCantidad}>-</Text>
        </Pressable>

        <Text style={styles.totalCantidad}>{cantidad}</Text>

        <Pressable style={styles.btnCantidad} onPress={handleClickIncremento}>
          <Text style={styles.textCantidad}>+</Text>
        </Pressable>
      </View>
    </Pressable>
    
  )
}

const styles = StyleSheet.create({
  containerItem: {
    padding: 30,
    borderBottomWidth: .5,
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    color: '#000',
  },
  descripcion: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    flex: 4,
  },
  precio: {
    fontSize: 14,
    flex: 3.5,
    textAlign: 'center',
  },
  cantidad: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnCantidad: {
    // backgroundColor: '#bed03c',
    width: 30,
    height: 30,
    // borderRadius: 15,
  },
  textCantidad: {
    color: "#002c5f",
    textAlign: 'center',
    fontSize: 20,
  },
  totalCantidad: {
    // marginHorizontal: .2,
    fontSize: 20,
  }
})

export default Item