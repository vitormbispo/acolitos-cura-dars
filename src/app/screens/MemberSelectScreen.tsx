import { View,Image,Text, ScrollView, TouchableOpacity } from "react-native";
import { UpperBar, VisualCheckBox } from "../classes/NewComps";
import { useState } from "react";
import { Lineup } from "../classes/Lineup";
import { Member, MemberData, MemberType } from "../classes/MemberData";
import { menuStore } from "../store/store";

export class MemberSelectScreenOptions{
    static excludedMembers:Array<Member> = []
    static selectMode:string = ""
    static selected:Array<Member> = []
    static action:Function = ()=>{}
    static lineup:Lineup = new Lineup()

}

export default function List(){
    const members = []
    const {type} = menuStore()
    let lineup = MemberSelectScreenOptions.lineup

    let all:Array<Member>
    switch (type){
        case MemberType.ACOLYTE:
            all = MemberData.allAcolytes; break
        case MemberType.COROINHA:
            all = MemberData.allCoroinhas; break
    }
    
    if(all != null){
        for(let i = 0; i < all.length;i++){
            let curMember = all[i]
            
            if(!isExcluded(curMember) && isDayAvailable(curMember,MemberSelectScreenOptions.lineup) && curMember.onLineup){ // Apenas os membros disponíveis.
                members.push(<SelectableRowMember 
                                nick={curMember.nick} 
                                id={i} 
                                img={require("@/src/app/item_icons/users_icomdpi.png")} 
                                key={i} 
                                textStyle=
                                    {{fontFamily:"Inter-Bold",
                                    fontSize:20
                                    }} 
                                member={curMember}/>)
            }
        }
    }


    return(
        
        <View style={{flex:1,flexDirection:"column"}}>
            <UpperBar screenName="Selecione o(s) acólito(s)" icon={require("@/src/app/item_icons/users_icomdpi.png")}/>

        <ScrollView style={{flex:1}}> 
            {members} 
        </ScrollView>   
        
            
        </View>
    )
}

/**
 * 
 * @param props 
 * acolyte:Acolyte = Acólito
 * img = Ícone da linha
 * textStyle = Estilo do texto da linha
 * @returns 
 */
function SelectableRowMember(props:any){
    
    let [checked,setChecked] = useState(false)
    let checkBox

    MemberSelectScreenOptions.selectMode == "Multiple"?
        checkBox = <VisualCheckBox enabled={checked}/>:
        null
    return(
      <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={() => {
        
        switch(MemberSelectScreenOptions.selectMode){
            case "Single":
                MemberSelectScreenOptions.selected.push(props.member)
                MemberSelectScreenOptions.action()
                break
            case "Multiple":
                if(checked){
                    MemberSelectScreenOptions.selected.splice(MemberSelectScreenOptions.selected.indexOf(props.member),1)
                    setChecked(false)
                }
                else{
                    MemberSelectScreenOptions.selected.push(props.member)
                    setChecked(true)
                }
                break
        }
      }}>
        <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
        <Text style={props.textStyle}>{props.nick}</Text>
        {checkBox}
      </TouchableOpacity>
    )
  }

/**
 * Checa se o membro está na lista de excluídos
 * @param member Membro
 * @returns bool
 */
function isExcluded(member:Member){
    for(let h = 0; h < MemberSelectScreenOptions.excludedMembers.length;h++){
        if(member == MemberSelectScreenOptions.excludedMembers[h]){
            return true
        }
    }
    return false
}

/**
 * Checa se o membro está disponível no dia da determinada escala
 * @param member Membro
 * @param line Escala
 * @returns bool
 */
function isDayAvailable(member:Member,line:Lineup){
    if(line.day != "Outro" && line.weekend != "Outro"){
        return member.disp[line.weekend][line.day]
    }
    else{
        return true
    }
}