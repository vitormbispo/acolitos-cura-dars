import { FlatList, Modal, Pressable, View, Image, Text } from "react-native"
import { TextButton } from "../buttons/TextButton"
import { CheckBox } from "./CheckBox"
import { useState } from "react"
import { Member, MemberIDList } from "../../classes/MemberData"
import { GetMemberArray } from "../../classes/Methods"
import { menuStore } from "../../store/store"
import { GetMemberIcon } from "../../classes/NewComps"
import { textStyles, uiStyles } from "../../styles/GeneralStyles"

type MemberSelectModalProps = {
  visible:boolean
  title:string
  returnCallback:(membersIDs:Array<number>)=>void
  exceptions?:Array<Member>
  unvailable?:Array<Member>
  selectedMembersIDs?:Array<number>
  allSelected?:boolean
  multiselect?:boolean
  requestClose?:(...args:any)=>void
  onSubmit?:(...args:any)=>void
}
/**
 * Janela para seleção de membros.
 * @param props Propriedades:
 * @param visible = visível; @param title título da janela; @param returnCallback função de retorno que recebe a lista de 
 * IDs dos membros selecionados como argumento; @param exceptions membros excluídos da lista; @param unvailable membros indisponíveis na lista (ainda são exibidos e podem ser selecionados, mas com um aviso) @param allSelected todos os membros selectionados?
 * @param multiselect seleção de múltiplos membros ativa?; @param requestClose ação ao solicitar fechamento do modal; @param onSubmit ação ao confirmar
 * @returns 
 */
export function MemberSelectModal(props:MemberSelectModalProps){
  const {theme,type} = menuStore()
  let members:Array<Member> = GetMemberArray(type)
  let membersIDs:Array<number> = MemberIDList(members)
  if(props.selectedMembersIDs == undefined){props.selectedMembersIDs = []}

  const [selected,setSelected] = useState(props.allSelected ? membersIDs.slice(): (props.selectedMembersIDs != null ? props.selectedMembersIDs : []))
  
  let memberComps = []
  for(let i = 0; i < members.length;i++){
    let curMember = members[i]
    
    if(props.exceptions != undefined && props.exceptions.includes(curMember)){continue} // Não adiciona caso esteja nas excessões
    
    let color = "#FFFFFF" // Cor do botão
    
    if(props.unvailable != null && props.unvailable.includes(curMember)){
      color = theme.disabled
    }

    if(!props.multiselect && selected.includes(curMember.id)){
      color = theme.neutral
    }

    let newComp =
    
    <Pressable style={{height:100,alignItems:"center",justifyContent:"center",flex:1,flexDirection:"row",backgroundColor:color}} 
    onPress={()=>{
      setSelected([curMember.id])
    }} key={i} disabled={props.multiselect}>
      
      <Image source={GetMemberIcon()} style={uiStyles.buttonIcon}/>
      <Text style={textStyles.memberNick}>{curMember.nick}</Text>
      
      {/* Aviso de indisponibilidade */}
      {props.unvailable != undefined && props.unvailable.includes(curMember) ?
      <Text style={[textStyles.dataTitle,{color:theme.reject}]}>Indisponível!</Text>
      :
      null
      }
      {/* Exibe uma checkbox caso o modo multi seleção esteja ativado */}
      {props.multiselect ?
      <CheckBox checked={selected.includes(curMember.id)} press={()=>{
        selected.includes(curMember.id) ?
          selected.splice(selected.indexOf(curMember.id),1)
          :
          selected.push(curMember.id)
          }}/>:null}
      
    </Pressable>;
    memberComps.push(newComp)
  }

  return(
    <Modal visible={props.visible} transparent={true} onRequestClose={props.requestClose}>
      <View style={{flex:1,backgroundColor:"#00000099"}}>
        <View style={{flex:1,backgroundColor:"#FFFFFF",marginHorizontal:20,marginVertical:40,borderRadius:15}}>
          <View style={{backgroundColor:theme.window,height:100,borderRadius:15,margin:10,justifyContent:"center",alignItems:"center"}}>
            <Text style={[textStyles.dataTitle,{textAlignVertical:"center",textAlign:"center"}]}>{props.title}</Text>
          </View>

          <FlatList data={memberComps} renderItem={({item})=>(item)} removeClippedSubviews={true} maxToRenderPerBatch={2}/>

          <TextButton text={"Concluir"} press={()=>{
            
            (selected != undefined && selected.length != 0) ?
              props.returnCallback(selected)
              :  
              console.warn("No members selected!")

            props.onSubmit != null ? props.onSubmit() : null
          }}/>
        </View>
      </View>
    </Modal>
  )
}