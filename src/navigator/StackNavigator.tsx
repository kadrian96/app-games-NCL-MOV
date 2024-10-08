import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen/HomeScreen";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { View } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { styles } from "../theme/styles";
import DetailProductScreen from "../screens/HomeScreen/DetailProductScreen";

// interface -Routes(Stack Screen)
interface Routes {
  name: string;
  screen: () => JSX.Element; //Componente React
  headerShow?: boolean  //propiedad opcional
  title?: string
}

//arreglo- con rutas de la app
const routes: Routes[] = [
  { name: "Login", screen: LoginScreen },
  { name: "Register", screen: RegisterScreen },
  { name: "Home", screen: HomeScreen },
  {name:"Detail", screen:DetailProductScreen, headerShow:true, title:'Detalle del Juego'}
];


const Stack = createStackNavigator();

export const StackNavigator = () => {
  //hook useState: verificar si esta autenticado o no
  const [isAuth, setisAuth] = useState<boolean>(false);

  //hook useState: controlar carga inicial

  const [isLoading, setisLoading] = useState<boolean>(false);

  //hook useEffect: validar el estado de autenticacion
  useEffect(() => {
    //cargar el activity indicator
    setisLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is sign in
        //console.log(user)
        //const uid = user.uid;
        setisAuth(true);
      }
      //ocultar el activity indicator
      setisLoading(false);
    });
  }, []); //corcehtes vacios para que se ejecute una soal vez

  return (
    <>
      {isLoading ? (
        <View style={styles.rootActicity}>
          <ActivityIndicator animating={true} size={30} color={MD2Colors.red800} />
        </View>
      ) : (
        <Stack.Navigator initialRouteName={isAuth ? 'Home': 'Login'}>  
          { routes.map((item, index) => (
                <Stack.Screen
                  key={index}
                  name={item.name}
                  options={{ headerShown: item.headerShow ?? false, title: item.title }}
                  component={item.screen}
                />
              ))}
        </Stack.Navigator>
      )}
    </>
  );
};
