import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet,SafeAreaView } from "react-native";
import Input from "../components/Input";
import usuarioImage from "../../assets/USUARIO.png";
import passwordImage from "../../assets/PASSWORD.png";
import Logotipo from "../components/Logotipo";
import Button from "../components/Button";
import Constants from 'expo-constants';
import { useState,useEffect } from "react";
import host from '../../host';

const S1bienvenida = ({navigation, iniciarSesion}) => {
    const [Mail,setMail]=useState("");
    const [Password,setPassword]=useState("");
    const [habilitado, setHabilitado] = useState(false); 

    useEffect(() => {
        const mailValido = validarCorreo(Mail);
        const contrasenaValida = Password.length >= 8;
        setHabilitado(mailValido && contrasenaValida);
    }, [Mail, Password]);

    function validarCorreo(correo) {
      const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.]*$/;
      return expresionRegular.test(correo);
    } 

    const enviarDatosAlServidor = async () => {
        const datos = {
          email: Mail,
          password: Password,
        };
    
        try {
          const response = await fetch(host+'/user-int/v1/login/authenticate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
          });
    
          if (response.ok) {
            const data = await response.json();
            iniciarSesion(data.sessionEnc);
            console.log('Solicitud exitosa');
            console.log(data.sessionEnc);
          } else {
            console.error('Usuario y/o contraseña incorrectos');
            alert('Usuario y/o contraseña incorrectos')
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={style.screen}>
            <Logotipo />
            <View>
                <Input actualizarCampo={setMail} imagen={usuarioImage} instructivo="Mail" />
                <View>
                    <Input actualizarCampo={setPassword} imagen={passwordImage} instructivo="Contraseña" />
                    <TouchableOpacity onPress={() => navigation.navigate('Recupero')}>
                        <Text style={{paddingBottom:10,fontSize:16}}>¿Olvidó su contraseña?</Text>
                    </TouchableOpacity>
                </View>
                <Button habilitado={habilitado} theme="light" text="INGRESAR" onPress={enviarDatosAlServidor}/>
            </View>
            <View style={{ alignItems: "center" }}>
                <Text>¿Primera vez con People Delivery?</Text>
                <Button habilitado={true} theme="dark" text="REGISTRATE" onPress={() => navigation.navigate('Registro')}/>
            </View>
        </ScrollView>
      </SafeAreaView>
    )
}

const style = StyleSheet.create({
    screen: {
        justifyContent: "space-between",
        flexGrow: 1,
        backgroundColor: 'white',
        alignItems: "center",
        marginTop: Constants.statusBarHeight,
        paddingBottom:Constants.statusBarHeight*2
    },
    container: {
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
    },
})

export default S1bienvenida