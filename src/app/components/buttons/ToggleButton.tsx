import { View } from "react-native"
import { ImageButton } from "./ImageButton"
import { menuStore } from "../../store/store"
import { GetMemberIcon } from "../../classes/NewComps"
import { uiStyles } from "../../styles/GeneralStyles"

type ToggleButtonProps = {
  enabled:boolean
}
/**
 * 
 * @param props enabled = Componente ativado
 * @returns 
 */
export function ToggleButton(props:ToggleButtonProps) {
  if(!props.enabled){return null}
  const {toggleTheme} = menuStore()
  return(
  <View style = {{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
    <ImageButton img={GetMemberIcon()} 
      
      imgStyle={[uiStyles.buttonIcon,{margin:10}]} press={toggleTheme}/>
  </View>
  )
}