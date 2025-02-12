import { View,Image,Text, ScrollView, TouchableOpacity } from "react-native";
import { Global } from "@/src/app/Global";
import { CheckBox, ImageButton,LinkImageButton, LinkRowImageButton, RowImageButton, VisualCheckBox } from "@/src/app/classes/NewComps";
import { router } from "expo-router";
import { useState } from "react";
import { Coroinha, CoroinhaData } from "@/src/app/classes/CoroinhaData";
import { CoroinhaSingleLineupScreen } from "./CoroinhaSingleLineup";
import { CoroinhaLineup } from "../../classes/CoroinhaLineup";
import { CoroinhaLineupScreenOptions } from "./CoroinhaLineupScreen";
import { Acolyte } from "../../classes/AcolyteData";

export class CoroinhaSelectScreenOptions{
    static excludedCoroinhas:Array<Coroinha> = []
    static selectMode:string = ""
    static selected:Array<Coroinha> = []
    static action:Function = ()=>{}
    static lineup:CoroinhaLineup = new CoroinhaLineup() 
}

export default function List(){
    
    const coroinhas = []
    let lineup = CoroinhaSelectScreenOptions.lineup

    let all = CoroinhaData.allCoroinhas
    if(all != null){
        for(let i = 0; i < all.length;i++){
            let curCoroinha = all[i]
            
            if(!isExcluded(curCoroinha) && isDayAvailable && curCoroinha.onLineup){
                coroinhas.push(<SelectableRowCoroinha nick={curCoroinha.nick} coroinha={curCoroinha} id={i} img={require("@/src/app/shapes/coroinha_ico.png")} key={i} textStyle=
                    {{fontFamily:"Inter-Bold",
                      fontSize:20
                    }} 
                    acolyte={curCoroinha}/>)
            }
        }
    }
    
    return(
        
        <View style={{flex:1,flexDirection:"column"}}>
            <UpperBar/>

        <ScrollView style={{flex:1}}> 
            {coroinhas} 
        </ScrollView>   
        
            
        </View>
    )
}

export const UpperBar = () => {
    return(
        <View style = {[Global.styles.rowContainer,{backgroundColor:"#fca4a4"}]}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            padding:26,
            paddingRight:40,
            paddingLeft:40,
            resizeMode:"contain"}} 
            
            source={require("@/src/app/shapes/coroinha_ico.png")}/>
            
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
            
        </View>
    )
}

function SelectableRowCoroinha(props:any){
    
    let [checked,setChecked] = useState(false)
    let checkBox

    if(CoroinhaSelectScreenOptions.selectMode == "Multiple")
        checkBox = <VisualCheckBox checked={checked} imageStyle={{alignSelf:"flex-end"}} />
    return(
      <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={() => {
        if(CoroinhaSelectScreenOptions.selectMode == "Single"){
            CoroinhaSelectScreenOptions.selected.push(props.coroinha)
            CoroinhaSelectScreenOptions.action()
        }
        if(CoroinhaSelectScreenOptions.selectMode == "Multiple"){
            if(checked){
                CoroinhaSelectScreenOptions.selected.splice(CoroinhaSelectScreenOptions.selected.indexOf(props.coroinha),1)
                setChecked(false)
            }
            else{
                CoroinhaSelectScreenOptions.selected.push(props.coroinha)
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
    for(let h = 0; h < CoroinhaSelectScreenOptions.excludedCoroinhas.length;h++){
        if(member == CoroinhaSelectScreenOptions.excludedCoroinhas[h]){   
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