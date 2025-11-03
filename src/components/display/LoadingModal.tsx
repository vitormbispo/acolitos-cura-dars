import { ActivityIndicator, Modal, View } from "react-native"

type LoadingModalProps = {
  visible:boolean
}
export function LoadingModal(props:LoadingModalProps){
  {/* Carregamento */}
  return(
    <Modal visible={props.visible} transparent={true}>
      <View style={{flex:1,alignContent:"center",alignItems:"center",justifyContent:"center",top:100,backgroundColor:"white"}}>
        <View style={{top:-100}}>
          <ActivityIndicator size="large"/>
        </View>
      </View>
    </Modal>
  )
}