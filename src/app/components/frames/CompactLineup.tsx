import { useEffect, useRef, useState } from "react"
import { contextStore, menuStore } from "../../store/store"
import { Member } from "../../classes/MemberData"
import { View, Text } from "react-native"
import { ImageButton } from "../buttons/ImageButton"
import { ICONS } from "../../classes/AssetManager"
import { Lineup } from "../../classes/Lineup"

type CompactLineupProps = {
  line:Lineup
  replaceAction?:(...args:any)=>void
}
/**
 * 
 * @param props 
 */
export function CompactLineup(props:CompactLineupProps){
  const {theme} = menuStore()
  const {switchingMember,updateSwitchingMember,replacingMember,updateReplacingMember} = contextStore()
  const [lineup] = useState(props.line)

  const BuildComponents = ()=>{
    let comps = []
    for(let i = 0; i < lineup.members.length; i++){
    
      let role = Object.keys(lineup.line)[i]
      let member:Member = lineup.GetRoleMember(role)
  
      let component = 
      <View style={{flexDirection:"row", alignItems:"center"}} key={i}>
        <Text style={{fontFamily:"Inter-Bold",fontSize:10,flex:1/2}}>{role+""}</Text>
        <Text style={{fontFamily:"Inter-Regular",fontSize:10,flex:1/2}}>{member.nick}</Text>
        
        
        <ImageButton img={ICONS.switch} imgStyle={{width:24,height:24,resizeMode:"contain"}}
          press={()=>{
            Switch(role)
          }}/>
        <ImageButton img={ICONS.subs} imgStyle={{width:24,height:24,resizeMode:"contain"}}
          press={()=>{
            Replace(role)
          }}
        />
        
        </View>
  
      comps.push(component)
    }
    return comps
  }

  // OBS: Por algum motivo, esse useEffect foi necessário para atualizar
  // corretamente o valor de 'switchingMember' nesse componente. Não encontrei
  // o motivo, mas pode ter relação com o escopo, já que isso só passou a ocorrer após a implementação do método 'BuildComponents'
  const switching = useRef({...switchingMember}) 
  useEffect(()=>{
    switching.current = switchingMember
  },[switchingMember])

  const Switch = (role:string)=>{
    if(switching.current.switching){
      props.line.SwitchMembers(switching.current.role,switching.current.lineup,role,()=>{
        switching.current.update()
      })
      switching.current.switching = false
      
      setRoles(BuildComponents())
    }
    else{
      updateSwitchingMember({role:role,lineup:props.line,switching:true,update:()=>{
        setRoles(BuildComponents())
      }})
      setRoles(BuildComponents())
    }
  }

  const Replace = (role:string)=>{
    let newState = Object.create(replacingMember)
    newState.role = role
    newState.lineup = props.line
    newState.replacing = true
    newState.member = props.line.line[role]
    newState.update = ()=>{setRoles(BuildComponents())}
    updateReplacingMember(newState)
  }
  
  const [roles,setRoles] = useState(BuildComponents())
  return(
    <View style={{width:200,backgroundColor:theme.backgroundColor,borderRadius:15,margin:10}}>
      <View style={{backgroundColor:theme.primary,borderRadius:15,margin: 10}}>
        <Text style={{fontFamily:"Inter-Bold",fontSize:15,textAlign:"center",marginTop:5}}>{props.line.weekend != "Outro" ? props.line.weekend + props.line.day : "Outro"}</Text>
        
        {props.line.place != undefined ?
          <Text style={{fontFamily:"Inter-Regular",fontSize:15,textAlign:"center",marginTop:5}}>{props.line.place}</Text> 
        : null}
      </View>
      
      
      <View style={{flex:1,margin:10,gap:5}}>
        {roles}
      </View>
      
    </View>
  )
}