import { Href, router } from "expo-router"
import { menuStore } from "../../store/store"
import { Text, Pressable, Image } from "react-native"
import { textStyles, uiStyles } from "../../styles/GeneralStyles"

type LinkRowImageButtonProps = {
  img:any,
  text:string,
  link:Href,
  press?: (...args:any) => any,
  imgStyle?:object,
  rowstyle?:object,
  textStyle?:object
}
/**
 * Botão com imagem que ocupa uma linha inteira e possui link para outra tela.
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * rowStyle = Estilo do componente Pressable    
 * text = Texto escrito na linha
 * press = Ação quando o botão é pressionado       
 * link = Link para outra tela  
 * @returns
 */
export function LinkRowImageButton(props:LinkRowImageButtonProps){
  const {theme} = menuStore()
  const GoToLink = ()=>{
    if(props.press != null){
      props.press() 
    }
    
    router.push(props.link)
  }
  return(
      <Pressable style={[uiStyles.rowButton,{backgroundColor:theme.neutral,flexWrap:"wrap"}]} onPress={GoToLink}>
        <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
        <Text style={[textStyles.buttonText,props.textStyle]}>{props.text}</Text>       
      </Pressable>
  )
}