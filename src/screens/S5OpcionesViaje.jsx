import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Switch, Image } from "react-native";
import Logotipo from "../components/Logotipo";
import Mapbox from '@rnmapbox/maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import Button from "../components/Button";
import Icon from 'react-native-vector-icons/FontAwesome';
import Encabezado from "../components/Encabezado";
import Modal from 'react-native-modal';
import * as SecureStore from 'expo-secure-store';
import host from '../../host';

//Token de aceeso a Mapbox
Mapbox.setAccessToken('pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA');

const S5OpcionesViaje = ({ route, navigation, tarjetaSeleccionada }) => {

    const [token, setToken] = useState('');
    SecureStore.getItemAsync("token").then((token) => setToken(token));

    const [enEfectivo, setEnEfectivo] = useState(true);
    const [metodoDePago, setMetodoDePago] = useState("Efectivo");
    const [numeroTarjeta, setNumeroTarjeta] = useState("");
    const [IsModalVisible, setIsModalVisible] = useState(false);

    const mostrarModal = () => {
        setIsModalVisible(true);
    };

    const cerrarModal = () => {
        setIsModalVisible(false);
        navigation.navigate('Origen');
    };

    //Valor arbitrario del precio por kilómetro que se usa para calcular el valor estimado del viaje
    const precioKM = 300;

    //Parámetros recibidos
    const { codigoViaje, latOrigin, longOrigin, latDestination, longDestination } = route.params;
    const [originText, setOriginText] = useState('');
    const [destinationText, setDestinationText] = useState('');

    const [isMovilidadReducida, setIsMovilidadReducida] = useState(false);
    const toggleSwitch = () => setIsMovilidadReducida(previousState => !previousState);

    const [selected, setSelected] = React.useState("");

    useEffect(() => {
        setMetodoDePago(enEfectivo ? "Efectivo" : "Tarjeta");
        setNumeroTarjeta(enEfectivo ? "" : tarjetaSeleccionada);
    }, [enEfectivo, tarjetaSeleccionada]);

    //Obtener punto de interés (nombre) a partir de las coordenadas
    const reverseGeocoding = async (lat, long) => {
        try {
            const response = await fetch(
                'https://api.mapbox.com/geocoding/v5/mapbox.places/' + long + ',' + lat +
                '.json?types=poi&access_token=pk.eyJ1IjoidmVyY2UiLCJhIjoiY2xtZmcxdmhiMDBtdzNyc2VnMDM0NWx4NiJ9.CUQzx8BsTEkrATJeiMZ4VA'
            );
            const json = await response.json();

            const placeName = JSON.stringify(json.features[0].place_name);

            if (lat === latOrigin && long === longOrigin) {
                setOriginText(placeName);
            } else if (lat === latDestination && long === longDestination) {
                setDestinationText(placeName);
            }

        } catch (error) {
            console.error(error);
        }
    }

    //Fórmula del semiverseno para calcular la distancia
    function geoDistance(lat1, lng1, lat2, lng2) {
        const a = 6378.137; // equitorial radius in km
        const b = 6356.752; // polar radius in km

        var sq = x => (x * x);
        var sqr = x => Math.sqrt(x);
        var cos = x => Math.cos(x);
        var sin = x => Math.sin(x);
        var radius = lat => sqr((sq(a * a * cos(lat)) + sq(b * b * sin(lat))) / (sq(a * cos(lat)) + sq(b * sin(lat))));

        lat1 = lat1 * Math.PI / 180;
        lng1 = lng1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
        lng2 = lng2 * Math.PI / 180;

        var R1 = radius(lat1);
        var x1 = R1 * cos(lat1) * cos(lng1);
        var y1 = R1 * cos(lat1) * sin(lng1);
        var z1 = R1 * sin(lat1);

        var R2 = radius(lat2);
        var x2 = R2 * cos(lat2) * cos(lng2);
        var y2 = R2 * cos(lat2) * sin(lng2);
        var z2 = R2 * sin(lat2);

        return sqr(sq(x1 - x2) + sq(y1 - y2) + sq(z1 - z2));
    }

    useEffect(() => {
        reverseGeocoding(latOrigin, longOrigin);
        reverseGeocoding(latDestination, longDestination);
    }, [latOrigin, longOrigin, latDestination, longDestination]);

    const toBuscandoChofer = () => {
        navigation.navigate('BuscandoChofer', {
            codigoViaje: codigoViaje,
            origin: originText,
            destination: destinationText,
            precio: (geoDistance(latOrigin, longOrigin, latDestination, longDestination) * precioKM).toFixed(2),
            distancia: (geoDistance(latOrigin, longOrigin, latDestination, longDestination)).toFixed(2),
            movilidadReducida: isMovilidadReducida,
            metodoDePago: metodoDePago,
            nroTarjeta: numeroTarjeta
        })
    }

    /*BOTON CONFIRMAR: ENDPOINT NUEVO (POST). Creamos estructura viaje y anunciamos la novedad. */
    const crearViaje = async () => {
        const datos = {
            paymentMethod: metodoDePago,
            isMobilityReduce: isMovilidadReducida
        };

        try {
            const response = await fetch(host + '/user-int/trips/create/' + codigoViaje, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos),
            });

            if (response.ok) {
                const data = await response.json();
                toBuscandoChofer();
            } else {
                Alert('No se pudo crear el viaje');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    /*CANCELAR VIAJE: ENDPOINT VIEJO (PATCH)*/
    const cancelarViaje = async () => {

        try {
            const response = await fetch(host + '/user-int/trips/cancel/' + codigoViaje + '/trip/CANCELLED_BEFORE_REQUESTING_DRIVER/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });

            if (response.ok) {
                const data = await response.json();
                mostrarModal();
            } else {
                alert('No se pudo cancelar el viaje');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <View style={style.screen}>
            <Logotipo />
            <Encabezado texto="OPCIONES DE VIAJE" />
            <ScrollView contentContainerStyle={style.scroll}>
                <View style={style.priceContainer}>
                    <Text style={style.priceTitle}>PRECIO ESTIMADO</Text>
                    <Text style={style.price}>
                        AR$ {(geoDistance(latOrigin, longOrigin, latDestination, longDestination) * precioKM).toFixed(2)}
                    </Text>
                </View>
                <View style={style.datosContainer}>
                    <View style={style.item}>
                        <View style={style.tituloItem}>
                            <Icon name="arrow-circle-o-up" size={20} color="green" style={style.icono} />
                            <Text style={style.locationTitle}>DESDE</Text>
                        </View>
                        <Text style={style.locationText}>
                            {originText}
                        </Text>
                    </View>
                    <View>
                        <View style={style.tituloItem}>
                            <Icon name="arrow-circle-o-down" size={20} color="red" style={style.icono} />
                            <Text style={style.locationTitle}>HASTA</Text>
                        </View>
                        <Text style={style.locationText}>
                            {destinationText}
                        </Text>
                    </View>
                    <View style={style.item}>
                        <View style={style.tituloItem}>
                            <Icon name="wheelchair" size={20} color="black" style={style.icono} />
                            <Text style={style.locationTitle}>TIPO DE PASAJERO</Text>
                        </View>
                        <View style={style.tituloItem}>
                            <Text style={style.descripcion}>Movilidad reducida</Text>
                            <Switch onValueChange={toggleSwitch} value={isMovilidadReducida} />
                        </View>
                    </View>
                    <View style={style.itemPago}>
                        <View style={style.tituloItem}>
                            <Image style={{ marginRight: 5 }} source={require("../../assets/PLATA.png")} />
                            <Text style={style.locationTitle}>MÉTODO DE PAGO</Text>
                        </View>
                        <View style={style.metodoItem}>
                            <Text style={style.descripcion}>Efectivo</Text>
                            {enEfectivo ? (
                                <Image source={require("../../assets/seleccionado.png")} />
                            ) : (
                                <TouchableOpacity onPress={() => setEnEfectivo(true)}>
                                    <Image source={require("../../assets/noSeleccionado.png")} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={style.metodoItem}>
                            <Text style={tarjetaSeleccionada === "" ? style.descripcionDisabled : style.descripcion}>Tarjeta ({tarjetaSeleccionada})</Text>
                            {!enEfectivo ? (
                                <Image source={require("../../assets/seleccionado.png")} />
                            ) : (
                                <TouchableOpacity disabled={tarjetaSeleccionada == ""} onPress={() => setEnEfectivo(false)}>
                                    <Image source={require("../../assets/noSeleccionado.png")} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Tarjetas')}>
                            <View style={style.botonTarjeta}>
                                <Image source={require("../../assets/editarTarjeta.png")} />
                                <Text style={style.modificar}>Seleccionar Tarjeta</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>

            </ScrollView>
            <View style={style.buttonContainer}>
                <Button habilitado={true} theme="light" text="CONFIRMAR" onPress={() => crearViaje()} />
                <Button habilitado={true} theme="dark" text="CANCELAR" onPress={() => cancelarViaje()} />
            </View>

            <Modal style={{ alignItems: 'center' }} isVisible={IsModalVisible} onBackdropPress={cerrarModal}>
                <View style={style.modalContainer}>
                    <Logotipo />
                    <Text style={style.modalText}>¡Viaje cancelado!</Text>
                </View>
            </Modal>
        </View>
    )

}

const style = StyleSheet.create({
    screen: {
        justifyContent: "space-between",
        flexGrow: 1,
        flex: 1,
        backgroundColor: 'white',
        alignItems: "center",
        marginTop: Constants.statusBarHeight,
        paddingBottom: Constants.statusBarHeight * 2,
    },
    scroll: {
        alignItems: "center",
        justifyContent: "space-around",
        marginHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: "white"
    },
    priceContainer: {
        backgroundColor: '#A8B0FF',
        borderColor: '#6372FF',
        width: Dimensions.get('window').width - 60,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 2,
        padding: 10
    },
    priceTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    price: {
        fontStyle: "italic",
        fontSize: 18,
    },
    locationTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    locationText: {
        fontStyle: "italic",
        fontSize: 16,
    },
    datosContainer: {
        alignItems: "flex-start",
        justifyContent: "space-around",
        paddingVertical: 10,
        widht: Dimensions.get('window').width - 20,
    },
    item: {
        alignItems: "flex-start",
        justifyContent: "space-around",
        marginVertical: 20
    },
    itemPago: {
        alignItems: "flex-start",
        justifyContent: "space-around"
    },
    tituloItem: {
        flexDirection: "row",
        marginBottom: 5,
        alignItems: "center"
    },
    buttonContainer: {
        marginBottom: -35,
        paddingTop: 15
    },
    descripcion: {
        fontSize: 18,
        paddingRight: 30
    },
    descripcionDisabled: {
        fontSize: 18,
        paddingRight: 30,
        color: 'grey'
    },
    botonTarjeta: {
        flexDirection: "row",
        marginBottom: 5,
        alignItems: "center"
    },
    modificar: {
        fontSize: 14,
        paddingLeft: 10,
        fontStyle: "italic"
    },
    icono: {
        marginRight: 10,
    },
    metodoItem: {
        flexDirection: "row",
        marginBottom: 5,
        alignItems: "center",
        justifyContent: "space-between",
        width: Dimensions.get('window').width - 70,
    },
    modalText: {
        color: '#6372ff',
        fontSize: 20,
        textAlign: "center",
        marginVertical: 20,
        marginHorizontal: -15,
        fontWeight: "bold"
    },
    modalContainer: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderColor: '#6372ff',
        borderWidth: 5,
        borderRadius: 30
    }
})

export default S5OpcionesViaje