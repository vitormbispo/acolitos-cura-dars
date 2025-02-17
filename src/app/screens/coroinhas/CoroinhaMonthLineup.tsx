import { View,Image,Text, ScrollView } from "react-native"
import { Global } from "@/src/app/Global"
import { CheckBox, LinkRowImageButton, RowImageButton, SingleCheck, SingleCheckColor, TextButton } from "@/src/app/classes/NewComps"
import { CoroinhaLineup } from "@/src/app/classes/CoroinhaLineup"
import { GenerateLineup, GenerateRandomLineup } from "@/src/app/classes/FlexLineupGenerator"
import { router } from "expo-router"
import { useState } from "react"
import { CoroinhaLineupScreenOptions } from "@/src/app/screens/coroinhas/CoroinhaLineupScreen"
import { FlexToCoroinhaLineup, ResetAllLastWeekend } from "../../classes/Methods"
import { CoroinhaData } from "../../classes/CoroinhaData"
import { MonthlyLineupScreen } from "../MonthLineup"


enum Randomness{
    LOW = 1,
    MEDIUM_LOW = 1.15,
    MEDIUM = 1.3,
    MEDIUM_HIGH = 1.7,
    HIGH = 2
}
export class CoroinhaMonthlyLineupScreen{
    static curLineup:any = null

    static generateOptions= {
        "weekend":"1stWE",
        "day":null,
        "allowOut":false,
        "allRandom":false,
        "solemnity":false,
        "monthDays":new Map<string,Array<string>>(),
        "reduced":false,
        "celebration":false,
        "dayRotation":true,
        "randomness":Randomness.MEDIUM
    }
}

