import { View, Text } from "react-native"

type DataDisplayProps = {
  dataTitle:string,
  data:string
  titleStyle?:object
  dataStyle?:object
}
/**
 * Exibe um dado em formato de texto
 * @param props dataTitle = nome do dado; data = valor do dado
 */
export function DataDisplay(props:DataDisplayProps) {
  return(
  <View style={{flex:1,flexDirection:"row", padding:10, alignItems:"center"}}>
    <Text style={[{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"},props.titleStyle]}>{props.dataTitle}</Text>
    <Text style={[{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"},props.dataStyle]}>{props.data}</Text>
  </View>
  )
}
