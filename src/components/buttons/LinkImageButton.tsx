import { Href, router } from "expo-router"
import { Image, Pressable, View } from "react-native"

type LinkImageButtonProps = {
  img:any,
  link:Href,
  press?: (...args:any) => any,
  imgStyle?:object,
  buttonStyle?:object,
  viewStyle?:object
}

/**
 * Botão com imagem e link para outra tela
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * buttonStyle = Estilo do componente Pressable     
 * press = Ação quando o botão é pressionado     
 * link = Link para outra tela        
 * @returns
 */
  export function LinkImageButton(props:LinkImageButtonProps) {
    const GoToLink = ()=>{
      props.press == null ? ()=>{} : props.press()
            
      if(props.link != null) {
        router.push(props.link)
      }
    }
    return (
        <View style={props.viewStyle}>
          <Pressable style={props.buttonStyle} onPress={GoToLink}>
            <Image source={props.img} style={props.imgStyle}/>
          </Pressable>
        </View>
          
        );
    }
