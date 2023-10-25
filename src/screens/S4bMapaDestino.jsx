import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { Icon } from 'react-native-elements'
import Searchbar from '../components/Searchbar';
import Button from "../components/Button";
import MainButton from '../components/MainButton';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import host from '../../host';

//Token de aceeso a Mapbox
Mapbox.setAccessToken('pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA');

const S4bMapaDestino = ({ route, navigation }) => {
  
  const [token, setToken] = useState('');
  
  SecureStore.getItemAsync("token").then((token) => setToken(token));
  console.log(token);
  const { originText, latOrigin, longOrigin, homeLat, homeLong } = route.params;

  //Coordenadas CABA para la proximidad
  const coordsCABA = '-34.61315,-58.37723';

  //Ubicación inicial (obtenida del dispositivo)
  const [location, setLocation] = useState(null);
  const [codigoViaje, setCodigoViaje] = useState("");
  //Latitud y longitud de las ubicaciones seleccionadas
  const [latDestination, setLatDestination] = useState(0);
  const [longDestination, setLongDestination] = useState(0);

  const [showDestination, setShowDestination] = useState(false);

  const [searchDestination, setSearchDestination] = useState('');

  const camera = useRef(null);

  //Obtener localización del dispositivo
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      try {
        const currentLocation = await getCurrentLocation();
        setLocation(currentLocation.coords);
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
      }

    })();
  }, []);

  function getCurrentLocation() {
    const timeout = 10000;
    return new Promise(async (resolve, reject) => {
      setTimeout(() => { reject(new Error(`Error getting gps location after ${(timeout * 2) / 1000} s`)) }, timeout * 2);
      setTimeout(async () => { resolve(await Location.getLastKnownPositionAsync()) }, timeout);
      resolve(await Location.getCurrentPositionAsync());
    });
  }

  //Movimiento de cámara
  const moveCamera = (lon, lat) => {
    camera.current?.setCamera({
      centerCoordinate: [lon, lat],
      zoomLevel: 12,
      animationMode: "flyTo",
      animationDuration: 2000,
    });
  }

  //Actualizar posición de cámara basada en el punto de destino
  useEffect(() => {
    if (latDestination !== 0 && longDestination !== 0) {
      moveCamera(longDestination, latDestination);
    }
  }, [latDestination, longDestination]);

  //Obtener coordenadas a partir del texto (destino) 
  const geocodingDestino = async () => {
    try {
      const response = await fetch(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchDestination +
        '.json?proximity=-34.61315,-58.37723&' +
        'access_token=pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA',
      );
      const json = await response.json();

      setLatDestination(json.features[0].center[1]);
      setLongDestination(json.features[0].center[0]);
      setShowDestination(true);

      return json;
    } catch (error) {
      if (searchDestination === '') {
        alert('Ingrese un punto de destino');
      }
    }
  };

  //Obtener punto de interés (nombre) a partir de las coordenadas
  const reverseGeocoding = async (lat, long) => {
    try {
      const response = await fetch(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' + long + ',' + lat +
        '.json?types=poi&access_token=pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA'
      );
      const json = await response.json();

      const placeName = JSON.stringify(json.features[0].place_name);

      setSearchDestination(placeName);

    } catch (error) {
      console.error(error);
    }
  }

  //Navegación con parámetros (para hacer reverseGeocoding en el resumen)
  const toOpcionesViaje = (codigo) => {
    if (latDestination === 0) {
      alert('Ingrese un punto de destino')
    } else {
      navigation.navigate('OpcionesViaje', {
        codigoViaje:codigo,
        latOrigin: latOrigin,
        longOrigin: longOrigin,
        latDestination: latDestination,
        longDestination: longDestination
      })
    }
  }

  //Actualización del destino cuando se toca en el mapa
  const handleMapPress = (event) => {
    setLatDestination(event.geometry.coordinates[1]);
    setLongDestination(event.geometry.coordinates[0]);
    setShowDestination(true);
    reverseGeocoding(event.geometry.coordinates[1], event.geometry.coordinates[0]);
  }

  const handleMyLocationPress = () => {
    moveCamera(location.longitude, location.latitude);
    setLatDestination(location.latitude);
    setLongDestination(location.longitude);
    setSearchDestination('Tu ubicación');
    setShowDestination(true);
  }

  const handleHomePress = () => {
    if (homeLat == 0 && homeLong && 0) {
      alert('No se ingresó una dirección por defecto, seleccione una a continuación')
    } else {
    moveCamera(homeLong, homeLat);
    setLatDestination(homeLat);
    setLongDestination(homeLong);
    setSearchDestination('Casa');
    setShowDestination(true);
    }
  }

  function geoDistance(lat1, lng1, lat2, lng2){
    const a = 6378.137; // equitorial radius in km
    const b = 6356.752; // polar radius in km

    var sq = x => (x*x);
    var sqr = x => Math.sqrt(x);
    var cos = x => Math.cos(x);
    var sin = x => Math.sin(x);
    var radius = lat => sqr((sq(a*a*cos(lat))+sq(b*b*sin(lat)))/(sq(a*cos(lat))+sq(b*sin(lat))));

    lat1 = lat1 * Math.PI / 180;
    lng1 = lng1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lng2 = lng2 * Math.PI / 180;

    var R1 = radius(lat1);
    var x1 = R1*cos(lat1)*cos(lng1);
    var y1 = R1*cos(lat1)*sin(lng1);
    var z1 = R1*sin(lat1);

    var R2 = radius(lat2);
    var x2 = R2*cos(lat2)*cos(lng2);
    var y2 = R2*cos(lat2)*sin(lng2);
    var z2 = R2*sin(lat2);

    return sqr(sq(x1-x2)+sq(y1-y2)+sq(z1-z2));
}
  
  const enviarViajeAlServidor = async () => {
    const datos = {
      from: originText,
      since: searchDestination,
      distance:(geoDistance(latOrigin, longOrigin, latDestination, longDestination)).toFixed(2),
    };

    try {
      const response = await fetch(host+'/user-int/trips/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos),
      });

      if (response.ok) {
        const data = await response.json();
        setCodigoViaje(data.code);
        toOpcionesViaje(data.code);
        console.log('Solicitud exitosa');
        console.log(data.code);
      } else {
        Alert('No se pudo crear el viaje');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.overlayContainer1}>
        <Searchbar
          actualizarCampo={setSearchDestination}
          instructivo="Destino"
          searchOrigin={searchDestination}
        />
        <Icon name="arrow-circle-down" type='font-awesome' size={50} color='red' onPress={() => geocodingDestino()} />
      </View>
      <View style={styles.overlayContainer2}>
        <Icon name="my-location" type='material-icons' size={40} color='black' onPress={() => handleMyLocationPress()} />
        <Text style={styles.text} >Utilizar mi ubicación actual</Text>
      </View>
      <View style={styles.overlayContainer3}>
        <Icon name="home" type='font-awesome' size={40} onPress={() => handleHomePress()} />
        <Text style={styles.text} >Utilizar mi ubicación guardada</Text>
      </View>
      {location && (
        <Mapbox.MapView
          title='map'
          style={styles.map}
          onPress={handleMapPress}
        >
          <Mapbox.Camera
            zoomLevel={12}
            centerCoordinate={[longOrigin, latOrigin]}
            animationMode="flyTo"
            animationDuration={2000}
            ref={camera}
          />
          <Mapbox.PointAnnotation
            id='currentLocation'
            coordinate={[location.longitude, location.latitude]}
          >
            <View>
              <Icon name="my-location" type='material-icons' size={30} color='blue' />
            </View>
          </Mapbox.PointAnnotation>
          <Mapbox.PointAnnotation
            id='origin'
            coordinate={[longOrigin, latOrigin]}
          >
            <View>
              <Icon name="arrow-circle-up" type='font-awesome' size={30} color='green' />
            </View>
          </Mapbox.PointAnnotation>
          <Mapbox.PointAnnotation
            id='home'
            coordinate={[homeLong, homeLat]}
          >
            <View>
              <Icon name="home" type='font-awesome' size={30} color='blue' />
            </View>
          </Mapbox.PointAnnotation>
          {showDestination && (
            <Mapbox.PointAnnotation
              id='destination'
              coordinate={[longDestination, latDestination]}
            >
              <View>
                <Icon name="arrow-circle-down" type='font-awesome' size={30} color='red' />
              </View>
            </Mapbox.PointAnnotation>
          )}
        </Mapbox.MapView>
      )}
      <View style={styles.navContainer}>
        {/*<Button title='Confirmar' text='CONFIRMAR DESTINO' habilitado={true} onPress={enviarViajeAlServidor} />*/}
        <Button title='Confirmar' text='CONFIRMAR DESTINO' habilitado={true} onPress={()=>toOpcionesViaje('2222')} />
        <MainButton navigation={navigation}/>
      </View>
    </View>
  );
}

export default S4bMapaDestino;

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    marginTop: Constants.statusBarHeight,
  },
  map: {
    flexGrow: 1,
    zIndex: 0,
  },
  overlayContainer1: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    left: 0,
    right: 0,
    zIndex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  overlayContainer2: {
    position: 'absolute',
    top: Constants.statusBarHeight * 3.5,
    left: 0,
    right: 0,
    zIndex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: Constants.statusBarHeight / 2,
    backgroundColor: 'rgba(52, 52, 52, 0.15)',
  },
  overlayContainer3: {
    position: 'absolute',
    top: Constants.statusBarHeight * 5.25,
    left: 0,
    right: 0,
    zIndex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: Constants.statusBarHeight / 2,
    backgroundColor: 'rgba(52, 52, 52, 0.15)',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  navContainer: {
    position: 'absolute',
    top: Constants.statusBarHeight * 20,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});