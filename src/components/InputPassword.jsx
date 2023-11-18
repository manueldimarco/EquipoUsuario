import React, { useState } from "react";
import { View, Image, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const InputPassword = (props) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [text, setText] = useState("");

  function actualizarDatos(text) {
    setText(text);
    props.actualizarCampo(text);
  }

  function toggleSecureTextEntry() {
    setSecureTextEntry(!secureTextEntry);
  }

  return (
    <View style={style.input}>
      {typeof props.imagen !== "undefined" && <Image style={style.image} source={props.imagen} />}
      <TextInput
        style={{ flex: 1, padding: 10, fontSize: 18 }}
        placeholder={props.instructivo}
        placeholderTextColor="gray"
        onChangeText={(text) => actualizarDatos(text)}
        value={text}
        secureTextEntry={secureTextEntry}
      />
      <TouchableOpacity onPress={toggleSecureTextEntry}>
        <Icon
          name={secureTextEntry ? "eye" : "eye-slash"}
          size={20}
          color="black"
        />
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  input: {
    resizeMode: "contain",
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width - 60,
    height: 50,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 30,
    paddingLeft: 15,
    paddingRight: 10,
    marginVertical: 5,
  },
  image: {
    resizeMode: "contain",
    height: 40,
    width: 40,
    marginRight: 5,
  },
});

export default InputPassword;