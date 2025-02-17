import { View,Image,Text } from "react-native"
import { Global } from "../Global"
import { CheckBox, LinkRowImageButton, RowImageButton, SingleCheck, SingleCheckColor, TextButton } from "../classes/NewComps"
import { Lineup } from "../classes/Lineup"
import { GenerateLineup, GenerateRandomLineup } from "../classes/FlexLineupGenerator"
import { router } from "expo-router"
import { StyleSheet } from "react-native"
import { Acolyte, AcolyteData } from "../classes/AcolyteData"
import { useState } from "react"
import { LineupScreenOptions } from "./LineupScreen"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { loadAcolyteData } from ".."
import { FlexToAcolyteLineup, ResetAllLastWeekend } from "../classes/Methods"

export class WeekendLineupScreen{
    static curLineup:any = null

    static generateOptions= {
        "weekend":"1stWE",
        "day":null,
        "allowOut":false,
        "allRandom":false,
        "solemnity":false
    }
}

export default function LineupOptions(){
    Global.currentScreen = {screenName:"Nova escala | Fim de semana",iconPath:""}

    let [weekend,setWeekend] = useState("1stWE")
    let days:Array<any> = ["sabado","domingoAM","domingoPM"]
    let daysNames:Array<any> = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    
    let[liturgicalColor,setColor] = useState("red")

    WeekendLineupScreen.generateOptions.allRandom = false
    WeekendLineupScreen.generateOptions.solemnity = false
    WeekendLineupScreen.generateOptions.allowOut = false
    return(
        <View style={{flex:1}}>
            <UpperBar/>
            
            <View style={{flex:1}}>
                <View style={{height:80,backgroundColor:"#9BFFF9"}}>
                    <Text style={Global.textStyles.dataSection}>-Opções</Text>
                </View>
             
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Fim de semana</Text>
                    <SingleCheck img={CheckImage(weekend,"1stWE")} topText="1°" press={()=>{setWeekend("1stWE")}}/>
                    <SingleCheck img={CheckImage(weekend,"2ndWE")} topText="2°" press={()=>{setWeekend("2ndWE")}}/>
                    <SingleCheck img={CheckImage(weekend,"3rdWE")} topText="3°" press={()=>{setWeekend("3rdWE")}}/>
                    <SingleCheck img={CheckImage(weekend,"4thWE")} topText="4°" press={()=>{setWeekend("4thWE")}}/>
                    <SingleCheck img={CheckImage(weekend,"5thWE")} topText="5°" press={()=>{setWeekend("5thWE")}}/>
                    <SingleCheck img={CheckImage(weekend,"Outro")} topText="Outro" press={()=>{setWeekend("Outro")}}/>
                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Horário</Text>
                    <CheckBox checked={true} topText="Sáb.19h" press={()=>{
                        if(days.includes("sabado")){
                            days.splice(days.indexOf("sabado"),1)
                            daysNames.splice(daysNames.indexOf("Sábado - 19h"),1)
                        }
                        else{
                            days.push("sabado")
                            daysNames.push("Sábado - 19h")
                        }
                    }}/>
                    <CheckBox checked={true} topText="Dom.08h" press={()=>{
                        if(days.includes("domingoAM")){
                            days.splice(days.indexOf("domingoAM"),1)
                            daysNames.splice(daysNames.indexOf("Domingo - 08h"),1)
                        }
                        else{
                            days.push("domingoAM")
                            daysNames.push("Domingo - 08h")
                        }
                    }}/>
                    <CheckBox checked={true} topText="Dom.19h" press={()=>{
                        if(days.includes("domingoPM")){
                            days.splice(days.indexOf("domingoPM"),1)
                            daysNames.splice(daysNames.indexOf("Domingo - 19h"),1)
                        }
                        else{
                            days.push("domingoPM")
                            daysNames.push("Domingo - 19h")
                        }
                    }}/>
                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Aleatório</Text>
                    <CheckBox checked={false} press={()=>{WeekendLineupScreen.generateOptions.allRandom = !WeekendLineupScreen.generateOptions.allRandom}}/>
                </View>
                
                <TextButton text="Gerar escala" press={()=>{

                
                // Definir funções se for solenidade ou não
                let roles = []
                if(WeekendLineupScreen.generateOptions.solemnity){
                    roles = ["cero1","cero2","turib","navet","libri","cruci"]
                    LineupScreenOptions.roles = ["cero1","cero2","turib","navet","libri","cruci"]
                    LineupScreenOptions.rolesNames = ["Ceroferário 1","Ceroferário 2","Turiferário","Naveteiro","Librífero","Cruciferário"]
                }
                else{
                    roles = ["cero1","cero2","libri","cruci"]
                    LineupScreenOptions.roles = ["cero1","cero2","libri","cruci"]
                    LineupScreenOptions.rolesNames = ["Ceroferário 1","Ceroferário 2","Librífero","Cruciferário"]
                }

                if(WeekendLineupScreen.generateOptions.allRandom){
                    LineupScreenOptions.lineups = []
                    LineupScreenOptions.days = days
                    LineupScreenOptions.daysNames = daysNames
                    for(let i = 0; i < days.length;i++){
                        loadAcolyteData()
                        let newLineup = FlexToAcolyteLineup(GenerateRandomLineup(roles,"acolito",weekend,days[i]))
                        LineupScreenOptions.lineups.push(newLineup)
                    }
                }
                else{
                    LineupScreenOptions.lineups = []
                    LineupScreenOptions.days = days
                    LineupScreenOptions.daysNames = daysNames
                    for(let i = 0; i < days.length;i++){
                        loadAcolyteData()
                        let newLineup = FlexToAcolyteLineup(GenerateLineup(weekend,days[i],roles,"acolito"))
                        LineupScreenOptions.lineups.push(newLineup)
                    }
                }
                
                if(!WeekendLineupScreen.generateOptions.allRandom){
                    ResetAllLastWeekend(AcolyteData.allAcolytes)   // Reseta o último fim de semana de todos os acólitos
                }

                LineupScreenOptions.lineupType="Weekend"
                LineupScreenOptions.loaded = false
                router.push("/screens/LineupScreen")  
            }}
                buttonStyle={{alignSelf:"center"}}/>
            </View>

        </View>
        )
    }
    

function CheckImage(value:any,id:any){
    if(value == id){
      return(require("@/src/app/shapes/check_true.png"))
    }
    else{
      return(require("@/src/app/shapes/check_false.png"))
    }
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
            resizeMode:"contain"}}  source={require("../item_icons/escala_icomdpi.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
        </View>
    )
}

