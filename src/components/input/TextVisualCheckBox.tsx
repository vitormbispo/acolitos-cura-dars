import { View, Text, Image } from "react-native"
import { textStyles } from "../../styles/GeneralStyles"

type TextVisualCheckBoxProps = {
  enabled:boolean
  text:string
  before?:boolean
  textStyle?:object
  imageStyle?:object
  boxStyle?:object
  
}
/**
 * Caixa de checagem sem interação.
 * @param props Propriedades = 
 * boxStyle = Estilo do contêiner     
 * imageStyle = Estilo da imagem     
 * enabled = Ativado
 * 
 * @returns 
 */
export function TextVisualCheckBox(props:TextVisualCheckBoxProps){ 

  let text = <Text style={[{padding:10},props.textStyle,textStyles.imageButtonText]}>{props.text}</Text>

  return(
    <View style={{alignItems:"center",flexDirection:"row"}}>
      {props.before ? text : null}
      <Image source={props.enabled 
        ? require("@/src/app/shapes/check_true.png")
        :require("@/src/app/shapes/check_false.png")} 
        
        style={[{width:32,height:32},props.imageStyle]}></Image>
      {!props.before || props.before==undefined ? text : null}
    </View>
  )
}