export default function LineupOptions(){
    Global.currentScreen = {screenName:"Nova escala | Mensal",iconPath:""}

    let [weekend,setWeekend] = useState("1stWE")
    let days:Array<any> = ["sabado","domingoAM","domingoPM"]
    let daysNames:Array<any> = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    
    let[liturgicalColor,setColor] = useState("red")
    let[randomness,setRandomness] = useState(1.3)

    CoroinhaMonthlyLineupScreen.generateOptions.allRandom = false
    CoroinhaMonthlyLineupScreen.generateOptions.solemnity = false
    CoroinhaMonthlyLineupScreen.generateOptions.reduced = false
    CoroinhaMonthlyLineupScreen.generateOptions.celebration = false
    CoroinhaMonthlyLineupScreen.generateOptions.allowOut = false
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
                <View style={{flexDirection:"row",alignItems:"center",flex:0.3,alignContent:"center"}}>
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center"}}>
                        <Text numberOfLines={1} style={{fontFamily:"Inter-Light",fontSize:15}}>+ Baixa</Text>
                        <SingleCheck img={CheckImage(randomness,Randomness.LOW)} checked={randomness == Randomness.LOW} press={()=>{setRandomness(Randomness.LOW),CoroinhaMonthlyLineupScreen.generateOptions.randomness = Randomness.LOW}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>Baixa</Text>
                        <SingleCheck img={CheckImage(randomness,Randomness.MEDIUM_LOW)} checked={randomness == Randomness.MEDIUM_LOW} press={()=>{setRandomness(Randomness.MEDIUM_LOW),CoroinhaMonthlyLineupScreen.generateOptions.randomness = Randomness.MEDIUM_LOW}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>Normal</Text>
                        <SingleCheck img={CheckImage(randomness,1.3)} checked={randomness == Randomness.MEDIUM} press={()=>{setRandomness(Randomness.MEDIUM),CoroinhaMonthlyLineupScreen.generateOptions.randomness = Randomness.MEDIUM}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>Alta</Text>
                        <SingleCheck img={CheckImage(randomness,Randomness.MEDIUM_HIGH)} checked={randomness == Randomness.MEDIUM_HIGH} press={()=>{setRandomness(Randomness.MEDIUM_HIGH),CoroinhaMonthlyLineupScreen.generateOptions.randomness = Randomness.MEDIUM_HIGH}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>+ Alta</Text>
                        <SingleCheck img={CheckImage(randomness,Randomness.HIGH)} checked={randomness == Randomness.HIGH} press={()=>{setRandomness(Randomness.HIGH),CoroinhaMonthlyLineupScreen.generateOptions.randomness = Randomness.HIGH}}/>
                    </View>
                </View>
                {/* </ Opções de aleatoriedade > */}
                
                <View style ={{flex:1}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Totalmente aleatório</Text>
                        <CheckBox checked={false} press={()=>{CoroinhaMonthlyLineupScreen.generateOptions.allRandom = !CoroinhaMonthlyLineupScreen.generateOptions.allRandom}}/>
                    </View>

                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Rodízio diário</Text>
                        <CheckBox checked={true} press={()=>{CoroinhaMonthlyLineupScreen.generateOptions.dayRotation = !CoroinhaMonthlyLineupScreen.generateOptions.dayRotation}}/>
                    </View>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Escala reduzida</Text>
                        <CheckBox checked={false} press={()=>{CoroinhaMonthlyLineupScreen.generateOptions.reduced = !CoroinhaMonthlyLineupScreen.generateOptions.reduced}}/>
                    </View>

                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Celebração</Text>
                        <CheckBox checked={false} press={()=>{CoroinhaMonthlyLineupScreen.generateOptions.celebration = !CoroinhaMonthlyLineupScreen.generateOptions.celebration}}/>
                    </View>
                </View>
                
                
                
                <View style={{paddingTop:20,flex:1}}>
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

                if(!CoroinhaMonthlyLineupScreen.generateOptions.allRandom){
                    ResetAllLastWeekend(CoroinhaData.allCoroinhas)
                }
                // Definir funções se for solenidade ou não
                let roles = []
                if(CoroinhaMonthlyLineupScreen.generateOptions.reduced && !CoroinhaMonthlyLineupScreen.generateOptions.celebration){
                    roles = ["donsD","donsE"]
                    CoroinhaLineupScreenOptions.roles = ["donsD","donsE"]
                    CoroinhaLineupScreenOptions.rolesNames = ["Dons D.","Dons E."]
                }
                else if(CoroinhaMonthlyLineupScreen.generateOptions.celebration){
                    roles = ["cestD","cestE"]
                    CoroinhaLineupScreenOptions.roles = ["cestD","cestE"]
                    CoroinhaLineupScreenOptions.rolesNames = ["Cestinho D.","Cestinho E."]
                }
                else{
                    if(CoroinhaMonthlyLineupScreen.generateOptions.solemnity){
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
                
                let generatedLineups:Map<string,Array<CoroinhaLineup>> = new Map<string,Array<CoroinhaLineup>>()
                let allLineups:Array<CoroinhaLineup> = new Array<CoroinhaLineup>()

                // Gerando escala aleatória
                if(CoroinhaMonthlyLineupScreen.generateOptions.allRandom){
                    CoroinhaLineupScreenOptions.lineups = []
                    CoroinhaLineupScreenOptions.days = days
                    CoroinhaLineupScreenOptions.daysNames = daysNames
                          
                    let weekends = Array.from(CoroinhaMonthlyLineupScreen.generateOptions.monthDays.keys())
                    
                    for(let i = 0; i < weekends.length;i++){
                        let weekendKey = weekends[i] // Finais de semana
                        let curWeekend = CoroinhaMonthlyLineupScreen.generateOptions.monthDays.get(weekendKey) // Dias no fim de semana
                        
                        generatedLineups.set(weekendKey,new Array<CoroinhaLineup>)
                        
                        if(curWeekend != undefined){
                            for(let k = 0; k < curWeekend.length;k++){
                                let curDay:string = curWeekend[k]
                                
                                let newLineup = FlexToCoroinhaLineup(GenerateRandomLineup(roles,"coroinha",weekendKey,curDay))
                                generatedLineups.get(weekendKey)?.push(newLineup)
                                allLineups.push(newLineup)
                            }
                        }
                        
                    }
                }
                
                // Não aleatória
                else{
                    CoroinhaLineupScreenOptions.lineups = []
                    CoroinhaLineupScreenOptions.days = days
                    CoroinhaLineupScreenOptions.daysNames = daysNames
                    
                    
                    let weekends = Array.from(CoroinhaMonthlyLineupScreen.generateOptions.monthDays.keys())
                    
                    for(let i = 0; i < weekends.length;i++){
                        let weekendKey = weekends[i] // Finais de semana
                        let curWeekend = CoroinhaMonthlyLineupScreen.generateOptions.monthDays.get(weekendKey) // Dias no fim de semana
                        
                        generatedLineups.set(weekendKey,new Array<CoroinhaLineup>)
                        
                        if(curWeekend != undefined){
                            for(let k = 0; k < curWeekend.length;k++){
                                let curDay:string = curWeekend[k]
                                
                                let newLineup = FlexToCoroinhaLineup(GenerateLineup(weekendKey,curDay,roles,"coroinha",CoroinhaMonthlyLineupScreen.generateOptions.randomness,CoroinhaMonthlyLineupScreen.generateOptions.dayRotation))
                                generatedLineups.get(weekendKey)?.push(newLineup)
                                allLineups.push(newLineup)
                            }
                        }
                    }
                }
                CoroinhaLineupScreenOptions.lineupType = "Month"
                CoroinhaLineupScreenOptions.monthLineups = generatedLineups
                
                CoroinhaLineupScreenOptions.allLineups = allLineups

                if(!CoroinhaMonthlyLineupScreen.generateOptions.allRandom){
                    ResetAllLastWeekend(CoroinhaData.allCoroinhas)
                }

                CoroinhaLineupScreenOptions.scrollPos = 0
                CoroinhaLineupScreenOptions.scrollRef = null
                CoroinhaLineupScreenOptions.loaded = false
                
                router.push("/screens/coroinhas/CoroinhaLineupScreen")
                
                }}
                buttonStyle={{alignSelf:"center"}}/>
            </ScrollView>

        </View>
        )
    }
    
function ToggleDay(weekend:any,day:any){
    
    let days = CoroinhaMonthlyLineupScreen.generateOptions.monthDays

    if(days.get(weekend) != undefined){
        let wk:any = days.get(weekend)
        
        if(wk.length>0){
            for(let i = 0; i < wk.length; i++){
                let curDay = wk[i]

                if(curDay == day){ //Se já tiver remove
                    wk.splice(i,1)
                    
                    if(wk.length == 0){
                        days.delete(weekend)
                    }
                    break
                }

                if(i>=wk.length-1){ //Se nao adiciona
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
    CoroinhaMonthlyLineupScreen.generateOptions.monthDays = days
}

function DefaultMonthDays(){
    let days = new Map<string,Array<string>>()

    days.set("1stWE",["sabado","domingoAM","domingoPM"])
    days.set("2ndWE",["sabado","domingoAM","domingoPM"])
    days.set("3rdWE",["sabado","domingoAM","domingoPM"])
    days.set("4thWE",["sabado","domingoAM","domingoPM"])

    CoroinhaMonthlyLineupScreen.generateOptions.monthDays = days


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
            resizeMode:"contain"}}  source={require("@/src/app/item_icons/escala_icomdpi.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
        </View>
    )
}

