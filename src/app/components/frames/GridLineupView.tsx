import { useEffect, useRef, useState } from "react"
import { contextStore, menuStore } from "../../store/store"
import { Lineup } from "../../classes/Lineup"
import { CompactLineup } from "./CompactLineup"
import { ActivityIndicator, FlatList, Modal, ScrollView, View } from "react-native"
import { MembersFromIDs } from "../../classes/MemberData"
import { GetLineupUnvailableMembers } from "../../classes/Methods"
import { MemberSelectModal } from "../input/MemberSelectModal"

type GridLineupViewProps = {
    allLineups:Array<Lineup>
    multiplePlace:boolean
}

/**
 * Exibe todas as escalas de uma lista em formato de grade.
 * @param props allLineups = lista de escalas; multiplePlace = organizar por local?
 * @returns 
 */
export function GridLineupView(props:GridLineupViewProps){
    // OBS: Esse componente utiliza renderização em etapas
    const {type} = menuStore()
    const isRendering = useRef(false) // Está renderizando?
    const renderPhase = useRef(0) // Estágio da renderização
    const [renderComplete,setRenderComplete] = useState(false) // Renderização completa
    const {replacingMember,updateReplacingMember} = contextStore()

    // Construir componentes
    let rows:Array<React.JSX.Element> = []
    let sortedLines = {}
    const [components,setComponents] = useState([])

    const BuildComponents = ()=>{
      for(let i = 0; i < props.allLineups.length; i++){
        let curLine:Lineup = props.allLineups[i] // Escala
        let mapKey = props.multiplePlace ? curLine.weekend+curLine.day : curLine.weekend

        if(sortedLines[mapKey] == undefined){
            sortedLines[mapKey] = []
        }

        sortedLines[mapKey].push(
            <CompactLineup line={curLine} key={i}/>
        )
      }
    
      let keys = Object.keys(sortedLines) // Chaves do mapa organizado por fim de semana/dia
      
      for(let i = 0; i < keys.length;i++){ // Colunas
      rows.push(
          <View style={{flex:1,flexDirection:"row"}} key={i}>
              {sortedLines[keys[i]]}
          </View>
          )
      }
    }
    

    const Replace = (selected:Array<number>)=>{
      replacingMember.lineup.ReplaceMember(replacingMember.role,MembersFromIDs(selected)[0])
      let newState = Object.create(replacingMember)
      newState.replacing = false
      replacingMember.update()
      updateReplacingMember(newState)
    }

    const CloseMemberSelect = ()=>{
      let newState = Object.create(replacingMember)
      newState.replacing = false
      updateReplacingMember(newState)
    }

    useEffect(()=>{
        if(!isRendering.current){
            BuildComponents()
            isRendering.current = true
            setTimeout(()=>{         
                components.push(rows[renderPhase.current])

                if(renderPhase.current < rows.length){
                    renderPhase.current += 1
                    isRendering.current = false
                }
                else{
                    setRenderComplete(true)
                }
                
                setComponents(components.slice())
            },20)
        }
    })
    
    return(
      <View style={{flex:1}}>
        <ScrollView horizontal={true} style={{flex:1}}>    
          <FlatList data={components} style={{flex:1}}
          renderItem={({item})=>item}/>             
        </ScrollView>

        {/* Seleção de membros para substituição */}
        { replacingMember.replacing ? 
          <MemberSelectModal 
          visible={replacingMember.replacing} 
          title={"Substituindo: "+replacingMember.member.nick+"\n"+replacingMember.role} 
          exceptions={replacingMember.lineup.members}
          unvailable={GetLineupUnvailableMembers(replacingMember.lineup,type)}
          returnCallback={Replace}
          requestClose={CloseMemberSelect}
          onSubmit={CloseMemberSelect}
          />:null}

        {/* Carregamento */}
        <Modal visible={!renderComplete} transparent={true}>
          <View style={{flex:1,alignContent:"center",alignItems:"center",justifyContent:"center",top:100,backgroundColor:"white"}}>
            <View style={{top:-100}}>
              <ActivityIndicator size="large"/>
            </View>
          </View>
        </Modal>
      </View>
    )
}