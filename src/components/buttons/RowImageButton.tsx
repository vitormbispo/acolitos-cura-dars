import { Image,Text, Pressable } from "react-native"
import { menuStore } from "../../store/store"
import { uiStyles } from "../../styles/GeneralStyles"

type RowImageButtonProps = {
  img:any,
  text:string,
  imgStyle?:object,
  rowStyle?:object,
  press: (...args:any) => any
}
/**
 * Botão com imagem que ocupa uma linha inteira
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * rowStyle = Estilo do componente Pressable    
 * text = Texto escrito na linha
 * press = Ação quando o botão é pressionado         
 * @returns
 */
export function RowImageButton(props:RowImageButtonProps){
  const {theme} = menuStore()
    return(
      <Pressable onPress={props.press != undefined ? props.press : ()=>{}} style={[uiStyles.rowButton,{backgroundColor:theme.neutral},props.rowStyle]}>
        <Image source={props.img} style={[uiStyles.buttonIcon,props.imgStyle]}/>
        <Text style={{paddingLeft:10, fontFamily:"Inter-Light",fontSize:20,color:theme.primaryText}}>{props.text}</Text>       
      </Pressable>
    )
  }