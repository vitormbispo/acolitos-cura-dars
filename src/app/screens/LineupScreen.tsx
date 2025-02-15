import { View, Image, Text, ScrollView, } from "react-native"
import { ImageButton, TextButton, UpperBar, UpperButton } from "../classes/NewComps"
import { router } from "expo-router"
import { Global } from "../Global"
import { Acolyte, AcolyteData } from "../classes/AcolyteData"
import { StyleSheet } from "react-native"
import { useRef, useState } from "react"
import { AcolyteSelectScreenOptions } from "./AcolyteSelectScreen"
import { Lineup, StructuredLineup } from "../classes/Lineup"
import { CopyToClipboard, GenerateLineupPrompt, GetMemberIndex, SaveAcolyteData, SaveCoroinhaData } from "../classes/Methods"
import { menuStore } from "../store/store"
import { Member, MemberData, MemberType } from "../classes/MemberData"
import {ICONS} from "../classes/AssetManager"
import { textStyles, uiStyles } from "../styles/GeneralStyles"
import { MemberSelectScreenOptions } from "./MemberSelectScreen"


// TODO Otimizar essa tela e aplicar mudanças na geração semanal e mensal.
export class LineupScreenOptions{
    static name = "Nova escala"
    static lineupType = "Single" // Tipo da escala
    static roles = ["cero1","cero2","cruci","turib","navet","libri"]

    static days = ["sabado","domingoAM","domingoPM"]
    static daysNames = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]
    static daysMaps:Map<string,string> = new Map<string,string>([
        ["sabado","Sábado - 19h"],
        ["domingoAM","Domingo - 08h"],
        ["domingoPM","Domingo - 19h"]])
    static lineups:Array<Lineup> = []
    static monthLineups:Map<string,Array<Lineup>> = new Map<string,Array<Lineup>>()
    static allLineups:Array<Lineup> = new Array<Lineup>()

    static loaded:boolean = false; // A escala exibida é carregada?
    static loadedLineIndex:number = 0; // Índice da escala carregada

    /**
     * Salva os dados da lineup
     * @returns 
     */
    public static SaveLineup(){
        let line = new StructuredLineup()
    
        line.allLineups = LineupScreenOptions.allLineups
        line.days = LineupScreenOptions.days
        line.daysNames = LineupScreenOptions.daysNames
        line.lineupType = LineupScreenOptions.lineupType
        line.lineups = LineupScreenOptions.lineups
        line.monthLineups = LineupScreenOptions.monthLineups
        line.roles = LineupScreenOptions.roles
        line.name = LineupScreenOptions.name

        return line;
    }
    
    /**
     * Carrega os dados da lineup:
     * @param line 
     */
    public static LoadLineup(line){
        LineupScreenOptions.allLineups = line.allLineups
        LineupScreenOptions.days = line.days
        LineupScreenOptions.daysNames = line.daysNames
        LineupScreenOptions.lineupType = line.lineupType 
        LineupScreenOptions.lineups = line.lineups
        LineupScreenOptions.monthLineups = line.monthLineups
        LineupScreenOptions.roles = line.roles 
        LineupScreenOptions.name = line.name
    }

    // Rolagem da tela
    static scrollPos = 0
    static scrollRef = null
}

let isSwitching = false
let switchingMember:Member // Acóito que está sendo trocado
let memberSwitched:Member // Acólito que entrará no lugar do trocado

let switchingMemberRole:string // Role do acóito que está sendo trocado
let memberSwitchedRole:string // Role do acólito que entrará no lugar do trocado

let switchingMemberLineup:Lineup
let memberSwitchedLineup:Lineup

let isReplacing = false
let memberReplaced:Member // Membro substituído
let replacingMember:Member // Membro que substituirá


