import { useEffect, useState } from "react"
import { Pressable, Text, Image } from "react-native"
import { textStyles } from "../../styles/GeneralStyles"

type CheckBoxProps = {
  checked:boolean,
  press: (...args:any) => any
  boxStyle?:object
  topText?:string
  topTextStyle?:object
  bottomText?:string
  bottomTextStyle?:object
}
/**
 * Botão em formato de caixa de checagem.
 * @param props Propriedades:
 * checked = caixa marcada ou não.     
 * press = ação ao pressionar     
 * @returns 
 */
export function CheckBox(props:CheckBoxProps){

  const[check,setChecked] = props.checked ? useState(1) : useState(0)
  const images = [require("@/src/app/shapes/check_false.png"),require("@/src/app/shapes/check_true.png")]
  
  const changeImage = () =>{
    setChecked((check === 1) ? 0 : 1)
  }

  useEffect(()=>{
    setChecked(props.checked ? 1 : 0)
  },[props])

  
  let topText:React.JSX.Element = props.topText != undefined ? 
    <Text style={[props.topTextStyle,textStyles.imageButtonText,{position:"absolute",bottom:40}]}>{props.topText}</Text> : null
  
  let bottomText:React.JSX.Element = props.bottomText != undefined ?
    <Text style={[props.bottomTextStyle,textStyles.imageButtonText,{position:"absolute",top:40}]}>{props.bottomText}</Text> : null

  return(
  <Pressable style={[{flex:1,alignItems:"center"},props.boxStyle]} onPress={()=>{
    props.press()
    changeImage()
  }}>
    {topText}
    <Image source={images[check]} style={{height:32,width:32}}/>
    {bottomText}
  </Pressable>
  )
}