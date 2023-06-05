import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { globalStyles } from '../globalStyles'

const Columns = () => {

  return (
    <View style={[globalStyles.containerList, styles.containerColumnas]}>
      <Text style={[styles.columnaDescripcion, styles.textColumnas]}>Descripcion</Text>
      <Text style={[styles.columnaPrecio, styles.textColumnas]}>Precio</Text>
      <Text style={[styles.columnaCantidad, styles.textColumnas]}>Cantidad</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  containerColumnas: {
    flexDirection: 'row',
    backgroundColor: '#bed03c',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  textColumnas: {
    color: '#002c5f',
    fontWeight: '500',
    textAlign: 'center',
  },
  columnaDescripcion: {
    flex: 5,
  },
  columnaPrecio: {
    flex: 2,
  },
  columnaCantidad: {
    flex: 3,
  },
})

export default Columns