export default function LineupScreen(){
    Global.currentScreen.screenName = "Escala"
    
    const {type} = menuStore()
    // Rolagem
    
    const[scrollPosition, setScrollPosition] = useState(LineupScreenOptions.scrollPos);
    const scrollViewRef = useRef(LineupScreenOptions.scrollRef);

    const handleScroll = (event:any) => {
        let pos = event.nativeEvent.contentOffset.y
        setScrollPosition(pos);
        LineupScreenOptions.scrollPos = pos;
        LineupScreenOptions.scrollRef = scrollViewRef;
    }

    let roles = LineupScreenOptions.roles
    let lineupMembers = []

    let weekendMembers:Map<string,Array<any>> = new Map<string,Array<any>>()
    let weekendLineups = []

    let monthMembers:Map<string,Map<string,Array<any>>> = new Map<string,Map<string,Array<any>>>()

    switch(LineupScreenOptions.lineupType){
        case "Single":
        // Lógica:    
            for(let i = 0; i < roles.length;i++){
                    lineupMembers.push(<LineupMember text={roles[i]} role={roles[i]} key={i} lineup={LineupScreenOptions.lineups[0]} lineupIndex={0}/>)
                }
        // Tela:
            return(
                <View style={{flex:1}}>
                    
                    <View>
                        <UpperBar icon={ICONS.escala} screenName={"- Escala:"}/>
                    </View>
                    
                    
                
                    <View style={{flex:1,paddingLeft:20}}>
                        {lineupMembers}
                    </View>

                    <View style={{alignSelf:"center",alignContent:"center",alignItems:"center",padding:10, flexDirection:"row"}}>
                        <TextButton buttonStyle={{padding:10}} text="Gerar prompt Gemini" press={()=>{
                            CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.allLineups,LineupScreenOptions.roles,LineupScreenOptions.roles))
                        }}/>

                        <TextButton buttonStyle={{padding:10}} text="Salvar escalas" press={()=>{
                            if(!LineupScreenOptions.loaded){
                                switch(type){
                                    case MemberType.ACOLYTE:
                                        MemberData.allLineups = [LineupScreenOptions.SaveLineup()].concat(MemberData.allLineups)
                                        SaveAcolyteData(); break
                                    case MemberType.COROINHA:
                                        MemberData.allLineups = [LineupScreenOptions.SaveLineup()].concat(MemberData.allLineups)
                                        SaveCoroinhaData(); break

                                }
                                LineupScreenOptions.loaded = true
                                LineupScreenOptions.loadedLineIndex = 0
                            }
                            else{
                                switch(type){
                                    case MemberType.ACOLYTE:
                                        MemberData.allLineupsAcolytes[LineupScreenOptions.loadedLineIndex] = LineupScreenOptions.SaveLineup()
                                        SaveAcolyteData(); break
                                    case MemberType.COROINHA:
                                        MemberData.allLineupsCoroinhas[LineupScreenOptions.loadedLineIndex] = LineupScreenOptions.SaveLineup()
                                        SaveCoroinhaData(); break

                                }
                            }
                        }}/>
                    </View> 
                </View>
            )
        break;
        case "Weekend":
        // Lógica:
            for(let i = 0;i < LineupScreenOptions.days.length;i++){
                let curDay = LineupScreenOptions.days[i]
                let line = LineupScreenOptions.lineups[i]
                let members:Array<any> = []
                
                for(let h = 0;h < LineupScreenOptions.roles.length; h++){
                    members.push(<LineupMember text={roles[h]} role={roles[h]} key={h} lineup={line}/>)
                }
        
                weekendMembers.set(curDay,members)
                weekendLineups.push(<WeekendLineup name={LineupScreenOptions.daysNames[i]} acolytes={weekendMembers.get(curDay)} key={i}/>)
            }
        // Tela:
            return(
                <View style={{flex:1}}>
                    <ScrollView 
                    ref={scrollViewRef}
                    onScroll={handleScroll}
                    onContentSizeChange={() => { scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false }); }}
                    style={{flex:1}}>
                        <UpperBar/>
                        <View style={{flex:1}}>
                            <WeekendLineup aco={weekendMembers.get("sabado")} day={"Sábado - 19h"}/>
                            <WeekendLineup aco={weekendMembers.get("domingoAM")} day={"Domingo - 8h"}/>
                            <WeekendLineup aco={weekendMembers.get("domingoPM")} day={"Domingo - 19h"}/>
                        </View>
                    </ScrollView>

                    <View style={{alignSelf:"center",alignContent:"center",alignItems:"center",padding:10,flexDirection:"row"}}>
                        <TextButton buttonStyle={{padding:10}} text="Gerar prompt Gemini" press={()=>{
                            CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.allLineups,LineupScreenOptions.roles,LineupScreenOptions.roles))
                        }}/>

                        <TextButton buttonStyle={{padding:10}} text="Salvar escalas" press={()=>{
                            if(!LineupScreenOptions.loaded){
                                AcolyteData.allLineups = [LineupScreenOptions.SaveLineup()].concat(AcolyteData.allLineups)
                                SaveAcolyteData()
                                LineupScreenOptions.loaded = true
                                LineupScreenOptions.loadedLineIndex = 0
                            }
                            else{
                                AcolyteData.allLineups[LineupScreenOptions.loadedLineIndex] = LineupScreenOptions.SaveLineup()
                                SaveAcolyteData()
                            }
                            
                        }}/>
                    </View> 
                </View>
            )
        break;
        case "Month":
        // Lógica: 
            let weekends = Array.from(LineupScreenOptions.monthLineups.keys())

            for(let i = 0; i < weekends.length;i++){
                let curWeekendKey = weekends[i] // Dias do fim de semana atual
                let curWeekend = LineupScreenOptions.monthLineups.get(curWeekendKey) // Lineups do fim de semana
                
                if(curWeekend!=undefined){
                    for(let j = 0;j < curWeekend.length;j++){
                    

                        let line = curWeekend[j]

                        let curDay = line.day
                        let acolytes:Array<any> = []
                        
                        for(let k = 0;k < LineupScreenOptions.roles.length; k++){
                            acolytes.push(<LineupMember text={roles[k]} role={roles[k]} key={(i*100)+(j*10)+k} lineup={line}/>)
                        }
                
                        if(monthMembers.get(curWeekendKey) != undefined){
                            monthMembers.get(curWeekendKey)?.set(curDay,acolytes)
                        }
                        else{
                            monthMembers.set(curWeekendKey,new Map<string,Array<any>>)
                            monthMembers.get(curWeekendKey)?.set(curDay,acolytes)
                        }
                        
                        weekendLineups.push(<WeekendLineup name={LineupScreenOptions.daysNames[j]} acolytes={weekendMembers.get(curDay)} key={600+j}/>)
                        
                    }
                }
            }   
        // Tela 
            let array = Array.from(LineupScreenOptions.monthLineups.keys())
            
            return(
                <View style={{flex:1}}>
                    <UpperBar/>         
                    <MonthLineups weekends={array} monthAco={monthMembers}/>  
                    
                    <View style={{alignSelf:"center",alignContent:"center",alignItems:"center",padding:10,flexDirection:"row"}}>
                        <TextButton buttonStyle={{padding:10}} text="Gerar prompt Gemini" press={()=>{
                            CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.allLineups,LineupScreenOptions.roles,LineupScreenOptions.roles))
                        }}/>

                        <TextButton buttonStyle={{padding:10}} text="Salvar escalas" press={()=>{
                            if(!LineupScreenOptions.loaded){
                                AcolyteData.allLineups = [LineupScreenOptions.SaveLineup()].concat(AcolyteData.allLineups)
                                SaveAcolyteData()
                                LineupScreenOptions.loaded = true
                                LineupScreenOptions.loadedLineIndex = 0
                            }
                            else{
                                AcolyteData.allLineups[LineupScreenOptions.loadedLineIndex] = LineupScreenOptions.SaveLineup()
                                SaveAcolyteData()
                            }
                        }}/>
                    </View> 
                </View>
            )
        break;
    }
}

