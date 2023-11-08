import react, { useState } from "react";
import { View, Image, TextInput, StyleSheet } from "react-native";
import { Dimensions } from "react-native";

const Searchbar = (props) => {
    const [text, setText] = useState("");

    function actualizarDatos(text) {
        setText(text);
        props.actualizarCampo(text);
    }

    return (
        <View style={style.input}>
            {(typeof props.imagen !== "undefined") && (<Image style={style.image} source={props.imagen} />)}
            <TextInput
                style={{ flex: 1, padding: 10, fontSize: 18 }}
                placeholder={props.instructivo}
                placeholderTextColor="gray"
                onChangeText={(text) => actualizarDatos(text)}
                value={props.searchOrigin}
                returnKeyType={Platform.OS === 'ios' ? 'search' : 'search'} // Cambiar a 'go' si es más apropiado
                onSubmitEditing={props.onSubmitEditing}
            />
        </View>
    )
}

const style = StyleSheet.create({
    input: {
        resizeMode: "contain",
        flexDirection: "row",
        alignItems: "center",
        width: Dimensions.get('window').width - 80,
        height: 50,
        borderColor: "black",
        borderWidth: 2,
        borderRadius: 30,
        paddingLeft: 15,
        paddingRight: 10,
        marginVertical: 5,
        backgroundColor: 'white',
    },
    image: {
        resizeMode: "contain",
        height: 40,
        width: 40,
        marginRight: 5
    }
})

export default Searchbar