import React,{useState,useEffect} from "react";
import { Text,View,ScrollView,StyleSheet} from "react-native";
import Constants from 'expo-constants';
import Logotipo from "../components/Logotipo";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from 'react-native-modal';
import host from '../../host';

const S2registro=({navigation})=>{
    const [Nombre,setNombre]=useState("");
    const [Apellido,setApellido]=useState("");
    const [Correo,setCorreo]=useState("");
    const [NombreUsuario,setNombreUsuario]=useState("");
    const [Telefono,setTelefono]=useState("");
    const [Contraseña,setContraseña]=useState("");
    const [ConfirmacionContraseña,setConfirmacionContraseña]=useState("");
    const [habilitado, setHabilitado] = useState(false);
    const [IsModalVisible, setIsModalVisible] = useState(false);

    const mostrarModal = () => {
      setIsModalVisible(true);
    };
    
    const cerrarModal = () => {
        setIsModalVisible(false);
        navigation.navigate('Bienvenida');
    };

    function validarCorreo(correo) {
        const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.]*$/;
        return expresionRegular.test(correo);
    }

    useEffect(() => {
        const usuarioValido = NombreUsuario.length >= 8;
        const contrasenaValida = Contraseña.length >= 8 && Contraseña==ConfirmacionContraseña;
        const correoValido=validarCorreo(Correo)
        const telefonoValido=Telefono.length>=10 && !isNaN(Telefono);;
        setHabilitado(usuarioValido && contrasenaValida && correoValido && telefonoValido);
    }, [Correo, Contraseña,ConfirmacionContraseña,NombreUsuario,Telefono]);

    const enviarDatosAlServidor = async () => {
        const datos = {
            email:Correo,
            password: Contraseña,
            username:NombreUsuario,
            name:Nombre,
            lastName:Apellido,
            phone:Telefono
        };
    
        try {
          const response = await fetch(host+'/user-int/v1/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
          });
    
          if (response.ok) {
            console.log('Registro exitoso');
            mostrarModal();
          } else {
            alert('Este mail ya está registrado');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };

    return(
        <View style={style.screen}>
            <Logotipo/>
            <View style={style.form}>
                <Text style={style.text}>REGISTRATE</Text>
                <ScrollView>
                  <Input actualizarCampo={setNombre} instructivo="Nombre"/>
                  <Input actualizarCampo={setApellido} instructivo="Apellido"/>
                  <Input actualizarCampo={setCorreo} instructivo="Correo electrónico"/>
                  <Input actualizarCampo={setNombreUsuario} instructivo="Nombre de usuario"/>
                  <Input actualizarCampo={setTelefono} instructivo="Telefono"/>
                  <Input actualizarCampo={setContraseña} instructivo="Contraseña"/>
                  <Input actualizarCampo={setConfirmacionContraseña} instructivo="Confirmar contraseña"/>
                </ScrollView>
                
                <Button habilitado={habilitado} theme="light" text="CONFIRMAR" onPress={enviarDatosAlServidor}/>
                <Button habilitado={true} theme="dark" text="VOLVER SIN GUARDAR" onPress={() => navigation.navigate('Bienvenida')}/>
            </View>
            <Modal style={{alignItems:'center'}} isVisible={IsModalVisible} onBackdropPress={cerrarModal}>
                <View style={style.modalContainer}>
                    <Logotipo/>
                    <Text style={style.modalText}>¡Registro exitoso!</Text>
                </View>
            </Modal> 
        </View>
    )
}

const style=StyleSheet.create({
    screen:{
        justifyContent:"space-between",
        flexGrow:1,
        flex:1,
        backgroundColor: 'white',
        alignItems:"center",
        marginTop: Constants.statusBarHeight,
        paddingBottom:Constants.statusBarHeight*4
    },
    form:{
        alignItems:"center",
    },
    text:{
        fontWeight:"bold",
        fontSize:22
    },
    modalText: {
      color:'#6372ff',
      fontSize:20,
      textAlign:"center",
      marginVertical:20,
      marginHorizontal:-15,
      fontWeight:"bold"
    },
    modalContainer:{
        padding:15,
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor:'white',
        borderColor:'#6372ff',
        borderWidth:5,
        borderRadius:30
    }
})

export default S2registro