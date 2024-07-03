import { View,Image,Text } from "react-native"
import { Global } from "../Global"
import { CheckBox, LinkRowImageButton, RowImageButton, SingleCheck, SingleCheckColor, TextButton } from "../classes/NewComps"
import { Lineup } from "../classes/Lineup"
import { GenerateLineup, GenerateRandomLineup } from "../classes/LineupGenerator"
import { router } from "expo-router"
import { StyleSheet } from "react-native"
import { Acolyte, AcolyteData } from "../classes/AcolyteData"
import { useState } from "react"
import { LineupScreenOptions } from "./LineupScreen"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { loadAcolyteData } from ".."

export class MonthlyLineupScreen{
    static curLineup:any = null

    static generateOptions= {
        "weekend":"1stWE",
        "day":null,
        "allowOut":false,
        "allRandom":false,
        "solemnity":false,
        "monthDays":new Map<string,Array<string>>()
    }
}

export default function LineupOptions(){
    Global.currentScreen = {screenName:"Nova escala | Mensal",iconPath:""}

    let [weekend,setWeekend] = useState("1stWE")
    let days:Array<any> = ["sabado","domingoAM","domingoPM"]
    let daysNames:Array<any> = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    
    let[liturgicalColor,setColor] = useState("red")

    MonthlyLineupScreen.generateOptions.allRandom = false
    MonthlyLineupScreen.generateOptions.solemnity = false
    MonthlyLineupScreen.generateOptions.allowOut = false
    DefaultMonthDays()

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
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Aleatório</Text>
                    <CheckBox checked={false} press={()=>{MonthlyLineupScreen.generateOptions.allRandom = !MonthlyLineupScreen.generateOptions.allRandom}}/>
                </View>
                
                <View style={{paddingTop:20}}>
                    <View style={{flexDirection:"row",alignContent:"space-between",paddingLeft:100}}>
                        <Text style={{flex:1}}>Sábado - 19h</Text>
                        <Text style={{flex:1}}>Domingo - 08h</Text>
                        <Text style={{flex:1}}>Domingo - 19h</Text>
                    </View>
                    
                    <View>
                        <View style={{flexDirection:"row", alignItems:"center",padding:10}}>
                            <Text style={{flex:1,paddingLeft:10,paddingRight:20}}>Primeiro</Text>
                            <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","sabado")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","domingoAM")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","domingoPM")}}/>

                        </View>

                        <View style={{flexDirection:"row", alignItems:"center",padding:10}}>
                            <Text style={{flex:1,paddingLeft:10,paddingRight:20}}>Segundo</Text>
                            <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","sabado")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","domingoAM")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","domingoPM")}}/>

                        </View>

                        <View style={{flexDirection:"row", alignItems:"center",padding:10}}>
                            <Text style={{flex:1,paddingLeft:10,paddingRight:20}}>Terceiro</Text>
                            <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","sabado")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","domingoAM")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","domingoPM")}}/>

                        </View>

                        <View style={{flexDirection:"row", alignItems:"center",padding:10}}>
                            <Text style={{flex:1,paddingLeft:10,paddingRight:20}}>Quarto</Text>
                            <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","sabado")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","domingoAM")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","domingoPM")}}/>

                        </View>

                        <View style={{flexDirection:"row", alignItems:"center",padding:10}}>
                            <Text style={{flex:1,paddingLeft:10,paddingRight:20}}>Quinto</Text>
                            <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","sabado")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","domingoAM")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("1stWE","domingoPM")}}/>

                        </View>
                        
  
                    </View>
                </View>

                <TextButton text="Gerar escala" press={()=>{

                
                // Definir funções se for solenidade ou não
                let roles = []
                if(MonthlyLineupScreen.generateOptions.solemnity){
                    roles = ["cero1","cero2","turib","navet","libri","cruci"]
                    LineupScreenOptions.roles = ["cero1","cero2","turib","navet","libri","cruci"]
                    LineupScreenOptions.rolesNames = ["Ceroferário 1","Ceroferário 2","Turiferário","Naveteiro","Librífero","Cruciferário"]
                }
                else{
                    roles = ["cero1","cero2","libri","cruci"]
                    LineupScreenOptions.roles = ["cero1","cero2","libri","cruci"]
                    LineupScreenOptions.rolesNames = ["Ceroferário 1","Ceroferário 2","Librífero","Cruciferário"]
                }

                
                
                if(MonthlyLineupScreen.generateOptions.allRandom){
                    LineupScreenOptions.lineups = []
                    LineupScreenOptions.days = days
                    LineupScreenOptions.daysNames = daysNames
                    for(let i = 0; i < days.length;i++){
                        loadAcolyteData()
                        let newLineup = GenerateRandomLineup(roles)
                        LineupScreenOptions.lineups.push(newLineup)
                        console.log("Lineup of day: "+days[i])
                        console.log(newLineup)
                    }
                }
                else{
                    LineupScreenOptions.lineups = []
                    LineupScreenOptions.days = days
                    LineupScreenOptions.daysNames = daysNames
                    
                    /*
                    for(let i = 0; i < days.length;i++){
                        loadAcolyteData()
                        let newLineup = GenerateLineup(weekend,days[i],roles)
                        LineupScreenOptions.lineups.push(newLineup)
                        console.log("Lineup of day: "+days[i])
                        console.log(newLineup)
                    */
                    
                    // Mapa<"fim_de_semana"> -> Mapa<"dia_da_semana"> -> Lineup do dia
                    let generatedLineups:Map<string,Array<Lineup>> = new Map<string,Array<Lineup>>()

                    let weekends = Array.from(MonthlyLineupScreen.generateOptions.monthDays.keys())
                    
                    for(let i = 0; i < weekends.length;i++){
                        let weekendKey = weekends[i]
                        let curWeekend = MonthlyLineupScreen.generateOptions.monthDays.get(weekendKey)
                        
                        generatedLineups.set(weekendKey,new Array<Lineup>)
                        
                        if(curWeekend != undefined){
                            for(let k = 0; k < curWeekend.length;k++){
                                let curDay:string = curWeekend[k]
                                
                                let newLineup = GenerateLineup(weekendKey,curDay,roles)
                                generatedLineups.get(weekendKey)?.push(newLineup)
                            }
                        }
                        

                    }
                }
                
                LineupScreenOptions.lineupType = "Month"
                router.push("/screens/LineupScreen")
                
            }}
                buttonStyle={{alignSelf:"center"}}/>
            </View>

        </View>
        )
    }
    
