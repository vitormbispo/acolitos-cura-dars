import { View, Text } from "react-native"
import { menuStore } from "../../store/store"
import { textStyles } from "../../styles/GeneralStyles"

type DataSectionProps = {
  text:string
  textStyle?:object
  color?:string
  centered?:boolean
}
/**
 * Exibe um divisor de seção
 * @param props text = texto da seção
 * color = cor
 */
export function DataSection(props:DataSectionProps){
  const {theme} = menuStore()
  return(
    <View style={{backgroundColor:theme.primary,minHeight:70,margin:10,borderRadius:10}}>
      <Text style={[textStyles.dataSection,{backgroundColor:props.color,textAlign:props.centered?"center":"auto"},props.textStyle]}>{props.text}</Text>
    </View>
  )
}