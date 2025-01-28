import { View,Image,Text, ScrollView, TouchableOpacity } from "react-native";
import { UpperBar } from "../classes/NewComps";
import { Acolyte, AcolyteData } from "../classes/AcolyteData";
import { useState } from "react";
import { Lineup } from "../classes/Lineup";
import { Coroinha } from "../classes/CoroinhaData";

export class AcolyteSelectScreenOptions{
    static excludedAcolytes:Array<Acolyte> = []
    static selectMode:string = ""
    static selected:Array<Acolyte> = []
    static action:Function = ()=>{}
    static lineup:Lineup = new Lineup()

}

export default function List(){
    const acolytes = []
    let lineup = AcolyteSelectScreenOptions.lineup

    let all = AcolyteData.allAcolytes
    if(all != null){
        for(let i = 0; i < all.length;i++){
            let curAco = all[i]
            
            if(!isExcluded(curAco) && isDayAvailable && curAco.onLineup){ // Apenas os acólitos disponíveis.
                acolytes.push(<SelectableRowAcolyte nick={curAco.nick} id={i} img={require("@/src/app/item_icons/users_icomdpi.png")} key={i} textStyle=
                    {{fontFamily:"Inter-Bold",
                      fontSize:20
                    }} 
                    acolyte={curAco}/>)
            }
        }
    }


    return(
        
        <View style={{flex:1,flexDirection:"column"}}>
            <UpperBar screenName="Selecione o(s) acólito(s)" icon={require("@/src/app/item_icons/users_icomdpi.png")}/>

        <ScrollView style={{flex:1}}> 
            {acolytes} 
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
function SelectableRowAcolyte(props:any){
    
    let [checked,setChecked] = useState(false)
    let checkBox

    return(
      <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={() => {
        
        switch(AcolyteSelectScreenOptions.selectMode){
            case "Single":
                AcolyteSelectScreenOptions.selected.push(props.acolyte)
                AcolyteSelectScreenOptions.action()
            case "Multiple":
                if(checked){
                    AcolyteSelectScreenOptions.selected.splice(AcolyteSelectScreenOptions.selected.indexOf(props.acolyte),1)
                    setChecked(false)
                }
                else{
                    AcolyteSelectScreenOptions.selected.push(props.acolyte)
                    setChecked(true)
                }
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
function isExcluded(member){
    for(let h = 0; h < AcolyteSelectScreenOptions.excludedAcolytes.length;h++){
        if(member == AcolyteSelectScreenOptions.excludedAcolytes[h]){
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
function isDayAvailable(member:Acolyte|Coroinha,line){
    if(line.day != "Outro" && line.weekend != "Outro"){
        return member.disp[line.weekend][line.day]
    }
    else{
        return true
    }
}