function ToggleDay(weekend:any,day:any){
    
    let days = MonthlyLineupScreen.generateOptions.monthDays
    console.log("Start day: ")
    console.log(days)

    if(days.get(weekend) != undefined){
        let wk:any = days.get(weekend)
        console.log("WK: "+wk)
        console.log("Size: "+wk.length)
        
        if(wk.length>0){
            console.log("Valid weekend")
            
            for(let i = 0; i < wk.length; i++){
                let curDay = wk[i]
                console.log("Index: "+i+" Size: "+wk.length)
                console.log("Cur day: "+curDay+" Day: "+day)
                if(curDay == day){ //Se já tiver remove
                    wk.splice(i,1)
                    console.log("Removeee")
                    console.log("New wk: ")
                    console.log(wk)
                    break
                }

                if(i>=wk.length-1){ //Se nao adiciona
                    wk.push(day)
                    console.log("Day added")
                    break
                }
            }
        }
        else{
            wk.push(day)
            console.log("Day added")
        }
        
    }
    else{
        days.set(weekend,new Array<string>())
        let wk = days.get(weekend)
        wk?.push(day)
    }
    MonthlyLineupScreen.generateOptions.monthDays = days
    console.log(MonthlyLineupScreen.generateOptions.monthDays)
}

function DefaultMonthDays(){
    let days = new Map<string,Array<string>>()

    days.set("1stWE",["sabado","domingoAM","domingoPM"])
    days.set("2ndWE",["sabado","domingoAM","domingoPM"])
    days.set("3rdWE",["sabado","domingoAM","domingoPM"])
    days.set("4thWE",["sabado","domingoAM","domingoPM"])

    MonthlyLineupScreen.generateOptions.monthDays = days


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

