import { useEffect, useRef, useState } from "react"
import { Pressable, View, Text } from "react-native"
import Rive from "rive-react-native"
import { menuStore } from "../../store/store"
import { textStyles, uiStyles } from "../../styles/GeneralStyles"

type ExpandableViewProps = {
  expanded:boolean
  title:string
  content:React.JSX.Element
  action?:(...args:any)=>any
  textStyle?:object
  color?:string,
  centered?:boolean
}
/**
 * Componente expansível
 * @param props expanded = está expandido?; title = título do botão; content = conteúdo do componente expandido; action = ação ao tocar no botão
 * @returns 
 */
export function ExpandableView(props:ExpandableViewProps){
  const [expanded,setExpanded] = useState(props.expanded)
  const {theme} = menuStore()
  let content = expanded ? props.content : null
  const riveRef = useRef(null)
  
  useEffect(()=>{
    riveRef.current.setInputState("State Machine 1","isShown",expanded)
  },[expanded])
  return(
    <View style={{}}>
      <Pressable style={[uiStyles.dataSection,{backgroundColor:theme.neutral,flexDirection:"row"}]} onPress={()=>{props.action != undefined ? props.action() : null;setExpanded(!expanded)}}>
        <Text style={[textStyles.dataSection,{textAlign:props.centered?"center":"auto",wordWrap:"nowrap"},props.textStyle]}>{props.title}</Text>
        <View style={{flex:1}}>
          <Rive resourceName="untitled" style={{width:32,height:32,pointerEvents:"none",alignSelf:"flex-end",margin:10}} ref={riveRef} stateMachineName="State Machine 1"/>
        </View>
      </Pressable>
      {content}
    </View>
    
  )
}