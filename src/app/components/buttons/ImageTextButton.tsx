import { Href } from "expo-router"
import { View, Text } from "react-native"
import { LinkImageButton } from "./LinkImageButton"
import { textStyles } from "../../styles/GeneralStyles"

export enum TextPosition{
  BOTTOM,
  TOP
}
type ImageTextButtonProps = {
  img:any
  text:string
  textPos:TextPosition
  press?: (...args:any) => any
  imgButtonStyle?:object
  textStyle?:object
  imgStyle?:object
  link?:Href
}
/**
 * Botão com imagem e texto superior ou inferior.
 * @param props img = Imagem, text = Texto, 
 * textPos = Posição do texto(Cima ou baixo), press ?= Ação
 * imgButtonStyle ?= Estilo do botão, imgStyle ?= Estilo da imagem
 * textStyle ?= Estilo do texto link ?= Link para outra tela
 * @returns 
 */
export function ImageTextButton(props:ImageTextButtonProps):React.JSX.Element{
  let textComp:React.JSX.Element = <Text style={[props.textStyle,textStyles.imageButtonText]}>{props.text}</Text>
  
  let bottomText:React.JSX.Element = props.textPos == TextPosition.BOTTOM ? textComp : null
  let topText:React.JSX.Element = props.textPos == TextPosition.TOP ? textComp : null

  return(
    <View style={{alignItems:"center"}}>
      {topText}
      <LinkImageButton img={props.img} link={props.link} imgStyle={props.imgStyle} buttonStyle={props.imgButtonStyle} press={props.press!=null ? props.press : null}/>
      {bottomText}
    </View>
  )
}