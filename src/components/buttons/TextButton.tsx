import { Pressable, Text } from "react-native"
import { menuStore } from "../../store/store"
import { textStyles, uiStyles } from "../../styles/GeneralStyles"

type TextButtonProps = {
  text:string
  press: (...args:any) => any
  textStyle?:object,
  buttonStyle?:object,
  disabled?:boolean
}
/** Botão com texto
 * 
 * @param props Propriedades:
   * text = Texto        
   * press = Ação ao tocar     
   * textStyle = Estilo do texto     
   * buttonStyle = Estilo da Pressable
 * @returns 
 */
export function TextButton(props:TextButtonProps) {
  const {theme} = menuStore()
  return (
      <Pressable style={[uiStyles.textButton,{backgroundColor:!props.disabled ? theme.neutral : theme.disabled},props.buttonStyle]} onPress={props.press != undefined && !props.disabled ? props.press : ()=>{}}>
          <Text style={[textStyles.textButton,props.textStyle]}>{props.text}</Text>
      </Pressable>
      
    );
}