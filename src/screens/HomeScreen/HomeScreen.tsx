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
import { auth } from "../../config/firebaseConfig";
import { CommonActions, useNavigation } from "@react-navigation/native";
import firebase from "@firebase/auth";
import { updateProfile } from "firebase/auth";
import ProductCardComponent from "./components/ProductCardComponent";
import NewProductComponent from "./components/NewProductComponent";
export const HomeScreen = () => {
  //interface FormUser
  interface FormUser {
    name: string;
  }

  //interface formProduct
  interface Product {
    id: string;
    code: string;
    nameProduct: string;
    price: number;
    stock: number;
    description: string;
  }

  //hook useState: cambiar el estado del formulario
  const [formUser, setformUser] = useState<FormUser>({
    name: "",
  });

  //hook useState: capturar y modificar la data del usuario autenticado
  const [userData, setuserData] = useState<firebase.User | null>(null);

  //hook useState: capturar y modifica arreglo de productos
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      code: "34FC",
      nameProduct: "Teclado",
      price: 25,
      stock: 10,
      description: "Teclado gaming RadioShack Striker mecanico negro",
    },
    {
      id: "2",
      code: "35FC",
      nameProduct: "Mouse",
      price: 30,
      stock: 5,
      description: "Mouse RadioShack 2604784 Negro",
    },
  ]);

  //hook useState: permitir que e modal de usuario se visualice o no
  const [showModalProfile, setshowModalProfile] = useState<boolean>(false);

  //hook useState: permitir que e modal de producto se visualice o no
  const [showModalProduct, setshowModalProduct] = useState<boolean>(false)

  //hook useNavigation: permite la navegacion por screens
  const navigation = useNavigation();

  //hook useEffect: validar el estado de autenticacion
  useEffect(() => {
    setuserData(auth.currentUser); //Obtener informacion usuario autenticado
    setformUser({ name: auth.currentUser?.displayName ?? "" });
  }, []);

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigation.dispatch(CommonActions.navigate({ name: "Login" }));
      })
      .catch((error) => {
        // An error happened.
      });
  };

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
            renderItem={({ item }) => <ProductCardComponent />}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.signoutButton}>
          <Button
            icon="account-cancel"
            mode="contained"
            buttonColor={"#dc143c"}
            style={{ width: 150 }}
            onPress={() => cerrarSesion()}
          >
            Cerrar Sesion
          </Button>
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
        </Modal>
      </Portal>
      <FAB
        icon="plus"
        style={styles.fabProduct}
        onPress={() => setshowModalProduct(true)}
      />
      <NewProductComponent showModalProduct={showModalProduct} setShowModalProduct={setshowModalProduct}/>
    </>
  );
};
