import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Avatar, Button, Text } from 'react-native-paper'
import { styles } from '../../theme/styles'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../../config/firebaseConfig'
import { CommonActions, useNavigation } from '@react-navigation/native'

export const HomeScreen = () => {

  //interface FormUser
  interface UserAuth{
    name:string,
  }

  //hook useState: cambiar el estado del formulario
  const [userAuth, setuserAuth] = useState<UserAuth>({
    name:""
  })
  
  //hook useNavigation: permite la navegacion por screens
  const navigation=useNavigation();

  //hook useEffect: validar el estado de autenticacion
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) { //Existe un usuario Autenticado
        setuserAuth({name: user.displayName ?? 'NA'})
        
      }
    }
  )
  }, [])
  
  const cerrarSesion=()=>{

    signOut(auth).then(() => {
      // Sign-out successful.
      navigation.dispatch(CommonActions.navigate({name:'Login'}))
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <View style={styles.rootHome}>
      <View style={styles.headerHome}>
        <Avatar.Text size={30} label="IM" />
        <View>
          <Text variant="bodySmall">Bienvenid@</Text>
          <Text variant="labelLarge">{userAuth.name}</Text>
        </View>
      </View>
      <View style={styles.signoutButton}>

      <Button icon="account-cancel" mode="contained" buttonColor={'#dc143c'} style={{width:150}} onPress={() => cerrarSesion()}>
          Cerrar Sesion
      </Button>
      
      </View>

    </View>
  )
}


