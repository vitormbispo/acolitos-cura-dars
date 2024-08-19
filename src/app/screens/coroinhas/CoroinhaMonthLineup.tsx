import { View,Image,Text } from "react-native"
import { Global } from "@/src/app/Global"
import { CheckBox, LinkRowImageButton, RowImageButton, SingleCheck, SingleCheckColor, TextButton } from "@/src/app/classes/NewComps"
import { CoroinhaLineup } from "@/src/app/classes/CoroinhaLineup"
import { GenerateLineup, GenerateRandomLineup } from "@/src/app/classes/CoroinhaLineupGenerator"
import { router } from "expo-router"
import { useState } from "react"
import { CoroinhaLineupScreenOptions } from "@/src/app/screens/coroinhas/CoroinhaLineupScreen"

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
        "celebration":false
    }
}

export default function LineupOptions(){
    Global.currentScreen = {screenName:"Nova escala | Mensal",iconPath:""}

    let [weekend,setWeekend] = useState("1stWE")
    let days:Array<any> = ["sabado","domingoAM","domingoPM"]
    let daysNames:Array<any> = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    
    let[liturgicalColor,setColor] = useState("red")

    CoroinhaMonthlyLineupScreen.generateOptions.allRandom = false
    CoroinhaMonthlyLineupScreen.generateOptions.solemnity = false
    CoroinhaMonthlyLineupScreen.generateOptions.reduced = false
    CoroinhaMonthlyLineupScreen.generateOptions.celebration = false
    CoroinhaMonthlyLineupScreen.generateOptions.allowOut = false
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
                    <CheckBox checked={false} press={()=>{CoroinhaMonthlyLineupScreen.generateOptions.allRandom = !CoroinhaMonthlyLineupScreen.generateOptions.allRandom}}/>
                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Escala reduzida</Text>
                    <CheckBox checked={false} press={()=>{CoroinhaMonthlyLineupScreen.generateOptions.reduced = !CoroinhaMonthlyLineupScreen.generateOptions.reduced}}/>
                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Celebração</Text>
                    <CheckBox checked={false} press={()=>{CoroinhaMonthlyLineupScreen.generateOptions.celebration = !CoroinhaMonthlyLineupScreen.generateOptions.celebration}}/>
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
                                
                                let newLineup = GenerateRandomLineup(roles,weekendKey,curDay)
                                generatedLineups.get(weekendKey)?.push(newLineup)
                                allLineups.push(newLineup)
                            }
                        }
                        
                    }
                }

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
                                
                                let newLineup = GenerateLineup(weekendKey,curDay,roles)
                                generatedLineups.get(weekendKey)?.push(newLineup)
                                allLineups.push(newLineup)
                            }
                        }
                    }
                }
                console.log("---MONTHLY LINEUP COMPLETED---")
                console.log(generatedLineups)
                CoroinhaLineupScreenOptions.lineupType = "Month"
                CoroinhaLineupScreenOptions.monthLineups = generatedLineups
                
                CoroinhaLineupScreenOptions.allLineups = allLineups
                console.log("AllLineups: ")
                console.log(CoroinhaLineupScreenOptions.allLineups)
                router.push("/screens/coroinhas/CoroinhaLineupScreen")
                
            }}
                buttonStyle={{alignSelf:"center"}}/>
            </View>

        </View>
        )
    }
    
function ToggleDay(weekend:any,day:any){
    
    let days = CoroinhaMonthlyLineupScreen.generateOptions.monthDays
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
                    console.log("Wk length: ")
                    console.log(wk.length)
                    
                    if(wk.length == 0){
                        console.log("Deleting key: "+weekend)
                        days.delete(weekend)
                        console.log("Deleted? "+days.has(weekend))
                    }
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
    CoroinhaMonthlyLineupScreen.generateOptions.monthDays = days
    console.log(CoroinhaMonthlyLineupScreen.generateOptions.monthDays)
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

