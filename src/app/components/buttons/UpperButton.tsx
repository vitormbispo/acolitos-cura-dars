import { View } from "react-native"
import { uiStyles } from "../../styles/GeneralStyles"
import { Href } from "expo-router"
import { LinkImageButton } from "./LinkImageButton"

type UpperButtonProps = {
  img:any
  press?: (...args:any) => any,
  backgroundColor?:string,
  link?:Href,
  style?:object
}
/**
 * 
 * @param props 
 * img = Imagem do botão
 * style = Estilo do botão
 * link = Link para outra tela. Deixe null para usar como um botão convencional
 * press = Ação ao tocar
 * backgroundColor = Cor do fundo
 */
export function UpperButton(props:UpperButtonProps){
  return(
    <View style = {{flex:1,justifyContent:'flex-end',flexDirection:'row',alignItems:'center',padding:10,backgroundColor:props.backgroundColor}}>
      <LinkImageButton img={props.img} imgStyle={[uiStyles.buttonIcon,props.style]} link={props.link} press={()=>{props.press == null ? ()=>{} : props.press()}}/>
    </View>
  )
}
