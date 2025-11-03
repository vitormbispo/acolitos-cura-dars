import { KeyboardTypeOptions, Text, TextInput, View } from "react-native"
import { uiStyles } from "../../styles/GeneralStyles"

type TextInputBoxProps = {
  title:string,
  enabled?:boolean,
  boxBelow?:boolean
  default?:string,
  placeholder?:string,
  maxLength?:number
  keyboardType?:KeyboardTypeOptions,
  onChangeText?: (...args:any) => any
  onBlur?:(...args:any) => any
}
/**
 * 
 * @param props title = Título da caixa de entrada
 * default = valor padrão da caixa
 * keyboardType = tipo de teclado
 * onChangeText = ação ao usar a caixa
 * @returns 
 */
export function TextInputBox(props:TextInputBoxProps) {
  if(props.enabled === false){return}

  return(
    <View style={{flexDirection:!props.boxBelow ? "row":"column", padding:10,alignItems:"center"}}>
      <Text style={{fontFamily:"Inter-Light",fontSize:22}}>{props.title}</Text>
        <TextInput 
          style={uiStyles.inputField}
          placeholder={props.placeholder}
          defaultValue={props.default}
          keyboardType={props.keyboardType}
          onChangeText={props.onChangeText}
          maxLength={props.maxLength}
          onBlur={props.onBlur}/>
      </View>
  )
}