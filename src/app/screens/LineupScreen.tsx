import { View, Image, Text, Modal, ScrollView } from "react-native"
import { ImageButton, TextButton } from "../classes/NewComps"
import { SingleLineupScreen } from "./SingleLineup"
import { router } from "expo-router"
import { Global } from "../Global"
import { Acolyte } from "../classes/AcolyteData"
import { StyleSheet } from "react-native"
import { GenerateLineup } from "../classes/LineupGenerator"
import { useState } from "react"
import { AcolyteSelectScreenOptions } from "./AcolyteSelectScreen"
import { Lineup } from "../classes/Lineup"

const textStyles = StyleSheet.create({
    functionTitle:{
        fontFamily:"Inter-Bold",
        fontSize:18,
        alignSelf:"center",
        flex:1
    },
    acolyteNick:{
        fontFamily:"Inter-Light",
        fontSize:18,
        alignSelf:"center",
        flex:1
    },

})

export class LineupScreenOptions{
    static lineupType = "Single"
    static roles = ["cero1","cero2","cruci","turib","navet","libri"]
    static rolesNames = ["Ceroferario 1","Ceroferario 2","Cruciferário","Turiferário","Naveteiro","Librífero"]

    static days = ["sabado","domingoAM","domingoPM"]
    static daysNames = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    static lineups:Array<Lineup> = []
}

let isSwitching = false
let switchingAcolyte:Acolyte // Acóito que está sendo trocado
let acolyteSwitched:Acolyte // Acólito que entrará no lugar do trocado

let switchingAcolyteRole:string // Role do acóito que está sendo trocado
let acolyteSwitchedRole:string // Role do acólito que entrará no lugar do trocado

let switchingAcolyteLineup:Lineup
let acolyteSwitchedLineup:Lineup

let isReplacing = false
let replaced:Acolyte
let replacing:Acolyte

