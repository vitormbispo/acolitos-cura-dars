import { useEffect, useState } from "react"
import { Pressable, Image, Text } from "react-native"
import { textStyles } from "../../styles/GeneralStyles"

type TextCheckBoxProps = {
  checked:boolean,
  press: (...args:any) => any
  text:string
  textStyle?:object
  before?:boolean
}
/**
 * Botão em formato de caixa de checagem.
 * @param props Propriedades:
 * checked = caixa marcada ou não.     
 * press = ação ao pressionar
 * before = Texto deve aparecer antes da caixa? 
 * @returns 
 */
export function TextCheckBox(props:TextCheckBoxProps){
  const[check,setChecked] = props.checked ? useState(1) : useState(0)
  const images = [require("@/src/app/shapes/check_false.png"),require("@/src/app/shapes/check_true.png")]
  
  const changeImage = () =>{
    setChecked(!check ? 1:0)
  }

  

  useEffect(()=>{
    setChecked(props.checked ? 1 : 0)
    if(props.before == undefined){
      props.before = false
    }
  },[props])

  let text:React.JSX.Element = <Text style={[props.textStyle,textStyles.imageButtonText,{marginLeft:20}]}>{props.text}</Text>

  return(
  <Pressable style={{flexDirection:"row",alignItems:"center"}} onPress={()=>{
    props.press()
    changeImage()
  }}>
    {props.before ? text : null}
    <Image source={images[check]} style={{height:32,width:32}}/>
    {!props.before ? text : null}
  </Pressable>
  )
}