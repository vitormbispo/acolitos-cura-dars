import { View,Image,Text, ScrollView, TouchableOpacity } from "react-native";
import { Global } from "../Global";
import { CheckBox, ImageButton,LinkImageButton, LinkRowImageButton, RowAcolyte, RowImageButton, VisualCheckBox } from "../classes/NewComps";
import { Acolyte, AcolyteData } from "../classes/AcolyteData";
import { router } from "expo-router";
import { useState } from "react";
import { SingleLineupScreen } from "./SingleLineup";
import { Lineup } from "../classes/Lineup";

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
    if(AcolyteData.allAcolytes!=null){
        for(let i =0;i<AcolyteData.allAcolytes.length;i++){
            
            let curAco = AcolyteData.allAcolytes[i]
            
            for(let h = 0; h < AcolyteSelectScreenOptions.excludedAcolytes.length; h++){
                console.log("H Process: "+h+"/"+(AcolyteSelectScreenOptions.excludedAcolytes.length-1))
                if(curAco == AcolyteSelectScreenOptions.excludedAcolytes[h]){
                    console.log("Current coroinha: "+curAco.nick+" already chosen! Excluding...")
                    break
                }
                if(!curAco.onLineup){
                    console.log("Current coroinha: "+curAco.nick+" out of lineup, excluding...")
                    break
                }
                
                if(lineup.day != "Outro" && lineup.weekend != "Outro"){
                    if(!curAco.disp[lineup.weekend][lineup.day]){
                        console.log("Current coroinha: "+curAco.nick+" dont have availability to this day, excluding...")
                        console.log("The weekend is: "+lineup.weekend," The day is: "+lineup.day)
                        console.log("Current acolyte availability")
                        console.log(curAco.disp)
                        console.log("True or false: "+curAco.disp[lineup.weekend][lineup.day])
                        break
                    }
                }
                
                if(h >= AcolyteSelectScreenOptions.excludedAcolytes.length-1){
                    console.log("Coroinha: "+curAco.nick+" added to the list.")
                    acolytes.push(<SelectableRowAcolyte nick={AcolyteData.allAcolytes[i].nick} id={i} img={require("@/src/app/shapes/coroinha_ico.png")} key={i} textStyle=
                    {{fontFamily:"Inter-Bold",
                      fontSize:20
                    }} 
                    acolyte={AcolyteData.allAcolytes[i]}/>)
                    
                }
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