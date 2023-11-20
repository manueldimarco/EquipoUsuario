import React, { useState, useEffect } from "react";
import { View, StyleSheet,ScrollView} from "react-native";
import Constants from 'expo-constants';
import Button from "../components/Button";
import ItemReclamo from "../components/ItemReclamo";
import Encabezado from "../components/Encabezado";
import Logotipo from "../components/Logotipo";
import host from '../../host';
import * as SecureStore from 'expo-secure-store';

const S14Reclamos = ({navigation}) => {
    
  const [token, setToken] = useState('');
  SecureStore.getItemAsync("token").then((token) => setToken(token));
  
  const [reclamos, setReclamos] = useState([]);

    const obtenerReclamos = async () => {
      try {
        const response = await fetch(host+'/user-int/claims', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReclamos(data);
        } else {
          console.error('Error al obtener datos del backend:');
          alert("No pudimos obtener los reclamos")
        }
      } catch (error) {
        console.error('Error al obtener datos del backend:', error);
      }
    };

    useEffect(() => {
      obtenerReclamos();
    }, []);

    const toCrearReclamo = () => {
      navigation.navigate('Crear Reclamo', {
        tipo:"de app",
      })}

    return (
      <View style={style.screen}>
        <Logotipo/>
        <Encabezado texto="RECLAMOS"/>
        <ScrollView>
          <ItemReclamo titulo="Chofer drogadicto" fecha="4/10/2022" chofer="Mariano García" descripcion="El chofer consumió
          cocaína al detenerse en un semáforo. Luego agarró la General Paz y condució en contramano y marcha atrás" />
          <ItemReclamo titulo="Olor a pescado podrido" fecha="22/9/2023" chofer="Andrés Gómez" descripcion="El chofer deja
          su pesca del día en el asiento de atrás del auto, lo que causa un olor horrible" />
          {reclamos.map((reclamo, index) => (
            <ItemReclamo
              key={index} 
              titulo={reclamo.title}
              fecha={reclamo.createdAt}
              chofer={reclamo.driverName}
              descripcion={reclamo.description}
            />
          ))}
        </ScrollView>
        <View style={{marginBottom:-25}}>
          <Button habilitado={true} theme="light" text="CREAR RECLAMO" onPress={() => toCrearReclamo()}/>
          <Button habilitado={true} theme="dark" text="VOLVER" onPress={() => navigation.goBack()}/>
        </View>
      </View>
    )
}

const style=StyleSheet.create({
  screen: {
    justifyContent: "space-between",
    flex:1,
    flexGrow: 1,
    backgroundColor: 'white',
    alignItems: "center",
    marginTop: Constants.statusBarHeight,
    paddingBottom:Constants.statusBarHeight*2
  }
})

export default S14Reclamos