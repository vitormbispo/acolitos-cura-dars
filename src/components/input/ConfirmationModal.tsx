import { Modal, View, Image, Text } from "react-native"
import { menuStore } from "../../store/store"
import { textStyles, uiStyles } from "../../styles/GeneralStyles"
import { ICONS } from "../../classes/AssetManager"
import { TextButton } from "../buttons/TextButton"

type ConfirmationModalProps = {
  visible:boolean
  confirmationText:string
  confirmAction: (...args:any)=>any
  declineAction: (...args:any)=>any
  requestClose?: (...args:any)=>any
  alert?:boolean
  modalStyle?:object
}
/**
 * Modal para confirmar determinada ação
 * @param props
 * visible = Modal visível, confirmationText = Texto pedindo confirmação da ação,
 * confirmAction = ação ao confirmar, declineAction: ação ao cancelar.
 * requestClose = ação ao solicitar fechamento do modal
 * @returns 
 */
export function ConfirmationModal(props:ConfirmationModalProps){
  const {theme} = menuStore()
  return(
    <Modal
      animationType="fade"
      visible={props.visible}
      transparent={true}
      onRequestClose={props.requestClose != null ? props.requestClose : null}>
      
      <View style={{flex:1,justifyContent:"center",backgroundColor:"#0000005F"}}>
          <View style={[{backgroundColor:theme.window},uiStyles.modal,props.modalStyle]}>
              
              {props.alert ? 
              <View>
                <Image source={ICONS.alert} style={{width:64,height:64,alignSelf:"center"}}/>
                <Text style={{fontFamily:'Inter-Bold',textAlign:"center",alignSelf:"center",fontSize:24,color:"#EE2D24"}}>ATENÇÃO!</Text>
              </View>:null}
              
              <Text style={[textStyles.dataText,{alignSelf:"center",textAlign:"center"}]}>{props.confirmationText}</Text>

              <View style={{flexDirection:"row",alignSelf:"center",gap:10,marginTop:30}}>
                  <TextButton text="Sim" buttonStyle={{backgroundColor:theme.confirm}} press={props.confirmAction}/>
                  <TextButton text="Não" buttonStyle={{backgroundColor:theme.reject}} press={props.declineAction}/>
              </View>
          </View>
          
      </View>
  </Modal>
  )
}