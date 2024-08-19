import { View, Image, Text, ScrollView } from "react-native"
import { ImageButton, TextButton } from "@/src/app/classes/NewComps"
import { CoroinhaSingleLineupScreen } from "@/src/app/screens/coroinhas/CoroinhaSingleLineup"
import { router } from "expo-router"
import { Global } from "@/src/app/Global"
import { StyleSheet } from "react-native"
import { GenerateLineup } from "@/src/app/classes/LineupGenerator"
import { Coroinha } from "../../classes/CoroinhaData"
import { CoroinhaSelectScreenOptions } from "./CoroinhaSelectScreen"
import { CoroinhaLineup } from "../../classes/CoroinhaLineup"
import { CopyToClipboard, GenerateLineupPrompt } from "../../classes/Methods"

const textStyles = StyleSheet.create({
    functionTitle:{
        fontFamily:"Inter-Bold",
        fontSize:20,
        alignSelf:"center",
        flex:1
    },
    coroinhaNick:{
        fontFamily:"Inter-Light",
        fontSize:20,
        alignSelf:"center",
        flex:1
    },

})

export class CoroinhaLineupScreenOptions{
    static lineupType = "Single"
    static roles = ["donsD","donsE","cestD","cestE"]
    static rolesNames = ["Dons D.","Dons E.","Cestinho D.","Cestinho E."]

    static days = ["sabado","domingoAM","domingoPM"]
    static daysNames = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    static daysMaps:Map<string,string> = new Map<string,string>([
        ["sabado","Sábado - 19h"],
        ["domingoAM","Domingo - 08h"],
        ["domingoPM","Domingo - 19h"]])
    static lineups:Array<CoroinhaLineup> = []
    static monthLineups:Map<string,Array<CoroinhaLineup>> = new Map<string,Array<CoroinhaLineup>>()
    static allLineups:Array<CoroinhaLineup> = new Array<CoroinhaLineup>()
}

let isSwitching = false
let switchingCoroinha:Coroinha // Coroinha que está sendo trocado
let coroinhaSwitched:Coroinha // Coroinha que entrará no lugar do trocado

let switchingCoroinhaRole:string // Role do coroinha que está sendo trocado
let coroinhaSwitchedRole:string // Role do coroinha que entrará no lugar do trocado

let switchingCoroinhaLineup:CoroinhaLineup
let coroinhaSwitchedLineup:CoroinhaLineup

let isReplacing = false
let replaced:Coroinha
let replacing:Coroinha

