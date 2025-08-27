import { useEffect, useRef, useState } from "react"
import { Modal, Pressable, ScrollView, View, Text } from "react-native"
import { menuStore } from "../../store/store"
import Rive from "rive-react-native"
import { textStyles } from "../../styles/GeneralStyles"

type DropDownTypes = {
  options?:Array<string>
  actions?:Array<(...args:any)=>any>
  placeholder?:string
  offset?:{x:number,y:number}
  selectedTextOverride?:string
}
/**
 * Menu no estilo dropdown de escolha única.
 * @param props options = nomes das opções do menu;
 * actions = ações ao selecionar cada opção (a ordem deve conferir com 'options');
 * placeholder = texto exibido antes de selecionar uma função
 * offset = desvio da posição da caixa de opções
 * selectedOverride = substitui o texto da caixa
 * @returns 
 */

export function DropDown(props:DropDownTypes){
  const [modalOpened,setModalOpened] = useState(false)
  const viewRef = useRef<View>(null)
  const [position,setPosition] = useState({x:0,y:0})
  const dropDownOffset = props.offset != null ? props.offset : {x:0,y:10}
  const [selectedOption, setSelectedOption] = useState(props.placeholder != undefined ? props.placeholder : props.options[0])
  const {theme} = menuStore()

  let options = []
  
  for(let i = 0; i < props.options.length;i++){
    let selected = props.options[i] == selectedOption
    let op = 
    <Pressable style={{backgroundColor:selected ? theme.neutral : "FFFFFF"}} key={i}onPress={
      ()=>{
        setSelectedOption(props.options[i])
        setModalOpened(!modalOpened)
        props.actions[i]()
      }
    }>
      <Text style={[textStyles.dataText,{marginLeft:20}]}>{props.options[i]}</Text>
      <View style={{marginTop:5,borderWidth:0.5,borderColor:"#1E1E1EF0"}}/>
    </Pressable>

    options.push(op)
  }

  // Funcões
  const UpdateModalPosition = ()=>{
    
    viewRef.current.measure((x,y,width,height,pageX,pageY)=>{
      setPosition({x:pageX+dropDownOffset.x,y:pageY+dropDownOffset.y})
    })
  }
  const riveRef = useRef(null)

  useEffect(()=>{
    riveRef.current.setInputState("State Machine 1","isShown",modalOpened)
  },[modalOpened])
  return(
    <View style={{margin:10,height:50}}>
      <Pressable ref={viewRef} style={{flexDirection:"row",marginBottom:50,justifyContent:"flex-start",minWidth:"50%",minHeight:50,borderRadius:10,borderColor:"#1E1E1E",borderWidth:1}} 
      onLayout={UpdateModalPosition} onPress={()=>{setModalOpened(!modalOpened);UpdateModalPosition()}}>
        
        <View style={{justifyContent:"center",flexDirection:"row",flex:1,alignItems:"center",marginLeft:20,marginRight:20,minHeight:50}}>
          <Text style={[{marginLeft:10,marginRight:50, alignSelf:"center"},textStyles.dataText]}>{props.selectedTextOverride == null ? selectedOption : props.selectedTextOverride}</Text>
          <View style={{flex:1}}>
            <Rive resourceName="untitled" ref={riveRef} stateMachineName="State Machine 1"style={{pointerEvents:"none",minWidth:32,minHeight:32,alignSelf:"flex-end"}}/>
          </View>
        </View>
        
        
        <Modal visible={modalOpened} transparent={true} onRequestClose={()=>setModalOpened(!modalOpened)}>
          <Pressable style={{flex:1}} onPress={()=>{setModalOpened(false)}}>
            <ScrollView style={{zIndex:-1,top:position.y+dropDownOffset.y,left:position.x+dropDownOffset.x,minWidth:10,width:"50%",maxHeight:"20%"}}>
              <View style={{backgroundColor:"#FFFFFF",borderRadius:10,borderColor:"#1E1E1E",borderWidth:1,overflow:"scroll"}}>
                {options}
              </View>
            </ScrollView>
          </Pressable>
          
        </Modal>
      </Pressable>
    </View>
  )
}