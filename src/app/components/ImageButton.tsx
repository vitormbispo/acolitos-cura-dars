import { Pressable, Image } from "react-native";

type ImageButtonProps = {
  img:any,
  imgStyle?:object,
  buttonStyle?:object,
  press?: (...args:any) => any
}

/**
 * Botão com imagem
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * buttonStyle = Estilo do componente Pressable     
 * press = Ação quando o botão é pressionado     
 * @returns
 */
export function ImageButton(props:ImageButtonProps) {
  return (
    
       <Pressable style={props.buttonStyle} onPress={props.press != undefined ? props.press : ()=>{}}>
          <Image source={props.img} style={props.imgStyle}/>
       </Pressable>
      );
  }
