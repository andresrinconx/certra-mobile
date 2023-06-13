import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'

import globalStyles from '../styles'

const Inicio = () => {
  const [ productos, setProductos ] = useState([])

  useEffect(() => {
    const obtenerProductos = async () => {
      const url = 'http://192.168.88.230:3000/sinv'
    
      try {
        const response = await fetch(url)
        const result = await response.json()
        setProductos(result.result)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerProductos()
  }, [])

  return (
    <View style={styles.main}>
      <View style={styles.contenedor}>
        <Text style={styles.texto}>Productos</Text>

        <ScrollView>
          <View style={styles.productos}>

            <View style={styles.item}>
              <View style={styles.imgBox}>
                <Image
                  style={styles.img}
                  source={require('../assets/Acetaminofen.png')}
                />
              </View>
              
              <View>
                <Text>Titulo</Text>
              </View>

            </View>

            <View style={styles.item}>
              <View style={styles.imgBox}>
                <Image
                  style={styles.img}
                  source={require('../assets/Acetaminofen.png')}
                />
              </View>
              
              <View>
                <Text>Titulo</Text>
              </View>

            </View>

            <View style={styles.item}>
              <View style={styles.imgBox}>
                <Image
                  style={styles.img}
                  source={require('../assets/Acetaminofen.png')}
                />
              </View>
              
              <View>
                <Text>Titulo</Text>
              </View>

            </View>

            <View style={styles.item}>
              <View style={styles.imgBox}>
                <Image
                  style={styles.img}
                  source={require('../assets/Acetaminofen.png')}
                />
              </View>
              
              <View>
                <Text>Titulo</Text>
              </View>

            </View>

          </View>
        </ScrollView>

      </View>   
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    ...globalStyles.main
  },
  contenedor: {
    ...globalStyles.contenedor,
    backgroundColor: '#fff',
  },
  texto: {
    fontSize: 18,
    color: '#000',
    marginBottom: 15,
  },
  productos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    flexBasis: '49%',
    paddingHorizontal: 8,
    borderColor: '#c0c0c0',
    borderWidth: 1,
    borderRadius: 7.5,
    marginBottom: 20,
  },
  imgBox: {
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 130,
    height: 130,
  },
})

export default Inicio