export default function LineupScreen(){
    Global.currentScreen.screenName = "Escala"
    
    let roles = CoroinhaLineupScreenOptions.roles
    let rolesNames = CoroinhaLineupScreenOptions.rolesNames
    let lineupCoroinhas = []

    if(CoroinhaLineupScreenOptions.lineupType=="Single"){
        for(let i = 0; i < roles.length;i++){
            lineupCoroinhas.push(<LineupCoroinha text={rolesNames[i]} role={roles[i]} key={i} lineup={CoroinhaLineupScreenOptions.lineups[0]}/>)
        }
    }

    let weekendCoroinhas:Map<string,Array<any>> = new Map<string,Array<any>>()
    let weekendLineups = []

    let monthCoroinhas:Map<string,Map<string,Array<any>>> = new Map<string,Map<string,Array<any>>>()

    if(CoroinhaLineupScreenOptions.lineupType=="Weekend"){
        console.log("Weekend screen")
        console.log("Days: ")
        console.log(CoroinhaLineupScreenOptions.days)
        
        for(let i = 0;i < CoroinhaLineupScreenOptions.days.length;i++){
            console.log("Adding lineups process "+(i+1)+"/"+CoroinhaLineupScreenOptions.days.length)
            let curDay = CoroinhaLineupScreenOptions.days[i]
            let line = CoroinhaLineupScreenOptions.lineups[i]
            let coroinhas:Array<any> = []
            
            for(let h = 0;h < CoroinhaLineupScreenOptions.roles.length; h++){
                coroinhas.push(<LineupCoroinha text={rolesNames[h]} role={roles[h]} key={h} lineup={line}/>)
            }
    
            weekendCoroinhas.set(curDay,coroinhas)
            weekendLineups.push(<WeekendLineup name={CoroinhaLineupScreenOptions.daysNames[i]} coroinhas={weekendCoroinhas.get(curDay)} key={i}/>)
            
        }
    }
    if(CoroinhaLineupScreenOptions.lineupType == "Month"){
        console.log("Month screen")
        console.log("Days: ")
        console.log(CoroinhaLineupScreenOptions.days)
        let weekends = Array.from(CoroinhaLineupScreenOptions.monthLineups.keys())

        for(let i = 0; i < weekends.length;i++){
            let curWeekendKey = weekends[i] // Dias do fim de semana atual
            let curWeekend = CoroinhaLineupScreenOptions.monthLineups.get(curWeekendKey) // Lineups do fim de semana
            
            if(curWeekend!=undefined){
                for(let j = 0;j < curWeekend.length;j++){
                
                    console.log("Adding lineups process "+(j+1)+"/"+CoroinhaLineupScreenOptions.days.length)
                    let line = curWeekend[j]

                    let curDay = line.day
                    let acolytes:Array<any> = []
                    
                    for(let k = 0;k < CoroinhaLineupScreenOptions.roles.length; k++){
                        console.log("Key is: "+((i*100)+(j*10)+k))
                        acolytes.push(<LineupCoroinha text={rolesNames[k]} role={roles[k]} key={(i*100)+(j*10)+k} lineup={line}/>)
                    }
            
                    if(monthCoroinhas.get(curWeekendKey) != undefined){
                        monthCoroinhas.get(curWeekendKey)?.set(curDay,acolytes)
                    }
                    else{
                        monthCoroinhas.set(curWeekendKey,new Map<string,Array<any>>)
                        monthCoroinhas.get(curWeekendKey)?.set(curDay,acolytes)
                    }
                    
                    weekendLineups.push(<WeekendLineup name={CoroinhaLineupScreenOptions.daysNames[j]} acolytes={weekendCoroinhas.get(curDay)} key={600+j}/>)                  
                }
            }
        }
    }

    if(CoroinhaLineupScreenOptions.lineupType == "Single"){
        return(
            <View style={{flex:1}}>
                <UpperBar/>
            
                <View style={{flex:1,paddingLeft:20}}>
                    {lineupCoroinhas}
                </View>
            </View>
        )
    }

    if(CoroinhaLineupScreenOptions.lineupType == "Weekend"){
        return(
            <ScrollView style={{flex:1}}>
                <UpperBar/>
                <View style={{flex:1}}>
                    <View style ={{flex:0.1,backgroundColor:"#FFEBA4"}}>
                        <Text style={{fontSize:24,alignSelf:"center"}}>Sábado - 19h</Text>
                    </View>

                    {weekendCoroinhas.get("sabado")}

                    <View style ={{flex:0.1,backgroundColor:"#FFEBA4"}}>
                        <Text style={{fontSize:24,alignSelf:"center"}}>Domingo - 08h</Text>
                    </View>

                    {weekendCoroinhas.get("domingoAM")}

                    <View style ={{flex:0.1,backgroundColor:"#FFEBA4"}}>
                        <Text style={{fontSize:24,alignSelf:"center"}}>Domingo - 19h</Text>
                    </View>

                    {weekendCoroinhas.get("domingoPM")}
                </View>
            </ScrollView>
        )
    }

    if(CoroinhaLineupScreenOptions.lineupType == "Month"){
        console.log("Mothtly lineup")
        console.log(CoroinhaLineupScreenOptions.monthLineups)
        console.log(Array.from(CoroinhaLineupScreenOptions.monthLineups.keys()))

        let array = Array.from(CoroinhaLineupScreenOptions.monthLineups.keys())
        console.log("Array:")
        console.log(array)

        console.log(monthCoroinhas)
        
        return(
            <View style={{flex:1}}>
                <UpperBar/>
                <MonthLineups weekends={array} monthCor={monthCoroinhas}/>
                
                <View style={{alignContent:"center",alignItems:"center",padding:10}}>
                    <TextButton buttonStyle={{}} text="Gerar prompt Gemini" press={()=>{
                        console.log(CoroinhaLineupScreenOptions.roles)
                        console.log(CoroinhaLineupScreenOptions.allLineups)
                        CopyToClipboard(GenerateLineupPrompt(CoroinhaLineupScreenOptions.allLineups,CoroinhaLineupScreenOptions.rolesNames,CoroinhaLineupScreenOptions.roles))
                        console.log("Copied.")
                    }}/>
                </View> 
            </View>
            
        )
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

export function LineupCoroinha(props:any) {   
    return(
        <View style={{flex:1,flexDirection:"row",alignSelf:"center",alignItems:"center"}}>
            <Text style={textStyles.functionTitle}>{props.text} - </Text>
            <Text style={textStyles.coroinhaNick}>{CheckCoroinha(props.lineup.line.get(props.role))}</Text>
            
            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={require("@/src/app/shapes/switch_ico.png")} imgStyle={Global.styles.buttonIcons} press={()=>{
                let thisCoroinha = GetRoleCoroinha(props.role,props.lineup)
                if(!isSwitching){
                    switchingCoroinha = thisCoroinha
                    switchingCoroinhaRole = props.role
                    switchingCoroinhaLineup = props.lineup
                    isSwitching = true
                }
                else if(isSwitching){
                    coroinhaSwitched = thisCoroinha
                    coroinhaSwitchedRole = props.role
                    coroinhaSwitchedLineup = props.lineup
                    isSwitching = false
                    SwitchCoroinhas(switchingCoroinha,coroinhaSwitched,switchingCoroinhaRole,coroinhaSwitchedRole,switchingCoroinhaLineup,coroinhaSwitchedLineup)
                    router.replace("/screens/coroinhas/CoroinhaLineupScreen")
                }     
            }}/>

            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={require("@/src/app/shapes/subs_ico.png")} imgStyle={Global.styles.buttonIcons} press={()=>{
                isReplacing = true
                let thisCoroinha = GetRoleCoroinha(props.role,props.lineup)
                replacing = thisCoroinha
                
                CoroinhaSelectScreenOptions.selectMode="Single"
                CoroinhaSelectScreenOptions.selected = []
                
                CoroinhaSelectScreenOptions.action = ()=>{

                    if(replacing != null){
                        replacing.rodizio[props.role]=replacing.oldRodizio[props.role]
                        replacing.priority=replacing.oldPriority
                        replacing.weekendPriority=replacing.oldWeekendPriority
                    }
                                      
                    replaced = CoroinhaSelectScreenOptions.selected[0]
                    replaced.rodizio[props.role]=4
                    replaced.priority=4
                    replaced.weekendPriority[props.lineup.day]=3

                    props.lineup.line.set(props.role,replaced)
                    props.lineup.coroinhas.splice(props.lineup.coroinhas.indexOf(replacing),1)
                    props.lineup.coroinhas.push(replaced)

                    router.back()
                }
                CoroinhaSelectScreenOptions.excludedCoroinhas = props.lineup.coroinhas
                console.log("Excluded: ")
                Global.currentScreen={screenName:"Selecione - Substituição",iconPath:""}
                CoroinhaSelectScreenOptions.lineup = props.lineup
                router.push("/screens/coroinhas/CoroinhaSelectScreen")
            }}/>


        </View>
    )
}


function CheckCoroinha(cor:Coroinha): string{
    if(cor != null){
        return cor.nick
    }
    else{
        return "-Sem escala-"
    }
}

function GetRoleCoroinha(role:string,lineup:any){
    return lineup.line.get(role)
    
}

function SwitchCoroinhas(switching:Coroinha,switched:Coroinha,switchingRole:string,switchedRole:string,switchingLineup:CoroinhaLineup,switchedLineup:CoroinhaLineup){
    
    if(switching != null){
        switching.rodizio[switchingRole]=4
        switching.rodizio[switchedRole]=switching.oldRodizio[switchedRole]
    }
    if(switched != null){
        switched.rodizio[switchedRole]=4
        switched.rodizio[switchingRole]=switched.oldRodizio[switchingRole]
    }
    
    switchingLineup.line.set(switchingRole,switched)
    switchedLineup.line.set(switchedRole,switching)
}

function WeekendLineup(props:any){

    return(
        <View style={{flex:1}}>
            <View style ={{flex:0.1,backgroundColor:"#FFEBA4"}}>
                <Text style={{fontSize:24,alignSelf:"center"}}>{props.day}</Text>
            </View>

            {props.cor}
        </View>
        
       
    )
}

function MonthLineups(props:any){
    console.log(props.monthCor)
    let allWeekends:Array<any> = new Array<any>
    for(let i = 0; i < props.weekends.length; i++){
        let curWkKey = props.weekends[i] // Chave do fim de semana atual
        let curWk = props.monthCor.get(curWkKey) // Retorna uma lista de LineupCoroinhas

       
        for(let h = 0; h < Array.from(curWk.keys()).length;h++){
            let curDay:any = Array.from(curWk.keys())[h] // Chave do dia
            let dayName:string =((i+1)+"° "+CoroinhaLineupScreenOptions.daysMaps.get(curDay))

            let newWeekend = <WeekendLineup day={dayName} cor={curWk.get(curDay)} key={(i*10)+h}/>
            allWeekends.push(newWeekend)
        }
        
    }
    console.log("Weekend lineups: ")
    console.log(allWeekends)
    return(
        <ScrollView style={{flex:1}}>
            {allWeekends}
        </ScrollView>
    )
}