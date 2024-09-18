import { View,Image,Text } from "react-native"
import { Global } from "../../Global"
import { CheckBox, LinkRowImageButton, RowImageButton, SingleCheck, SingleCheckColor, TextButton } from "../../classes/NewComps"
import { Lineup } from "../../classes/Lineup"
import { GenerateLineup, GenerateRandomLineup } from "../../classes/FlexLineupGenerator"
import { router } from "expo-router"
import { StyleSheet } from "react-native"
import { useState } from "react"
import { CoroinhaLineupScreenOptions } from "@/src/app/screens/coroinhas/CoroinhaLineupScreen"
import { FlexToCoroinhaLineup, ResetAllLastWeekend } from "../../classes/Methods"
import { CoroinhaData } from "../../classes/CoroinhaData"

export class CoroinhaWeekendLineupScreen{
    static curLineup:any = null

    static generateOptions= {
        "weekend":"1stWE",
        "day":null,
        "allowOut":false,
        "allRandom":false,
        "solemnity":false,
        "reduced":false,
        "celebration":false
    }
}

export default function LineupOptions(){
    Global.currentScreen = {screenName:"Nova escala | Fim de semana",iconPath:""}

    let [weekend,setWeekend] = useState("1stWE")
    let days:Array<any> = ["sabado","domingoAM","domingoPM"]
    let daysNames:Array<any> = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    CoroinhaWeekendLineupScreen.generateOptions.allRandom = false
    CoroinhaWeekendLineupScreen.generateOptions.solemnity = false
    CoroinhaWeekendLineupScreen.generateOptions.reduced = false
    CoroinhaWeekendLineupScreen.generateOptions.celebration = false
    CoroinhaWeekendLineupScreen.generateOptions.allowOut = false
    let[liturgicalColor,setColor] = useState("red")
    return(
        <View style={{flex:1}}>
            <UpperBar/>
            
            <View style={{flex:1}}>
                {/*}
                <View style={{height:80,backgroundColor:"#9BFFF9"}}>
                    <Text style={Global.textStyles.dataSection}>-Celebração</Text>
                </View>
                
                <View style={{flexDirection:"row"}}>
                    <SingleCheckColor color={"green"} check={liturgicalColor == "green" ? true : false} press={()=>{setColor("green");console.log("green "+liturgicalColor)}}/>
                    <SingleCheckColor color={"red"} check={liturgicalColor == "red" ? true : false} press={()=>{setColor("red");console.log("red "+liturgicalColor)}}/>
                    <SingleCheckColor color={"pink"} check={liturgicalColor == "pink" ? true : false} press={()=>{setColor("pink");console.log("pink "+liturgicalColor)}}/>
                    <SingleCheckColor color={"white"} check={liturgicalColor == "white" ? true : false} press={()=>{setColor("white");console.log("white "+liturgicalColor)}}/>
                    <SingleCheckColor color={"purple"} check={liturgicalColor == "purple" ? true : false} press={()=>{setColor("purple");console.log("purple "+liturgicalColor)}}/>
                </View>
                {*/}


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
                    <CheckBox checked={false} press={()=>{CoroinhaWeekendLineupScreen.generateOptions.allRandom = !CoroinhaWeekendLineupScreen.generateOptions.allRandom}}/>
                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Escala reduzida</Text>
                    <CheckBox checked={false} press={()=>{CoroinhaWeekendLineupScreen.generateOptions.reduced = !CoroinhaWeekendLineupScreen.generateOptions.reduced}}/>
                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Celebração</Text>
                    <CheckBox checked={false} press={()=>{CoroinhaWeekendLineupScreen.generateOptions.celebration = !CoroinhaWeekendLineupScreen.generateOptions.celebration}}/>
                </View>
                
                <TextButton text="Gerar escala" press={()=>{

                
            // Definir funções se for solenidade ou não, escala reduzida ou celebração
            let roles = []
            if(CoroinhaWeekendLineupScreen.generateOptions.reduced && !CoroinhaWeekendLineupScreen.generateOptions.celebration){
                roles = ["donsD","donsE"]
                CoroinhaLineupScreenOptions.roles = ["donsD","donsE"]
                CoroinhaLineupScreenOptions.rolesNames = ["Dons D.","Dons E."]
            }
            else if(CoroinhaWeekendLineupScreen.generateOptions.celebration){
                roles = ["cestD","cestE"]
                CoroinhaLineupScreenOptions.roles = ["cestD","cestE"]
                CoroinhaLineupScreenOptions.rolesNames = ["Cestinho D.","Cestinho E."]
            }
            else{
                if(CoroinhaWeekendLineupScreen.generateOptions.solemnity){
                    roles = ["donsD","donsE","cestD","cestE"]
                    CoroinhaLineupScreenOptions.roles = ["donsD","donsE","cestD","cestE"]
                    CoroinhaLineupScreenOptions.rolesNames = ["Dons D.","Dons E.","Cestinho D.","Cestinho E."]
                }
                else{
                    roles = ["donsD","donsE","cestD","cestE"]
                    CoroinhaLineupScreenOptions.roles = ["donsD","donsE","cestD","cestE"]
                    CoroinhaLineupScreenOptions.rolesNames = ["Dons D.","Dons E.","Cestinho D.","Cestinho E."]
                }
            }

                if(CoroinhaWeekendLineupScreen.generateOptions.allRandom){
                    CoroinhaLineupScreenOptions.lineups = []
                    CoroinhaLineupScreenOptions.days = days
                    CoroinhaLineupScreenOptions.daysNames = daysNames
                    for(let i = 0; i < days.length;i++){
                        let newLineup = FlexToCoroinhaLineup(GenerateRandomLineup(roles,"coroinha",weekend,days[i]))
                        CoroinhaLineupScreenOptions.lineups.push(newLineup)
                    }
                }
                else{
                    CoroinhaLineupScreenOptions.lineups = []
                    CoroinhaLineupScreenOptions.days = days
                    CoroinhaLineupScreenOptions.daysNames = daysNames
                    for(let i = 0; i < days.length;i++){
                        let newLineup = FlexToCoroinhaLineup(GenerateLineup(weekend,days[i],roles,"coroinha"))
                        CoroinhaLineupScreenOptions.lineups.push(newLineup)
                    }
                }

                if(!CoroinhaWeekendLineupScreen.generateOptions.allRandom){
                    ResetAllLastWeekend(CoroinhaData.allCoroinhas)
                }

                CoroinhaLineupScreenOptions.lineupType="Weekend"
                router.push("/screens/coroinhas/CoroinhaLineupScreen")  
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
        <View style = {[Global.styles.rowContainer,{backgroundColor:"#fca4a4"}]}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            padding:26,
            paddingRight:40,
            paddingLeft:40,
            resizeMode:"contain"}}  source={require("@/src/app/item_icons/escala_icomdpi.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
        </View>
    )
}

