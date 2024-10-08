import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { Button, Divider, Snackbar, Text, TextInput } from "react-native-paper";
import { styles } from "../../theme/styles";
import { VideoGame } from "./HomeScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, dbRealTime } from "../../config/firebaseConfig";
import { ref, remove, update } from "firebase/database";

//Interface - Message
interface ShowMessage{
    visible:boolean,
    message:string,
    color:string,
  }
const DetailProductScreen = () => {
  //hook useRoute: acceder a toda la infromacion de navegacion
  const route = useRoute();

  //@ts-ignore
  const { product } = route.params;

  //hook useNavigation: para navegar entre screens

  const navigation=useNavigation();

  //hook useState: cambiar el estado del formulario Editar
  const [formEdit, setformEdit] = useState<VideoGame>({
    id: "",
    code: "",
    nameGame: "",
    platform:"",
    price: 0,
    category: "",
  });

  //hook useState: cambiar el estado del mensaje
  const [showMessage, setShowMesssage]= useState<ShowMessage>({
    visible:false,
    message:"",
    color:"#fff"
})
  //useEffect; cargar y mostrar la data en el formulario de detalle
  useEffect(() => {
    setformEdit(product);
  }, []);

  //Funcion: actualizar los datos capturados desde el formulario
  const handleSetValues = (key: string, value: string) => {
    setformEdit({ ...formEdit, [key]: value });
  };
  //funcion: Actualizar la data del producto
  const handleUpdateProduct =async()=>{
    //console.log(formEdit)
    //1.Direccionar a la base de datos y al elemento a editar en la BDD
    const dbRef=ref(dbRealTime, "videojuegos/"+ auth.currentUser?.uid+ "/" + formEdit.id);
    //2. Actualizar el dato seleccionado
    try{
        await update(dbRef,{
            code:formEdit.code,
            nameGame:formEdit.nameGame,
            Platform:formEdit.platform,
            price:formEdit.price,
            category:formEdit.category
        });
        setShowMesssage({
            visible:true,
            message:'Se actualizo la informacion de manera correcta!',
            color:'#22AD20FF'
          })
        //3. Regresar al anterior screen
        navigation.goBack();
    
    }catch(e){
        console.log(e)
    }
 
  }

  //funcion: eliminar la data del producto
  const handleDeleteProduct=async()=>{
    const dbReF=ref(dbRealTime,"videojuegos/"+ auth.currentUser?.uid+ "/" + formEdit.id)
    try{
      await remove(dbReF)
      setShowMesssage({
        visible:true,
        message:'Se elimino el juego de manera correcta!',
        color:'#22AD20FF'
      })
    //3. Regresar al anterior screen
    navigation.goBack();
    }catch(e){
      console.log(e)
    }
  }

  return (
    <>
    <View style={styles.rootDetail}>
      <View>
        <Text variant="bodyLarge" style={styles.textDetail}>Código:</Text>
        <TextInput
          value={formEdit.code}
          style={{ width: "50%" }}
          onChangeText={(value) => {
            handleSetValues("code", value);
          }}
        />
      </View>
      <View>
        <Text variant="bodyLarge" style={styles.textDetail}>Nombre:</Text>
        <TextInput
          value={formEdit.nameGame}
          onChangeText={(value) => {
            handleSetValues("nameGam", value);
          }}
        />
       
      </View>
      
      <View>
        <Text variant="bodyLarge" style={styles.textDetail}>
          Plataforma:
        </Text>
        <TextInput
          value={formEdit.platform}
          onChangeText={(value) => {
            handleSetValues("platform", value);
          }}
        />
      </View>
      <View >
        <Text variant="labelLarge" style={styles.textDetail}>
          Precio:
        </Text>
        <TextInput
          value={formEdit.price.toString()}
          style={{ width: "50%" }}
          onChangeText={(value) => {
            handleSetValues("price", value);
          }}
        />
      </View>
      <View>
        <Text variant="bodyLarge" style={styles.textDetail}>
          Categoría:
        </Text>
        <TextInput
          value={formEdit.category}
          onChangeText={(value) => {
            handleSetValues("category", value);
          }}
        />
      </View>
      <Button mode="contained" icon="update" onPress={() => {handleUpdateProduct()}}>
        Actualizar
      </Button>
      <Button mode="contained" icon="delete-empty-outline" onPress={() => {handleDeleteProduct()}}>
        Eliminar
      </Button>
    </View>
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
 </>
  );
};

export default DetailProductScreen;
