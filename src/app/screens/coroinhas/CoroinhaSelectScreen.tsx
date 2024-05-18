import { View,Image,Text, ScrollView, TouchableOpacity } from "react-native";
import { Global } from "@/src/app/Global";
import { CheckBox, ImageButton,LinkImageButton, LinkRowImageButton, RowAcolyte, RowImageButton, VisualCheckBox } from "@/src/app/classes/NewComps";
import { router } from "expo-router";
import { useState } from "react";
import { Coroinha, CoroinhaData } from "@/src/app/classes/CoroinhaData";
import { CoroinhaSingleLineupScreen } from "./CoroinhaSingleLineup";
import { CoroinhaLineup } from "../../classes/CoroinhaLineup";
import { CoroinhaLineupScreenOptions } from "./CoroinhaLineupScreen";

export class CoroinhaSelectScreenOptions{
    static excludedCoroinhas:Array<Coroinha> = []
    static selectMode:string = ""
    static selected:Array<Coroinha> = []
    static action:Function = ()=>{}
    static lineup:CoroinhaLineup = new CoroinhaLineup() 
}

export default function List(){
    
    const coroinhas = []
    //let lineup = CoroinhaSingleLineupScreen.curLineup
    
    console.log("All coroinhas size: "+CoroinhaData.allCoroinhas.length)
    console.log("Excluded coroinhas size: "+CoroinhaSelectScreenOptions.excludedCoroinhas.length)
    if(CoroinhaData.allCoroinhas!=null){
        for(let i =0; i <CoroinhaData.allCoroinhas.length;i++){
            
            let curCor = CoroinhaData.allCoroinhas[i]
            console.log("Checking process: "+i+"/"+(CoroinhaData.allCoroinhas.length-1))
            console.log("Checking for substitute: "+curCor.nick)

            for(let h = 0; h < CoroinhaSelectScreenOptions.excludedCoroinhas.length; h++){
                console.log("H Process: "+h+"/"+(CoroinhaSelectScreenOptions.excludedCoroinhas.length-1))
                if(curCor == CoroinhaSelectScreenOptions.excludedCoroinhas[h]){
                    console.log("Current coroinha: "+curCor.nick+" already chosen! Excluding...")
                    break
                }
                if(!curCor.onLineup){
                    console.log("Current coroinha: "+curCor.nick+" out of lineup, excluding...")
                    break
                }
                
                if(CoroinhaSelectScreenOptions.lineup.day != "Outro" && CoroinhaSelectScreenOptions.lineup.weekend != "Outro"){
                    if(!curCor.disp[CoroinhaSelectScreenOptions.lineup.weekend][CoroinhaSelectScreenOptions.lineup.day]){
                        console.log("Current coroinha: "+curCor.nick+" dont have availability to this day, excluding...")
                        break
                    }
                }
                
                if(h >= CoroinhaSelectScreenOptions.excludedCoroinhas.length-1){
                    console.log("Coroinha: "+curCor.nick+" added to the list.")
                    coroinhas.push(<SelectableRowCoroinha nick={CoroinhaData.allCoroinhas[i].nick} id={i} img={require("@/src/app/shapes/coroinha_ico.png")} key={i} textStyle=
                    {{fontFamily:"Inter-Bold",
                      fontSize:20
                    }} 
                    coroinha={CoroinhaData.allCoroinhas[i]}/>)
                    
                }
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
        console.log("Select mode is: "+CoroinhaSelectScreenOptions.selectMode)
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