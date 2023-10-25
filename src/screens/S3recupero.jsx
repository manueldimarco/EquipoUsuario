import React,{useState,useEffect} from "react";
import { Text,View,ScrollView,StyleSheet } from "react-native";
import Constants from 'expo-constants';
import Logotipo from "../components/Logotipo";
import Button from "../components/Button";
import Input from "../components/Input";
import mailImage from "../../assets/mail.png";
import Modal from 'react-native-modal';

const S3recupero=({navigation})=>{
    const [TextoModal, setTextoModal] = useState("");
    const [IsModalVisible, setIsModalVisible] = useState(false);
    const [Mail,setMail]=useState("");
    const [habilitado, setHabilitado] = useState(false);
    const host='https://huge-ravens-wear.loca.lt';

    function validarCorreo(correo) {
        const expresionRegular = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9.]*$/;
        return expresionRegular.test(correo);
    } 

    useEffect(() => {
        setHabilitado(validarCorreo(Mail));
    }, [Mail]);

    
    const mostrarModal = (text) => {
        setTextoModal(text);
        setIsModalVisible(true);
    };
    
    const cerrarModal = () => {
        setIsModalVisible(false);
    };

    /*const enviarDatosAlServidor = async () => {
        const datos = {
            mail:Correo
        };
    
        try {
          const response = await fetch('URL_SERVIDOR', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
          });
    
          if (response.ok) {
            mostrarModal("¡RECUPERO EXITOSO!\nConsulta tu correo electrónico");
          } else {
            mostrarModal("¡ERROR AL RECUPERAR CONTRASEÑA!\nEsta dirección de correo no se encuentra registrada");
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };*/

    return(
        <ScrollView contentContainerStyle={style.screen}>
            <Logotipo/>
            <View style={style.container}>
                <Text style={style.title}>RECUPERO DE CONTRASEÑA</Text>
                <Text style={style.body}>Para cambiar tu contraseña, te mandaremos un enlace a la 
                dirección de correo electrónico que ingreses a continuación...</Text>
            </View>
            <View>
                <Input actualizarCampo={setMail} imagen={mailImage} instructivo="Correo electrónico"/>
                <Button habilitado={habilitado} theme="light" text="SOLICITAR RECUPERO" onPress={()=>mostrarModal("¡RECUPERO EXITOSO!\nConsulta tu correo electrónico")}/>
                <Button habilitado={true} theme="dark" text="REGRESAR" onPress={() => navigation.navigate('Bienvenida')}/>
            </View>

            <Modal style={{alignItems:'center'}} isVisible={IsModalVisible} onBackdropPress={cerrarModal}>
                <View style={style.modalContainer}>
                    <Logotipo/>
                    <Text style={style.modalText}>{TextoModal}</Text>
                </View>
            </Modal>
        </ScrollView>
    )
}

const style=StyleSheet.create({
    screen:{
        justifyContent:"space-around",
        flexGrow:1,
        backgroundColor: 'white',
        alignItems:"center",
        marginTop:Constants.statusBarHeight,
        paddingBottom:Constants.statusBarHeight*2
    },
    container:{
        margin:20,
        alignItems:"flex-start"
    },
    title:{
        fontWeight:"bold",
        fontSize:21,
        marginVertical:5
    },
    body:{
        fontSize:17,
        textAlign:"justify"
    },
    modalText: {
        color:'#6372ff',
        fontSize:20,
        textAlign:"center",
        marginTop:20,
        marginHorizontal:-15
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

export default S3recupero