import { View, Text } from 'react-native'
import React from 'react'

import Producto from '../items/Producto'

const Grid = ({
  productos,
  setCarrito,
  carrito,
  setItemsCarrito,
  itemsCarrito
}) => {
  return (
    <View 
      className='flex-row flex-wrap justify-between'
    >
      {
        productos.map((item) => (
          <Producto
            key={item.descrip} 
            item={item}
            setCarrito={setCarrito}
            carrito={carrito}
            setItemsCarrito={setItemsCarrito}
            itemsCarrito={itemsCarrito}
          />
        ))  
      }
    </View>
  )
}

export default Grid