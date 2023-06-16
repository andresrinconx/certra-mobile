import { View, ScrollView, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/SimpleLineIcons'

import globalStyles from '../../styles'
import Producto from '../items/Producto'
import Spinner from '../ui/Spinner'

const Inicio = ({carrito, setCarrito, setItemsCarrito, itemsCarrito}) => {
  const [ productos, setProductos ] = useState([])
  const [ layout, setLayout ] = useState(1)
  const [ cargando, setCargando ] = useState(false)
  const [ icon, setIcon ] = useState(1)

  useEffect(() => {
    const obtenerProductos = async () => {
      const url = 'http://192.168.88.201:3000/sinv'
    
      try {
        const response = await fetch(url)
        const result = await response.json()
        setProductos(result.result.data)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerProductos()
  }, [])

  const view = () => {
    if (layout === 1) {
      setCargando(true)
      setIcon(2)

      setTimeout(() => {
        setLayout(2)
        setCargando(false)
      }, 1000);

      return
    } else {
      setCargando(true)
      setIcon(1)

      setTimeout(() => {
        setLayout(1)
        setCargando(false)
      }, 1000);
    }
  }

  return (
    <View className={globalStyles.main}>
      <View className={globalStyles.contenedor}>

        {/* bar */}
        <View className='flex-row'>
          <Text className={`${globalStyles.texto} basis-[90%]`}>Productos</Text>

          <TouchableOpacity
            onPress={ () => view() }
          >
            {icon === 1
              ? (
                <Icon name="grid" size={30} />
                ) : (
                <Icon name="list" size={30} />
              )
            }
          </TouchableOpacity>
        </View>

        {/* Grid || List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          {productos.length === 0
            ? (
              <Text className={globalStyles.noProductos}>No hay productos</Text>
            ) : (
              <View className='flex-row flex-wrap justify-between'>
                {cargando
                  ? (
                    <Spinner />
                  ) : (
                    productos.map((item) => (
                      <Producto 
                        key={item.descrip} 
                        item={item}
                        setCarrito={setCarrito}
                        carrito={carrito}
                        setItemsCarrito={setItemsCarrito}
                        itemsCarrito={itemsCarrito}
                        layout={layout}
                      />
                    )) 
                  )
                }
              </View>
            )
          }
        </ScrollView>

      </View>   
    </View>
  )
}

export default Inicio