export function LineupMember(props:any) {
    return(
        <View style={{flexDirection:"row",alignSelf:"center",alignItems:"center",alignContent:"center"}}>
            <Text style={textStyles.functionTitle}>{props.text} - </Text>
            <Text style={textStyles.memberNick}>{CheckMember(props.lineup.line.get(props.role))}</Text>
            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={require("@/src/app/shapes/switch_ico.png")} imgStyle={uiStyles.buttonIcon} press={()=>{
                let thisMember = GetRoleMember(props.role,props.lineup)
                if(!isSwitching){
                    switchingMember = thisMember
                    switchingMemberRole = props.role
                    switchingMemberLineup = props.lineup
                    isSwitching = true
                }
                else{
                    memberSwitched = thisMember
                    memberSwitchedRole = props.role
                    memberSwitchedLineup = props.lineup
                    isSwitching = false
                    SwitchMembers(switchingMember,memberSwitched,switchingMemberRole,memberSwitchedRole,switchingMemberLineup,memberSwitchedLineup)
                    router.replace("/screens/LineupScreen")
                }     
            }}/>

            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={require("@/src/app/shapes/subs_ico.png")} imgStyle={Global.styles.buttonIcons} press={()=>{
                isReplacing = true
                let curLine:Lineup= LineupScreenOptions.lineups[props.lineupIndex]
                let thisMember = GetRoleMember(props.role,curLine)
                memberReplaced = thisMember

                MemberSelectScreenOptions.selectMode="Single"
                MemberSelectScreenOptions.selected = []
                
                MemberSelectScreenOptions.action = ()=>{
  
                    if(memberReplaced != null){
                        memberReplaced.rodizio[props.role]=memberReplaced.oldRodizio[props.role]
                        memberReplaced.priority=memberReplaced.oldPriority
                        memberReplaced.weekendPriority=memberReplaced.oldWeekendPriority
                    }
                                     
                    replacingMember = MemberSelectScreenOptions.selected[0]
                    replacingMember.rodizio[props.role]=6
                    replacingMember.priority=4
                    replacingMember.weekendPriority[props.lineup.day]=3
                    
                    curLine.line.set(props.role,replacingMember)
                    
                    let replacedID = GetMemberIndex(memberReplaced,curLine.members)
                    LineupScreenOptions.lineups[props.lineupIndex].members.splice(replacedID,1)
                    LineupScreenOptions.lineups[props.lineupIndex].members.push(replacingMember)
            
                    router.back()
                }
                MemberSelectScreenOptions.excludedMembers = curLine.members
                MemberSelectScreenOptions.lineup = curLine
                router.push("/screens/MemberSelectScreen")
            }}/>
        </View>
    )
}

