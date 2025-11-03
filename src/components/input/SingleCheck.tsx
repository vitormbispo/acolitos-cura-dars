import { Pressable, View, Text, Image } from "react-native"

type SingleCheckProps = {
  img:any,
  press: (...args:any) => any,
  topText?:string
}
/**
 * Botão no formato caixa de checagem única
 * @param props Propriedades:
 * press = Ação ao tocar     
 * topText = Texto acima da caixa     
 * img = Imagem
 * @returns 
 */
export function SingleCheck(props:SingleCheckProps){
  return(
    <Pressable style={{flex:1}} onPress={()=>{
      props.press()}}>
      <View style={{paddingBottom:26,alignContent:"center",alignItems:"center"}}>
        <Text style={{paddingBottom:10,fontFamily:"Inter-Light"}}>{props.topText}</Text>
        <Image style={{height:32,width:32}} source={props.img}/>
      </View>
    </Pressable>
    
  )
}