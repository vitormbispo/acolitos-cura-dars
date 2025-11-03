import { router } from "expo-router"
import { contextStore } from "../../store/store"
import { Image,Text,Pressable } from "react-native"

type RowMemberProps = {
  id:number,
  img:any,
  nick:string,
  textStyle?:object
}
/**
   * Botão em formato de linha para representar um acólito.
   * @param props Propriedade:
   * id = Índice do acólito na lista principal.
   * img = Imagem     
   * nick = Apelido do acólito
   * textStyle = Estilo do texto
   * @returns 
   */
export function RowMember(props:RowMemberProps){
  const {updateMemberID} = contextStore()
  const OpenProfile = ()=>{
    updateMemberID(props.id)
    router.push("/screens/MemberProfile")
  }
  return(
    <Pressable style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={OpenProfile}>
      <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
      <Text style={props.textStyle}>{props.nick}</Text>
    </Pressable>
  )
  }
