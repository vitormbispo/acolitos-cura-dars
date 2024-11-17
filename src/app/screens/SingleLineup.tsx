import { View,Image,Text } from "react-native"
import { Global } from "../Global"
import { CheckBox, LinkRowImageButton, RowImageButton, SingleCheck, SingleCheckColor, TextButton } from "../classes/NewComps"
import { Lineup } from "../classes/Lineup"
import { GenerateLineup, GenerateRandomLineup } from "../classes/FlexLineupGenerator"
import { router } from "expo-router"
import { StyleSheet } from "react-native"
import { Acolyte } from "../classes/AcolyteData"
import { useState } from "react"
import { LineupScreenOptions } from "./LineupScreen"
import { FlexToAcolyteLineup } from "../classes/Methods"

export class SingleLineupScreen{
    
    static generateOptions= {
        "weekend":"1stWE",
        "day":null,
        "allowOut":false,
        "allRandom":false,
        "solemnity":false
    }
    static curLineup:any = null
}

export default function LineupOptions(){
    Global.currentScreen = {screenName:"Nova escala única",iconPath:""}


    let [weekend,setWeekend] = useState("1stWE")
    let[day,setDay] = useState("sabado")
    
    let[liturgicalColor,setColor] = useState("red")

    SingleLineupScreen.generateOptions.allRandom = false
    SingleLineupScreen.generateOptions.solemnity = false
    SingleLineupScreen.generateOptions.allowOut = false
    return(
        <View style={{flex:1}}>
            <UpperBar/>
            
            <View style={{flex:1}}>
                
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
                
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Solenidade</Text>
                    <CheckBox checked={false} press={()=>{SingleLineupScreen.generateOptions.solemnity = !SingleLineupScreen.generateOptions.solemnity}}/>
                </View>


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
                    <CheckBox checked={false} press={()=>{SingleLineupScreen.generateOptions.allRandom = !SingleLineupScreen.generateOptions.allRandom}}/>
                </View>

                
                
                <TextButton text="Gerar escala" press={()=>{
                console.log("Generating lineup with weekend = "+weekend)
                console.log("Generating lineup with day = "+day)
                
                let roles = []
                if(SingleLineupScreen.generateOptions.solemnity){
                    roles = ["cero1","cero2","turib","navet","libri","cruci"]
                    LineupScreenOptions.roles = ["cero1","cero2","turib","navet","libri","cruci"]
                    LineupScreenOptions.rolesNames = ["Ceroferário 1","Ceroferário 2","Turiferário","Naveteiro","Librífero","Cruciferário"]
                }
                else{
                    roles = ["cero1","cero2","libri","cruci"]
                    LineupScreenOptions.roles = ["cero1","cero2","libri","cruci"]
                    LineupScreenOptions.rolesNames = ["Ceroferário 1","Ceroferário 2","Librífero","Cruciferário"]
                }

                if(SingleLineupScreen.generateOptions.allRandom){
                    LineupScreenOptions.lineups = []
                    LineupScreenOptions.lineups.push(FlexToAcolyteLineup(GenerateRandomLineup(roles,"acolito",weekend,day)))
                }
                else{
                    LineupScreenOptions.lineups = []
                    LineupScreenOptions.lineups.push(FlexToAcolyteLineup(GenerateLineup(weekend,day,roles,"acolito")))
                }
                
                LineupScreenOptions.loaded = false,
                LineupScreenOptions.lineupType="Single",
                router.push("/screens/LineupScreen")
                

                
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

