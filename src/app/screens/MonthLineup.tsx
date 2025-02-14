import { View,Image,Text, ScrollView } from "react-native"
import { Global } from "../Global"
import { CheckBox, SingleCheck, TextButton } from "../classes/NewComps"
import { Lineup } from "../classes/Lineup"
import { GenerateLineup, GenerateRandomLineup } from "../classes/FlexLineupGenerator"
import { router } from "expo-router"
import { AcolyteData } from "../classes/AcolyteData"
import { useState } from "react"
import { LineupScreenOptions } from "./LineupScreen"
import { FlexToAcolyteLineup, GenerateLineupPrompt, ResetAllLastWeekend } from "../classes/Methods"


enum Randomness{
    LOW = 1,
    MEDIUM_LOW = 1.3,
    MEDIUM = 1.6,
    MEDIUM_HIGH = 1.7,
    HIGH = 2
}

export class MonthlyLineupScreen{
    static curLineup:any = null

    static generateOptions= {
        "weekend":"1stWE",
        "day":null,
        "allowOut":false,
        "allRandom":false,
        "solemnity":false,
        "monthDays":new Map<string,Array<string>>(),
        "randomness":Randomness.MEDIUM,
        "dayRotation":true
    }
}

export default function LineupOptions(){
    Global.currentScreen = {screenName:"Nova escala | Mensal",iconPath:""}

    let [weekend,setWeekend] = useState("1stWE")
    let days:Array<any> = ["sabado","domingoAM","domingoPM"]
    let daysNames:Array<any> = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    
    let[liturgicalColor,setColor] = useState("red")
    let[randomness,setRandomness] = useState(0)

    MonthlyLineupScreen.generateOptions.allRandom = false
    MonthlyLineupScreen.generateOptions.solemnity = false
    MonthlyLineupScreen.generateOptions.allowOut = false
    DefaultMonthDays()

    return(
        <View style={{flex:1}}>
            <UpperBar/>
            
            <ScrollView style={{flex:1}}>

                <View style={{height:80,backgroundColor:"#9BFFF9"}}>
                    <Text style={Global.textStyles.dataSection}>-Opções</Text>
                </View>
                
                {/* < Opções de aleatoriedade > */}
                <Text style = {[Global.textStyles.dataText,{padding:10}]}>Aleatoriedade</Text>
                <View style={{flexDirection:"row",alignItems:"center",flex:0.5,alignContent:"center"}}>
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center"}}>
                        <Text numberOfLines={1} style={{fontFamily:"Inter-Light",fontSize:15}}>+ Baixa</Text>
                        <SingleCheck img={CheckImage(randomness,Randomness.LOW)} checked={randomness == Randomness.LOW} press={()=>{setRandomness(Randomness.LOW),MonthlyLineupScreen.generateOptions.randomness = Randomness.LOW}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>Baixa</Text>
                        <SingleCheck img={CheckImage(randomness,Randomness.MEDIUM_LOW)} checked={randomness == Randomness.MEDIUM_LOW} press={()=>{setRandomness(Randomness.MEDIUM_LOW),MonthlyLineupScreen.generateOptions.randomness = Randomness.MEDIUM_LOW}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>Normal</Text>
                        <SingleCheck img={CheckImage(randomness,Randomness.MEDIUM)} checked={randomness == Randomness.MEDIUM} press={()=>{setRandomness(Randomness.MEDIUM),MonthlyLineupScreen.generateOptions.randomness = Randomness.MEDIUM}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>Alta</Text>
                        <SingleCheck img={CheckImage(randomness,Randomness.MEDIUM_HIGH)} checked={randomness == Randomness.MEDIUM_HIGH} press={()=>{setRandomness(Randomness.MEDIUM_HIGH),MonthlyLineupScreen.generateOptions.randomness = Randomness.MEDIUM_HIGH}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>+ Alta</Text>
                        <SingleCheck img={CheckImage(randomness,Randomness.HIGH)} checked={randomness == Randomness.HIGH} press={()=>{setRandomness(Randomness.HIGH),MonthlyLineupScreen.generateOptions.randomness = Randomness.HIGH}}/>
                    </View>
                </View>
                {/* </ Opções de aleatoriedade > */}
                
                <View style={{flex:1}}>
                    <View style={{flexDirection:"row",alignItems:"center",padding:10}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Totalmente aleatório</Text>
                        <CheckBox checked={false} press={()=>{MonthlyLineupScreen.generateOptions.allRandom = !MonthlyLineupScreen.generateOptions.allRandom}}/>
                    </View>

                    <View style={{flexDirection:"row",alignItems:"center",padding:10}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Rodízio diário</Text>
                        <CheckBox checked={true} press={()=>{MonthlyLineupScreen.generateOptions.dayRotation = !MonthlyLineupScreen.generateOptions.dayRotation}}/>
                    </View>
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
                                    {ToggleDay("2ndWE","sabado")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("2ndWE","domingoAM")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("2ndWE","domingoPM")}}/>

                        </View>

                        <View style={{flexDirection:"row", alignItems:"center",padding:10}}>
                            <Text style={{flex:1,paddingLeft:10,paddingRight:20}}>Terceiro</Text>
                            <CheckBox checked={true} press = {()=>
                                    {ToggleDay("3rdWE","sabado")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("3rdWE","domingoAM")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("3rdWE","domingoPM")}}/>

                        </View>

                        <View style={{flexDirection:"row", alignItems:"center",padding:10}}>
                            <Text style={{flex:1,paddingLeft:10,paddingRight:20}}>Quarto</Text>
                            <CheckBox checked={true} press = {()=>
                                    {ToggleDay("4thWE","sabado")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("4thWE","domingoAM")}}/>
                                <CheckBox checked={true} press = {()=>
                                    {ToggleDay("4thWE","domingoPM")}}/>

                        </View>

                        <View style={{flexDirection:"row", alignItems:"center",padding:10}}>
                            <Text style={{flex:1,paddingLeft:10,paddingRight:20}}>Quinto</Text>
                            <CheckBox checked={false} press = {()=>
                                    {ToggleDay("5thWE","sabado")}}/>
                                <CheckBox checked={false} press = {()=>
                                    {ToggleDay("5thWE","domingoAM")}}/>
                                <CheckBox checked={false} press = {()=>
                                    {ToggleDay("5thWE","domingoPM")}}/>

                        </View>
                        
  
                    </View>
                </View>

                <TextButton text="Gerar escala" press={()=>{

                
                // Definir funções se for solenidade ou não
                let roles = []
                if(MonthlyLineupScreen.generateOptions.solemnity){
                    roles = ["cero1","cero2","turib","navet","libri","cruci"]
                    LineupScreenOptions.roles = ["cero1","cero2","turib","navet","libri","cruci"]
                }
                else{
                    roles = ["cero1","cero2","libri","cruci"]
                    LineupScreenOptions.roles = ["cero1","cero2","libri","cruci"]
                }

                
                let generatedLineups:Map<string,Array<Lineup>> = new Map<string,Array<Lineup>>()
                let allLineups:Array<Lineup> = new Array<Lineup>()

                if(MonthlyLineupScreen.generateOptions.allRandom){
                    LineupScreenOptions.lineups = []
                    LineupScreenOptions.days = days
                    LineupScreenOptions.daysNames = daysNames
                          
                    let weekends = Array.from(MonthlyLineupScreen.generateOptions.monthDays.keys())
                    
                    for(let i = 0; i < weekends.length;i++){
                        let weekendKey = weekends[i] // Finais de semana
                        let curWeekend = MonthlyLineupScreen.generateOptions.monthDays.get(weekendKey) // Dias no fim de semana
                        
                        generatedLineups.set(weekendKey,new Array<Lineup>)
                        
                        if(curWeekend != undefined){
                            for(let k = 0; k < curWeekend.length;k++){
                                let curDay:string = curWeekend[k]
                                
                                //let newLineup = FlexToAcolyteLineup(GenerateRandomLineup(roles,"acolito",weekendKey,curDay))
                                //generatedLineups.get(weekendKey)?.push(newLineup)
                                //allLineups.push(newLineup)
                            }
                        }
                        
                    }
                }

                else{
                    LineupScreenOptions.lineups = []
                    LineupScreenOptions.days = days
                    LineupScreenOptions.daysNames = daysNames
                    
                    
                    let weekends = Array.from(MonthlyLineupScreen.generateOptions.monthDays.keys())
                    
                    for(let i = 0; i < weekends.length;i++){
                        let weekendKey = weekends[i] // Finais de semana
                        let curWeekend = MonthlyLineupScreen.generateOptions.monthDays.get(weekendKey) // Dias no fim de semana
                        
                        generatedLineups.set(weekendKey,new Array<Lineup>)
                        /*
                        if(curWeekend != undefined){
                            for(let k = 0; k < curWeekend.length;k++){
                                let curDay:string = curWeekend[k]
                                
                                let newLineup = FlexToAcolyteLineup(GenerateLineup(
                                    weekendKey,
                                    curDay,
                                    roles,
                                    "acolito",
                                    MonthlyLineupScreen.generateOptions.randomness,
                                    MonthlyLineupScreen.generateOptions.dayRotation))
                                generatedLineups.get(weekendKey)?.push(newLineup)
                                allLineups.push(newLineup)
                            }
                        }
                            */
                    }
                }
                LineupScreenOptions.lineupType = "Month"
                LineupScreenOptions.monthLineups = generatedLineups
                LineupScreenOptions.allLineups = allLineups
                LineupScreenOptions.loaded = false
                
                if(!MonthlyLineupScreen.generateOptions.allRandom){
                    ResetAllLastWeekend(AcolyteData.allAcolytes)
                }
                
                router.push("/screens/LineupScreen")
                
                }}
                buttonStyle={{alignSelf:"center"}}/>
            </ScrollView>

        </View>
        )
    }
    
function ToggleDay(weekend:any,day:any){
    
    let days = MonthlyLineupScreen.generateOptions.monthDays

    if(days.get(weekend) != undefined){
        let wk:any = days.get(weekend)
        
        if(wk.length>0){
            for(let i = 0; i < wk.length; i++){
                let curDay = wk[i]

                if(curDay == day){ //Se já tiver remove
                    wk.splice(i,1)
                    
                    if(wk.length == 0){ // Se não houver mais dias, remove o fim de semana.
                        days.delete(weekend)
                    }
                    break
                }

                if(i>=wk.length-1){ //Se não adiciona
                    wk.push(day)
                    break
                }
            }
        }
        else{
            wk.push(day)
        }
        
    }
    else{
        days.set(weekend,new Array<string>())
        let wk = days.get(weekend)
        wk?.push(day)
    }
    MonthlyLineupScreen.generateOptions.monthDays = days
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

