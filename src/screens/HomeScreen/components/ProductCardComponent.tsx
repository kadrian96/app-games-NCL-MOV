import React from "react";
import { View } from "react-native";
import { IconButton, Text, Divider } from 'react-native-paper';
import { styles } from "../../../theme/styles";
import { VideoGame } from "../HomeScreen";
import { CommonActions, useNavigation } from "@react-navigation/native";

//interface - Props
interface Props{
product: VideoGame
}

const ProductCardComponent = ({product}:Props) => {
  //hook useNavigation: permitir navegar de un screen a otro
  const navigation= useNavigation();
  return (
    <>
    <View style={styles.rootListProduct}>
      <View style={{width:'65%'}}>
        <Text variant="labelLarge">Nombre: {product.nameGame}</Text>
        <Text variant="bodyMedium">Precio: {product.price} $</Text>
      </View>
      <View style={styles.icon}>
      <IconButton
            icon="arrow-right-bold-outline"
            size={25}
            mode="contained"
            onPress={() => navigation.dispatch(CommonActions.navigate({name:'Detail', params:{product}}))}
      />
      </View>
    </View>
    <Divider bold={true} />
    </>
  );
};

export default ProductCardComponent;
