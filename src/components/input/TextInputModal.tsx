import { Modal, Text, Pressable } from "react-native"
import { menuStore } from "../../store/store"
import { TextInputBox } from "./TextInputBox"
import { TextButton } from "../buttons/TextButton"
import { textStyles } from "../../styles/GeneralStyles"

type TextInputModalProps = {
  visible:boolean
  title:string
  description:string
  submitAction:(...args:any)=>void

  isTextValid?:boolean
  unvalidTextMessage?:string
  onRequestClose?:(...args:any) => void
  onChangeText?:(text:string)=>void
  

}
export function TextInputModal(props:TextInputModalProps){
  const {theme} = menuStore()
  return(
    <Modal visible={props.visible} transparent={true} onRequestClose={props.onRequestClose} animationType="fade">
      <Pressable style={{flex:1,backgroundColor:"#00000080",alignItems:"center",justifyContent:"center",zIndex:-1}} onPress={props.onRequestClose}>
        <Pressable style={{borderRadius:20,alignSelf:"center",backgroundColor:theme.primary,padding:30}}>
            <Text>{props.description}</Text>
            <TextInputBox title={props.title+":"} onChangeText={props.onChangeText}/>
            {props.isTextValid != undefined && !props.isTextValid ? 
            <Text style={[textStyles.dataTitle,{color:theme.reject}]}>{props.unvalidTextMessage}</Text> : null}
            <TextButton text={"Concluir"} disabled={props.isTextValid != undefined && !props.isTextValid} press={props.submitAction}/>
            
        </Pressable>
      </Pressable>
    </Modal>
  )
  
}