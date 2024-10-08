import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import {
  Avatar,
  Button,
  Divider,
  FAB,
  IconButton,
  MD3Colors,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { styles } from "../../theme/styles";
import { signOut } from "firebase/auth";
import { auth, dbRealTime } from "../../config/firebaseConfig";
import { CommonActions, useNavigation } from "@react-navigation/native";
import firebase from "@firebase/auth";
import { updateProfile } from "firebase/auth";
import ProductCardComponent from "./components/ProductCardComponent";
import NewProductComponent from "./components/NewProductComponent";
import { onValue, ref } from "firebase/database";

//interface FormUser
interface FormUser {
  name: string;
}

//interface VideoGame
export interface VideoGame {
  id: string;
  code: string;
  nameGame: string;
  platform: string;
  price: number;
  category: string;
}
export const HomeScreen = () => {
  //hook useState: cambiar el estado del formulario
  const [formUser, setformUser] = useState<FormUser>({
    name: "",
  });

  //hook useState: capturar y modificar la data del usuario autenticado
  const [userData, setuserData] = useState<firebase.User | null>(null);

  //hook useState: capturar y modifica arreglo de productos
  const [products, setProducts] = useState<VideoGame[]>([]);

  //hook useState: permitir que e modal de usuario se visualice o no
  const [showModalProfile, setshowModalProfile] = useState<boolean>(false);

  //hook useState: permitir que e modal de producto se visualice o no
  const [showModalProduct, setshowModalProduct] = useState<boolean>(false);

  //hook useNavigation: permite la navegacion por screens
  const navigation = useNavigation();

  //hook useEffect: validar el estado de autenticacion
  useEffect(() => {
    setuserData(auth.currentUser); //Obtener informacion usuario autenticado
    setformUser({ name: auth.currentUser?.displayName ?? "" });
    //Llamar a la funcion para la lista de products
    getAllProducts();
  }, []);

  //funcion: actualizar el estado del formulario
  const handleSetValues = (key: string, value: string) => {
    setformUser({ ...formUser, [key]: value });
  };
  //funcion: actualizar la informacion del usuario autenticado
  const handleUpdateUser = async () => {
    try {
      await updateProfile(userData!, {
        displayName: formUser.name,
      });
    } catch (e) {
      console.log(e);
    }

    //cerrar modal
    setshowModalProfile(false);
  };

  //funcion: obtener los productos para listarlos
  const getAllProducts = () => {
    //1.- Direccionar a la base de datos
    const dbRef = ref(dbRealTime, "videojuegos/"+ auth.currentUser?.uid);
    //2. Acceder a la data
    onValue(dbRef, (snapshot) => {
      //3. Capturar la data
      const data = snapshot.val(); //obtener la data en un formato esperado
      // VERIFICAR SI EXISTE DATA
      if(!data) return;

      //4. Obtener las keys de cada dato
      const getKeys = Object.keys(data);

      //5. Crear un arreglo para almacenar cada producto de la base
      const listProduct: VideoGame[] = [];

      //6. Recorrer la keys para acceder a cada producto
      getKeys.forEach((key) => {
        const value = { ...data[key], id: key };
        listProduct.push(value);
      });
      //7. Actualizar la data obtenida en el arreglo del hook useState
      setProducts(listProduct);
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
      ); //indicar el indice de la ruta inicial y el nombre
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <View style={styles.rootHome}>
        <View style={styles.header}>
          <Avatar.Text size={30} label="PN" />
          <View>
            <Text variant="bodySmall">Bienvenid@</Text>
            <Text variant="labelLarge">{userData?.displayName}</Text>
          </View>
          <View style={styles.icon}>
            <IconButton
              icon="account-edit"
              size={30}
              mode="contained"
              onPress={() => setshowModalProfile(true)}
            />
          </View>
        </View>
        <View>
          <FlatList
            data={products}
            renderItem={({ item }) => <ProductCardComponent product={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>

      </View>
      <Portal>
        <Modal visible={showModalProfile} contentContainerStyle={styles.modal}>
          <View style={styles.header}>
            <Text variant="headlineSmall">Mi Perfil</Text>
            <View style={styles.icon}>
              <IconButton
                icon="close-circle-outline"
                size={30}
                onPress={() => setshowModalProfile(false)}
              />
            </View>
          </View>
          <Divider />
          <TextInput
            mode="outlined"
            label="Nombre"
            value={formUser.name}
            onChangeText={(value) => handleSetValues("name", value)}
          />
          <TextInput
            mode="outlined"
            label="Correo"
            disabled
            value={userData?.email!}
          />
          <Button
            mode="contained"
            onPress={() => {
              handleUpdateUser();
            }}
          >
            Actualizar
          </Button>
          <View style={styles.iconSignOut}>
            <IconButton
              icon="logout-variant"
              iconColor={MD3Colors.error50}
              size={35}
              mode="contained"
              onPress={() => {handleSignOut()}}
            />
          </View>
        </Modal>
      </Portal>
      <FAB
        icon="plus"
        style={styles.fabProduct}
        onPress={() => setshowModalProduct(true)}
      />
      <NewProductComponent
        showModalProduct={showModalProduct}
        setShowModalProduct={setshowModalProduct}
      />
    </>
  );
};
