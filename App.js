import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import Header from './src/controllers/Header';
import Item from './src/controllers/Item';
import Columns from './src/controllers/Columns';
import { globalStyles } from './src/globalStyles';

const App = () => {

  const [data, setData] = useState([]);

  useEffect(() => {

    // const url = '';
    // fetch(url)
    //     .then( response => response.json() )
    //     .then( result => setData(result) )

    // --- --- --- //
    const jsonData = require('./src/consultas/sinv.json'); // el require se usa para cargar archivos
    setData(jsonData);
  }, []);

  return(
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.subtitle}>Lista de inventario</Text>
      {/* <Columns /> */}

      <View style={globalStyles.containerList}>
        <FlatList
          data={data}
          initialNumToRender={15}
          keyExtractor={(item) => item.descrip}
          renderItem={({ item }) => {
            return(
              <Item 
                item={item}
              />
            )
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },
  subtitle: {
    color: '#002c5f',
    fontWeight: '600',
    borderBottomColor: '#002c5f',
    borderBottomWidth: 2,
    marginHorizontal: 20,
    fontSize: 16,
    marginTop: 5,
  },
})

export default App;
