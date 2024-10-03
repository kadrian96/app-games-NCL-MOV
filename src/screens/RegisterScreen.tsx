import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Button, Snackbar, TextInput } from 'react-native-paper'
import { styles } from '../theme/styles'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebaseConfig'
import { CommonActions, useNavigation } from '@react-navigation/native'

//Interfaz - FormRegister
interface FormRegister{
    email: string,
    password: string

}

//Interface - Message
interface ShowMessage{
    visible:boolean,
    message:string,
    color:string,
}

const RegisterScreen = () => {
//hook useState: cambair el estado del formulario
    const [formRegister, setformRegister] = useState<FormRegister>({
        email:"",
        password:""
    });
    //hook useState: cambiar el estado del mensaje
    const [showMessage, setShowMesssage]= useState<ShowMessage>({
        visible:false,
        message:"",
        color:"#fff"
    })

      //hook useState: cambiar el estado de la visibilidad de contraseña
      const [visiblePassword, setvisiblePassword]= useState(true)
        //hook useNavigation: permite la navegacion por screens
        const navigation=useNavigation();

    //funcion: actualizar el estado del formulario
    const handleSetValues=(key: string, value: string) =>{
        setformRegister({...formRegister,[key]:value});
    }

    //función: registrar a nuevos usuarios
    const handleRegister= async()=>{
        if(!formRegister.email || !formRegister.password){
            setShowMesssage({visible:true, message:"Completa todos los campos", color:"#740708"});
            return;
        }
        console.log(formRegister);
        try{
            const response = await createUserWithEmailAndPassword(
                auth,
                formRegister.email,
                formRegister.password
            );
            setShowMesssage({
                visible:true,
                message:'Se registro Correctamente',
                color:'#085f06'
            })
        }catch(e){
            console.log(e)
            setShowMesssage({
                visible:true,
                message:'No se logro completar la transaccion intente mas tarde',
                color:'#740708'
            })
        }
       
    }

  return (
    <View style={styles.root}>
        <Text style={styles.text}>Registrate</Text>
            <TextInput
                label="Correo"
                mode="outlined"
                placeholder='Escribe tu correo'
                onChangeText={(value)=>handleSetValues('email',value)}
            />
            <TextInput
                label="Contraseña"
                mode="outlined"
                placeholder='Escribe tu contraseña'
                secureTextEntry={visiblePassword}
                right={<TextInput.Icon icon="eye" onPress={()=>setvisiblePassword(!visiblePassword)}/>}
                onChangeText={(value)=>handleSetValues('password',value)}
            />
             <Button  mode="contained" onPress={() => handleRegister()}>
                Registrar
            </Button>
            <Text 
                    style={styles.textRedirect} 
                    onPress={()=>navigation.dispatch(CommonActions.navigate({name:'Login'}))}>
                        Ya tienes una cuenta? Inicia Sesion ahora
                </Text>
            <Snackbar
                visible={showMessage.visible}
                onDismiss={()=>setShowMesssage({...showMessage,visible:false})}
                style={{
                    ...styles.message,
                    backgroundColor: showMessage.color
                }}
                >
                {showMessage.message}
            </Snackbar>
    </View>
    
  )
}

export default RegisterScreen
