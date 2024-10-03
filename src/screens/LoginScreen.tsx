import React, { useState } from 'react'
import { View } from 'react-native'
import { Button, Snackbar, Text, TextInput } from 'react-native-paper'
import { styles } from '../theme/styles';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../config/firebaseConfig'
import { CommonActions, useNavigation } from '@react-navigation/native';


//Interfaz - FormRegister
interface FormLogin{
    email: string,
    password: string

}

//Interface - Message
interface ShowMessage{
    visible:boolean,
    message:string,
    color:string,
}

const LoginScreen = () => {

    //hook useState: cambiar el estado del forulario
    const [formLogin, setformLogin] = useState<FormLogin>({
        email:"",
        password:""
    })

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
        setformLogin({...formLogin,[key]:value});
    }

    //funcion:iniciar sesion con el usuario registrado
    const handleSignIn = async()=>{
        if(!formLogin.email || !formLogin.password){
            setShowMesssage({
                visible:true,
                message:'Completa todos los campos!',
                color:'#dc143c'
            })
            return;
        }
            //console.log(formLogin)
            try{

                const response= await signInWithEmailAndPassword(
                    auth, 
                    formLogin.email, 
                    formLogin.password
                );
                //console.log(response);
                setShowMesssage({
                    visible:true,
                    message:'Se registro Correctamente',
                    color:'#22AD20FF'
                })
                
            }catch(e){
                console.log(e)
                setShowMesssage({
                    visible:true,
                    message:'Correo y/o contraseña incorrecta',
                    color:'#dc143c'
                })

            }
        
    }
    return (
        <View style={styles.root}>
            <Text style={styles.text}>Inicia Sesión</Text>
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
                 <Button  mode="contained" onPress={() => handleSignIn()}>
                    Iniciar Sesión
                </Button>
                <Text 
                    style={styles.textRedirect} 
                    onPress={()=>navigation.dispatch(CommonActions.navigate({name:'Register'}))}>
                        No tienes una cuenta? Regístrate ahora
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

export default LoginScreen