export default function LineupScreen(){
    Global.currentScreen.screenName = "Escala"
    
    let roles = LineupScreenOptions.roles
    let rolesNames = LineupScreenOptions.rolesNames
    let lineupAcolytes = []


    if(LineupScreenOptions.lineupType=="Single"){
        for(let i = 0; i < roles.length;i++){
            lineupAcolytes.push(<LineupAcolyte text={rolesNames[i]} role={roles[i]} key={i} lineup={LineupScreenOptions.lineups[0]}/>)
        }
    }

    let weekendAcolytes:Map<string,Array<any>> = new Map<string,Array<any>>()
    let weekendLineups = []


    if(LineupScreenOptions.lineupType=="Weekend"){
        console.log("Weekend screen")
        console.log("Days: ")
        console.log(LineupScreenOptions.days)
        
        for(let i = 0;i < LineupScreenOptions.days.length;i++){
            console.log("Adding lineups process "+(i+1)+"/"+LineupScreenOptions.days.length)
            let curDay = LineupScreenOptions.days[i]
            let line = LineupScreenOptions.lineups[i]
            let acolytes:Array<any> = []
            
            for(let h = 0;h < LineupScreenOptions.roles.length; h++){
                acolytes.push(<LineupAcolyte text={rolesNames[h]} role={roles[h]} key={h} lineup={line}/>)
            }
    
            weekendAcolytes.set(curDay,acolytes)
            weekendLineups.push(<WeekendLineup name={LineupScreenOptions.daysNames[i]} acolytes={weekendAcolytes.get(curDay)} key={i}/>)
            
        }
    }
    


    if(LineupScreenOptions.lineupType == "Single"){
        return(
            <View style={{flex:1}}>
                <UpperBar/>
            
                <View style={{flex:1,paddingLeft:20}}>
                    {lineupAcolytes}
                </View>
            </View>
        )
    }

    if(LineupScreenOptions.lineupType == "Weekend"){
        return(
            <ScrollView style={{flex:1}}>
                <UpperBar/>
                <View style={{flex:1}}>
                    <View style ={{flex:0.1,backgroundColor:"#FFEBA4"}}>
                        <Text style={{fontSize:24,alignSelf:"center"}}>Sábado - 19h</Text>
                    </View>

                    {weekendAcolytes.get("sabado")}

                    <View style ={{flex:0.1,backgroundColor:"#FFEBA4"}}>
                        <Text style={{fontSize:24,alignSelf:"center"}}>Domingo - 08h</Text>
                    </View>

                    {weekendAcolytes.get("domingoAM")}

                    <View style ={{flex:0.1,backgroundColor:"#FFEBA4"}}>
                        <Text style={{fontSize:24,alignSelf:"center"}}>Domingo - 19h</Text>
                    </View>

                    {weekendAcolytes.get("domingoPM")}
                </View>
            </ScrollView>
        )
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

export function LineupAcolyte(props:any) {
    

    let [subsAcolyte,setSubs] = useState(false)
    return(
        <View style={{flexDirection:"row",alignSelf:"center",alignItems:"center",alignContent:"center"}}>
            <Text style={textStyles.functionTitle}>{props.text} - </Text>
            <Text style={textStyles.acolyteNick}>{CheckAcolyte(props.lineup.line.get(props.role))}</Text>
            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={require("@/src/app/shapes/switch_ico.png")} imgStyle={Global.styles.buttonIcons} press={()=>{
                let thisAcolyte = GetRoleAcolyte(props.role,props.lineup)
                if(!isSwitching){
                    console.log("Start switching: ")
                    console.log("Lineup")
                    console.log(props.lineup)
                    switchingAcolyte = thisAcolyte
                    switchingAcolyteRole = props.role
                    switchingAcolyteLineup = props.lineup
                    console.log("Switching acolyte in lineup: ")
                    console.log(switchingAcolyteLineup)
                    isSwitching = true
                }
                else if(isSwitching){
                    acolyteSwitched = thisAcolyte
                    acolyteSwitchedRole = props.role
                    acolyteSwitchedLineup = props.lineup
                    isSwitching = false
                    SwitchAcolytes(switchingAcolyte,acolyteSwitched,switchingAcolyteRole,acolyteSwitchedRole,switchingAcolyteLineup,acolyteSwitchedLineup)
                    router.replace("/screens/LineupScreen")
                }     
            }}/>

            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={require("@/src/app/shapes/subs_ico.png")} imgStyle={Global.styles.buttonIcons} press={()=>{
                isReplacing = true
                let thisAcolyte = GetRoleAcolyte(props.role,props.lineup)
                replacing = thisAcolyte
                console.log("Replacing: "+thisAcolyte.nick)
                AcolyteSelectScreenOptions.selectMode="Single"
                AcolyteSelectScreenOptions.selected = []
                
                AcolyteSelectScreenOptions.action = ()=>{
                    console.log("Replacing is: "+replacing.nick)
                    if(replacing != null){
                        replacing.rodizio[props.role]=replacing.oldRodizio[props.role]
                        replacing.priority=replacing.oldPriority
                        replacing.weekendPriority=replacing.oldWeekendPriority
                        console.log("Replacing OK")
                    }
                                      
                    replaced = AcolyteSelectScreenOptions.selected[0]
                    replaced.rodizio[props.role]=6
                    replaced.priority=4
                    replaced.weekendPriority[props.lineup.day]=3


                    props.lineup.line.set(props.role,replaced)
                    props.lineup.acolytes.splice(props.lineup.acolytes.indexOf(replacing),1)
                    props.lineup.acolytes.push(replaced)
                    console.log(props.lineup.line)
                    router.back()
                }
                AcolyteSelectScreenOptions.excludedAcolytes=props.lineup.acolytes
                console.log("Excluded: ")
                
                Global.currentScreen={screenName:"Selecione - Substituição",iconPath:""}
                AcolyteSelectScreenOptions.lineup = props.lineup
                router.push("/screens/AcolyteSelectScreen")
            }}/>


        </View>
    )
}
function CheckAcolyte(aco:Acolyte): string{
    if(aco != null){
        return aco.nick
    }
    else{
        return "-Sem escala-"
    }
}

function GetRoleAcolyte(role:string,lineup:any){
    return lineup.line.get(role)
    
}
function SwitchAcolytes(switching:Acolyte,switched:Acolyte,switchingRole:string,switchedRole:string,switchingLineup:Lineup,switchedLineup:Lineup){
    
    if(switching != null){
        switching.rodizio[switchingRole]=6
        switching.rodizio[switchedRole]=switching.oldRodizio[switchedRole]
    }
    if(switched != null){
        switched.rodizio[switchedRole]=6
        switched.rodizio[switchingRole]=switched.oldRodizio[switchingRole]
    }
    

    switchingLineup.line.set(switchingRole,switched)
    switchedLineup.line.set(switchedRole,switching)
}

function WeekendLineup(props:any){
    return(
        <View style ={{flex:0.1,backgroundColor:"#FFEBA4"}}>
                <Text style={{fontSize:24,alignSelf:"center"}}>Sábado</Text>
        </View>
       
    )
}