/**
 * Checa se o membro existe ou não e retorna seu apelido caso exista,
 * Retorna "-Sem escala-" caso contrário.
 * @param member Membro
 * @returns string
 */
function CheckMember(member:Member): string{
    if(member != null){
        return member.nick
    }
    else{
        return "-Sem escala-"
    }
}

/**
 * Retorna o membro escalado em determinada função em determinada escala
 * @param role Função
 * @param lineup Escala
 * @returns Member
 */
function GetRoleMember(role:string,lineup:any){
    return lineup.line.get(role)
    
}

/**
 * Troca os membros
 * @param switching membro a ser trocado
 * @param switched membro que substituirá
 * @param switchingRole Função do membro a ser trocado
 * @param switchedRole Função do membro que substituirá
 * @param switchingLineup Escala a ser trocado
 * @param switchedLineup Escala que substituirá
 */
function SwitchMembers(switching:Member,switched:Member,switchingRole:string,switchedRole:string,switchingLineup:Lineup,switchedLineup:Lineup){
    
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
        <View style={{flex:1}}>
            <View style ={{flex:0.1,backgroundColor:"#FFEBA4"}}>
                <Text style={{fontSize:24,alignSelf:"center"}}>{props.day}</Text>
            </View>

            {props.aco}
        </View>
        
       
    )
}

/**
 * Tela da escala mensal
 * @param props
 * weekends: chaves do Map de finais de semana
 * monthAco: mapa com os fins de semana do mês e suas escalas
 * @returns 
 */
function MonthLineups(props:any){
    let allWeekends:Array<any> = new Array<any>
    for(let i = 0; i < props.weekends.length; i++){
        let curWkKey = props.weekends[i] // Chave do fim de semana atual
        let curWk = props.monthAco.get(curWkKey) // Retorna uma lista de LineupAcolytes

       
        for(let h = 0; h < Array.from(curWk.keys()).length;h++){
            let curDay:any = Array.from(curWk.keys())[h] // Chave do dia
            let dayName:string =((i+1)+"° "+LineupScreenOptions.daysMaps.get(curDay))

            let newWeekend = <WeekendLineup day={dayName} aco={curWk.get(curDay)} key={(i*10)+h}/>
            allWeekends.push(newWeekend)
        }
        
    }
    
    // Rolagem

    const[scrollPosition, setScrollPosition] = useState(LineupScreenOptions.scrollPos);
    const scrollViewRef = useRef(LineupScreenOptions.scrollRef);

    const handleScroll = (event:any) => {
        let pos = event.nativeEvent.contentOffset.y
        setScrollPosition(pos);
        LineupScreenOptions.scrollPos = pos;
        LineupScreenOptions.scrollRef = scrollViewRef;
    }

    return(
        <ScrollView  
        ref={scrollViewRef}
        onScroll={handleScroll}
        onContentSizeChange={() => { scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false }); }}
        style={{flex:1}}>
            {allWeekends}
        </ScrollView>
    )
}

/**
 * Exclui uma escala da lista do histórico de escalas dado o índice.
 * @param index Índice a ser excluído
 */
function EraseLineup(index:number){
    AcolyteData.allLineups.splice(index,1)
}
