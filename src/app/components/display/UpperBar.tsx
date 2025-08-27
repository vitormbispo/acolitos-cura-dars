import { View, Image, Text } from "react-native"
import { menuStore } from "../../store/store"
import { ImageButton } from "../buttons/ImageButton"
import { textStyles, uiStyles } from "../../styles/GeneralStyles"
import { router } from "expo-router"
import { ToggleButton } from "../buttons/ToggleButton"

type UpperBarProps = {
  icon:any
  screenName:string,
  toggleEnabled?:boolean
  hideGoBack?:boolean
}
/**
 * Barra superior
 * @param props Propriedades     
 * icon = Ícone
 * screenName = Nome da tela
 * toggleEnabled = botão para troca entre coroinha/acólito ativado. 
 * @returns 
 */
export function UpperBar(props:UpperBarProps){
  
  const {theme} = menuStore()
  const backButton = <ImageButton img={require("@/src/app/item_icons/back_ico.png")} press={()=>{router.back()}} imgStyle={uiStyles.buttonIconSmall}/>
  return(
      <View style = {[uiStyles.upperBar,{backgroundColor:theme.accentColor}]}>
          {props.hideGoBack ? null : backButton}
          <Image style = {[uiStyles.buttonIcon]} source={props.icon}/>
          <Text style = {textStyles.menuTitle}>- {props.screenName}</Text>
          <ToggleButton enabled={props.toggleEnabled}/>
      </View>
  )
}