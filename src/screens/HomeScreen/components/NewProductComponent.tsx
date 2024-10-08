import React, { useState } from "react";
import { View, Platform } from 'react-native';
import {
  Button,
  Divider,
  IconButton,
  Modal,
  Portal,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import { styles } from "../../../theme/styles";
import { auth, dbRealTime } from "../../../config/firebaseConfig";
import { push, ref, set } from "firebase/database";

//interface

interface Props {
  showModalProduct: boolean;
  setShowModalProduct: Function; //funcion del hook useState
}
//interface formProduct
interface VideoGame {
  code: string;
  nameGame: string;
  platform: string;
  price: number;
  category: string;
}
//Interface - Message
interface ShowMessage{
  visible:boolean,
  message:string,
  color:string,
}

const NewProductComponent = ({
  showModalProduct,
  setShowModalProduct,
}: Props) => {
  //hook useState: capturara y gurdar estado de formulario
  const [formProduct, setformProduct] = useState<VideoGame>({
    code: "",
    nameGame: "",
    platform: "",
    price: 0,
    category: "",
  });
   //hook useState: cambiar el estado del mensaje
   const [showMessage, setShowMesssage]= useState<ShowMessage>({
    visible:false,
    message:"",
    color:"#fff"
})

  //Funcion: actualizar el estado del formulario Producto
  const handleSetValues = (key: string, value: any) => {
    setformProduct({ ...formProduct, [key]: value });
  };

  //funcion agregar los productos
  const handleSaveProduct = async() => {
    if (
      !formProduct.code ||
      !formProduct.nameGame ||
      !formProduct.platform ||
      !formProduct.price ||
      !formProduct.category
    ) {
      setShowMesssage({
        visible:true,
        message:'Completa todos los campos!',
        color:'#dc143c'
      })
      return;
    }

    //console.log(formProduct);
    //1.-crear o direccionar a la tbal de la base de datos:
    const dbRef =ref(dbRealTime, 'videojuegos/' +auth.currentUser?.uid)  //colocar un id del usuario para separar los productos por usuario
    //2. Crear una coleccion que agregue los datos en la dbRef
    const saveProduct = push(dbRef);
    //3. Almacenar los datos en la BDD
    try{
      await set(saveProduct,formProduct)
      //cerrar modal
      setShowMesssage({
        visible:true,
        message:'Se guardo la informacion de manera correcta!',
        color:'#22AD20FF'
      })
      setShowModalProduct(false)
      

    }catch(e){
        console.log(e)
        setShowMesssage({
          visible:true,
          message:'No se pudo guardar la informacion intentalo mas tarde!',
          color:'#dc143c'
        })
    }

  };
  return (
    <>
      <View>
        <Portal>
          <Modal
            visible={showModalProduct}
            contentContainerStyle={styles.modal}
          >
            <View style={styles.header}>
              <Text variant="headlineSmall">Nuevo Juego</Text>
              <View style={styles.icon}>
                <IconButton
                  size={30}
                  icon="close-circle-outline"
                  onPress={() => {
                    setShowModalProduct(false);
                  }}
                />
              </View>
            </View>
            <Divider />
            <TextInput
              label="Código"
              mode="outlined"
              onChangeText={(value) => handleSetValues("code", value)}
            />
            <TextInput
              label="Nombre"
              mode="outlined"
              onChangeText={(value) => handleSetValues("nameGame", value)}
            />
            <TextInput
                label="Plataforma"
                mode="outlined"
                onChangeText={(value) => handleSetValues("platform", value)}
            />
             <TextInput
                label="Precio"
                mode="outlined"
                keyboardType="numeric"
                style={{ width: "50%" }}
                onChangeText={(value) => handleSetValues("price", value)}
              />
            
            <TextInput
              label="Categoría"
              mode="outlined"       
              onChangeText={(value) => handleSetValues("category", value)}
            />
            <Button
              mode="contained"
              onPress={() => {
                handleSaveProduct();
              }}
            >
              Agregar
            </Button>
          </Modal>
          <Snackbar
              visible={showMessage.visible}
              onDismiss={() => setShowMesssage({ ...showMessage, visible: false })}
              style={{
                ...styles.message,
                backgroundColor: showMessage.color,
              }}
            >
              {showMessage.message}
          </Snackbar>
        </Portal>
      </View>
      
    </>
  );
};

export default NewProductComponent;
