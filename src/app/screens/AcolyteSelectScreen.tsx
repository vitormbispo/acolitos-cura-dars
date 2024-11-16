import { View,Image,Text, ScrollView, TouchableOpacity } from "react-native";
import { Global } from "../Global";
import { CheckBox, ImageButton,LinkImageButton, LinkRowImageButton, RowAcolyte, RowImageButton, VisualCheckBox } from "../classes/NewComps";
import { Acolyte, AcolyteData } from "../classes/AcolyteData";
import { router } from "expo-router";
import { useState } from "react";
import { SingleLineupScreen } from "./SingleLineup";
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
    console.log("AColyte select screen")

    let all = AcolyteData.allAcolytes
    if(all != null){
        for(let i = 0; i < all.length;i++){
            let curAco = all[i]
            
            if(!isExcluded(curAco) && isDayAvailable && curAco.onLineup){
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
            <UpperBar/>

        <ScrollView style={{flex:1}}> 
            {acolytes} 
        </ScrollView>   
        
            
        </View>
    )
}

export const UpperBar = () => {
    return(
        <View style = {Global.styles.rowContainer}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            padding:26,
            paddingRight:40,
            paddingLeft:40,
            resizeMode:"contain"}} 
            
            source={require("../item_icons/users_icomdpi.png")}/>
            
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
            
        </View>
    )
}

function SelectableRowAcolyte(props:any){
    
    let [checked,setChecked] = useState(false)
    let checkBox

    if(AcolyteSelectScreenOptions.selectMode == "Multiple")
        checkBox = <VisualCheckBox checked={checked} imageStyle={{alignSelf:"flex-end"}} />
    return(
      <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={() => {
        if(AcolyteSelectScreenOptions.selectMode == "Single"){
            
            AcolyteSelectScreenOptions.selected.push(props.acolyte)
            console.log("Pushed: "+props.acolyte.nick)
            console.log("Selected: ")
            console.log(AcolyteSelectScreenOptions.selected)
            AcolyteSelectScreenOptions.action()
        }
        if(AcolyteSelectScreenOptions.selectMode == "Multiple"){
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

function isExcluded(member){
    for(let h = 0; h < AcolyteSelectScreenOptions.excludedAcolytes.length;h++){
        console.log("Comparing: "+member.name+" with "+AcolyteSelectScreenOptions.excludedAcolytes[h].name)
        if(member == AcolyteSelectScreenOptions.excludedAcolytes[h]){
            
            return true
        }
    }
    
    return false
}

function isDayAvailable(member:Acolyte|Coroinha,line){
    if(line.day != "Outro" && line.weekend != "Outro"){
        return member.disp[line.weekend][line.day]
    }
    else{
        return true
    }
}