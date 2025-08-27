import {Text, View, Image} from 'react-native'
import { textStyles } from '../../styles/GeneralStyles'
type VisualCheckBoxProps = {
  enabled:boolean
  imageStyle?:object
  boxStyle?:object
  topText?:string
  bottomText?:string
  topTextStyle?:object
  bottomTextStyle?:object
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
export function VisualCheckBox(props:VisualCheckBoxProps){ 
  let topText = props.topText != undefined ? <Text style={[props.topTextStyle,textStyles.imageButtonText,{position:"absolute",bottom:40}]}>{props.topText}</Text> : null
  let bottomText = props.bottomText != undefined ? <Text style={[props.topTextStyle,textStyles.imageButtonText,{position:"absolute",top:40}]}>{props.bottomText}</Text> : null

  return(
    <View style={[{flex:1,padding:10,alignItems:"center"},props.boxStyle]}>
      {topText}
      <Image source={props.enabled 
        ? require("@/src/app/shapes/check_true.png")
        :require("@/src/app/shapes/check_false.png")} 
        
        style={[{width:32,height:32},props.imageStyle]}></Image>
      {bottomText}
    </View>
  )
}