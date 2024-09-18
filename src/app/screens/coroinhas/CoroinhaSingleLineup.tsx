import { View,Image,Text } from "react-native"
import { Global } from "@/src/app/Global"
import { CheckBox, LinkRowImageButton, RowImageButton, SingleCheck, SingleCheckColor, TextButton } from "@/src/app/classes/NewComps"
import { Lineup } from "@/src/app/classes/Lineup"
import { GenerateLineup, GenerateRandomLineup } from "@/src/app/classes/FlexLineupGenerator"
import { router } from "expo-router"
import { StyleSheet } from "react-native"
import { useState } from "react"
import { CoroinhaLineupScreenOptions } from "./CoroinhaLineupScreen"
import { FlexToCoroinhaLineup } from "../../classes/Methods"

export class CoroinhaSingleLineupScreen{
    static curLineup:any = null
}

export default function LineupOptions(){
    Global.currentScreen = {screenName:"Nova escala única",iconPath:""}
    var generateOptions= {
        "weekend":"1stWE",
        "day":null,
        "allowOut":false,
        "allRandom":false,
        "solemnity":false,
        "monthDays":new Map<string,Array<string>>(),
        "reduced":false,
        "celebration":false     
    }

    let [weekend,setWeekend] = useState("1stWE")
    let[day,setDay] = useState("sabado")
    
    let[liturgicalColor,setColor] = useState("red")

    generateOptions.allRandom = false
    generateOptions.solemnity = false
    generateOptions.reduced = false
    generateOptions.celebration = false
    generateOptions.allowOut = false
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
                    <SingleCheck img={CheckImage(weekend,"Outro")} topText="Outro" press={()=>{setWeekend("Outro"), setDay("Outro")}}/>
                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Horário</Text>
                    <SingleCheck img={CheckImage(day,"sabado")} topText="Sáb.19h" press={()=>{setDay("sabado")}}/>
                    <SingleCheck img={CheckImage(day,"domingoAM")} topText="Dom.08h" press={()=>{setDay("domingoAM")}}/>
                    <SingleCheck img={CheckImage(day,"domingoPM")} topText="Dom.19h" press={()=>{setDay("domingoPM")}}/>
                    <SingleCheck img={CheckImage(day,"Outro")} topText="Outro" press={()=>{setDay("Outro"),setWeekend("Outro")}}/>

                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Aleatório</Text>
                    <CheckBox checked={false} press={()=>{generateOptions.allRandom = !generateOptions.allRandom}}/>
                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Escala reduzida</Text>
                    <CheckBox checked={false} press={()=>{generateOptions.reduced = !generateOptions.reduced}}/>
                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Celebração</Text>
                    <CheckBox checked={false} press={()=>{generateOptions.celebration = !generateOptions.celebration}}/>
                </View>
                
                <TextButton text="Gerar escala" press={()=>{
                console.log("Generating lineup with weekend = "+weekend)
                console.log("Generating lineup with day = "+day)
                
// Definir funções se for solenidade ou não, escala reduzida ou celebração
let roles = []
if(generateOptions.reduced && !generateOptions.celebration){
    roles = ["donsD","donsE"]
    CoroinhaLineupScreenOptions.roles = ["donsD","donsE"]
    CoroinhaLineupScreenOptions.rolesNames = ["Dons D.","Dons E."]
}
else if(generateOptions.celebration){
    roles = ["cestD","cestE"]
    CoroinhaLineupScreenOptions.roles = ["cestD","cestE"]
    CoroinhaLineupScreenOptions.rolesNames = ["Cestinho D.","Cestinho E."]
}
else{
    if(generateOptions.solemnity){
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
                if(generateOptions.allRandom){
                    CoroinhaLineupScreenOptions.lineups = []
                    CoroinhaLineupScreenOptions.lineups.push(FlexToCoroinhaLineup(GenerateRandomLineup(roles,"coroinha",weekend,day)))
                }
                else{
                    CoroinhaLineupScreenOptions.lineups = []
                    CoroinhaLineupScreenOptions.lineups.push(FlexToCoroinhaLineup(GenerateLineup(weekend,day,roles,"coroinha")))
                }
                
                console.log(CoroinhaSingleLineupScreen.curLineup)
                CoroinhaLineupScreenOptions.lineupType="Single"
                router.push("/screens/coroinhas/CoroinhaLineupScreen")
                
                }} buttonStyle={{alignSelf:"center"}}/>
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

