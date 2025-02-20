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
    static monthLineups:object = {} // Ex.: "1stWE":[Lineup,Lineup,Lineup]
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


class SwitchHandler{
    static isSwitching = false
    static switchingMember:Member // Membro que está sendo trocado
    static memberSwitched:Member // Membro que entrará no lugar do trocado


    static switchingMemberLineup:Lineup
    static memberSwitchedLineup:Lineup

    static isReplacing = false
    static memberReplaced:Member // Membro substituído
    static replacingMember:Member // Membro que substituirá
}

export default function LineupScreen(){
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

    let weekendMembers:object = {}
    let weekendLineups = []
    let monthMembers:object = {} // Componentes dos membros do mês. Deve ser um objeto que contem objetos que apontam para arrays. Ex.: ["1stWE"]["sabado"] = [<Membro1/>,<Membro2/>,<Membro3/>]

    let lines = []
    for(let i = 0; i < LineupScreenOptions.lineups.length; i++){
        let curLine = LineupScreenOptions.lineups[i]
        lines.push(<DayLineup line={curLine} type={type} key={"Line"+i}/>)
    }

    if(LineupScreenOptions.lineupType == "Single"){
        return(
            <View style={{flex:1}}>
                <View>
                    <UpperBar icon={ICONS.escala} screenName={"Escala:"}/>
                </View>
                
                <ScrollView style={{flex:1}}>
                    {lines}
                </ScrollView>
                

                <View style={uiStyles.rowButtonContainer}>
                    <TextButton text="Gerar prompt Gemini" press={()=>{
                        CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.allLineups,LineupScreenOptions.roles,LineupScreenOptions.roles))
                    }}/>

                    <TextButton text="Salvar escalas" press={()=>{SaveAllLineups(type)}}/>
                </View> 
            </View>
        )
    }
    else if(LineupScreenOptions.lineupType == "Weekend"){
        // Lógica:
        for(let i = 0;i < LineupScreenOptions.days.length;i++){
            let curDay = LineupScreenOptions.days[i]
            let line = LineupScreenOptions.lineups[i]
            let members:Array<any> = []
            
            for(let h = 0;h < LineupScreenOptions.roles.length; h++){
                members.push(<LineupMember text={roles[h]} role={roles[h]} key={h} lineup={line}/>)
            }
    
            weekendMembers[curDay] = members
            weekendLineups.push(<WeekendLineup name={LineupScreenOptions.daysNames[i]} acolytes={weekendMembers[curDay]} key={i}/>)
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
                        <WeekendLineup aco={weekendMembers["sabado"]} day={"Sábado - 19h"}/>
                        <WeekendLineup aco={weekendMembers["domingoAM"]} day={"Domingo - 8h"}/>
                        <WeekendLineup aco={weekendMembers["domingoPM"]} day={"Domingo - 19h"}/>
                    </View>
                </ScrollView>

                <View style={uiStyles.rowButtonContainer}>
                    <TextButton text="Gerar prompt Gemini" press={()=>{
                        CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.allLineups,LineupScreenOptions.roles,LineupScreenOptions.roles))
                    }}/>

                    <TextButton text="Salvar escalas" press={()=>{SaveAllLineups(type)}}/>
                </View> 
            </View>
        )
    }

    if(LineupScreenOptions.lineupType == "Month"){
        LineupScreenOptions.allLineups
        return(
            <View style={{flex:1}}>
                {weekendLineups}
            </View>
        )
        
        
        // Lógica: 
        /*
        let weekends = Object.keys(LineupScreenOptions.monthLineups)

        for(let i = 0; i < weekends.length;i++){
            let curWeekendKey = weekends[i] // Dias do fim de semana atual
            let curWeekend = LineupScreenOptions.monthLineups[curWeekendKey] // Lineups do fim de semana
            
            if(curWeekend != undefined){
                for(let j = 0;j < curWeekend.length;j++){
                    let line = curWeekend[j]

                    let curDay = line.day
                    let members:Array<any> = []
                    
                    for(let k = 0;k < LineupScreenOptions.roles.length; k++){
                        members.push(<LineupMember text={roles[k]} role={roles[k]} key={(i*100)+(j*10)+k} lineup={line}/>)
                    }
            
                    monthLineups[curWeekendKey][curDay] = members                       
                    weekendLineups.push(<WeekendLineup name={LineupScreenOptions.daysNames[j]} acolytes={weekendMembers[curDay]} key={600+j}/>)
                    
                }
            }
        }   
        // Tela 
        let array = Object.keys(LineupScreenOptions.monthLineups)
        
        return(
            <View style={{flex:1}}>
                <UpperBar icon={ICONS.escala} screenName={"Escala:"} toggleEnabled={false}/>         
                <MonthLineups weekends={array} monthLines={monthLineups}/>  
                
                <View style={{alignSelf:"center",alignContent:"center",alignItems:"center",padding:10,flexDirection:"row"}}>
                    <TextButton text="Gerar prompt Gemini" press={()=>{
                        CopyGeminiPrompt()
                    }}/>

                    <TextButton text="Salvar escalas" press={()=>{SaveLineups(type)}}/>
                </View> 
            </View>
        )*/
    }
    return(
        <View>

        </View>
    )
}

/**
 * 
 * @param props text = Nome da função
 * lineup = escala
 * role = função
 * nick = apelido do membro
 * @returns 
 */
export function LineupMember(props:any) {
    return(
        <View style={{flexDirection:"row",alignSelf:"center",alignItems:"center",alignContent:"center"}}>
            <Text style={textStyles.functionTitle}>{props.text} - </Text>
            <Text style={textStyles.memberNick}>{props.nick}</Text>
            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={require("@/src/app/shapes/switch_ico.png")} imgStyle={uiStyles.buttonIcon} press={()=>{
                let thisMember = GetRoleMember(props.role,props.lineup)
                if(!SwitchHandler.isSwitching){
                    SwitchHandler.switchingMember = thisMember
                    SwitchHandler.switchingMemberLineup = props.lineup
                    SwitchHandler.isSwitching = true
                }
                else{
                    SwitchHandler.memberSwitched = thisMember
                    SwitchHandler.memberSwitchedLineup = props.lineup
                    SwitchHandler.isSwitching = false
                    SwitchMembers(SwitchHandler.switchingMember,SwitchHandler.switchingMemberLineup,SwitchHandler.memberSwitched,SwitchHandler.memberSwitchedLineup)
                    router.replace("/screens/LineupScreen")
                }     
            }}/>

            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={require("@/src/app/shapes/subs_ico.png")} imgStyle={Global.styles.buttonIcons} press={()=>{
                SwitchHandler.isReplacing = true
                let curLine:Lineup= props.lineup
                let thisMember = GetRoleMember(props.role,curLine)
                SwitchHandler.memberReplaced = thisMember

                MemberSelectScreenOptions.selectMode="Single"
                MemberSelectScreenOptions.selected = []
                
                MemberSelectScreenOptions.action = ()=>{
  
                    if(SwitchHandler.memberReplaced != null){
                        SwitchHandler.memberReplaced.rodizio[props.role]=SwitchHandler.memberReplaced.oldRodizio[props.role]
                        SwitchHandler.memberReplaced.priority=SwitchHandler.memberReplaced.oldPriority
                        SwitchHandler.memberReplaced.weekendPriority=SwitchHandler.memberReplaced.oldWeekendPriority
                    }
                                     
                    SwitchHandler.replacingMember = MemberSelectScreenOptions.selected[0]
                    SwitchHandler.replacingMember.rodizio[props.role]=6
                    SwitchHandler.replacingMember.priority=4
                    SwitchHandler.replacingMember.weekendPriority[props.lineup.day]=3
                    
                    curLine.line[props.role] = SwitchHandler.replacingMember
                    
                    let replacedID = GetMemberIndex(SwitchHandler.memberReplaced,curLine.members)
                    props.lineup.members.splice(replacedID,1)
                    props.lineup.members.push(SwitchHandler.replacingMember)
            
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
 * Retorna o membro escalado em determinada função em determinada escala
 * @param role Função
 * @param lineup Escala
 * @returns Member
 */
function GetRoleMember(role:string,lineup:Lineup){
    return lineup.line[role]
}

/**
 * Retorna a função que o 'membro' está escalado em determinada 'escala'.
 * @param member Membro
 * @param lineup Escala
 * @returns 
 */
function GetMemberRole(member:Member,lineup:Lineup){
    let roles:Array<string> = lineup.roleset.set
    roles.forEach((role)=>{
        if(lineup.line[role] == member){
            return role
        }
    })
    return null
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
function SwitchMembers(switching:Member,switchingLineup:Lineup,switched:Member,switchedLineup:Lineup){
    
    let switchingRole:string = GetMemberRole(switching,switchingLineup)
    let switchedRole:string = GetMemberRole(switched,switchedLineup)
    if(switching != null){
        switching.rodizio[switchingRole]=6
        switching.rodizio[switchedRole]=switching.oldRodizio[switchedRole]
    }
    if(switched != null){
        switched.rodizio[switchedRole]=6
        switched.rodizio[switchingRole]=switched.oldRodizio[switchingRole]
    }
    
    switchingLineup.line[switchingRole] = switched
    switchedLineup.line[switchedRole] = switching
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
 * monthLines: mapa com os fins de semana do mês e suas escalas
 * @returns 
 */
function MonthLineups(props:any){
    let allWeekends:Array<any> = new Array<any>
    for(let i = 0; i < props.weekends.length; i++){
        let curWkKey = props.weekends[i] // Chave do fim de semana atual
        let curWk = props.monthLines.get(curWkKey) // Retorna uma lista de LineupAcolytes

       
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

function SaveAllLineups(type:MemberType){
    if(!LineupScreenOptions.loaded){
        switch(type){
            case MemberType.ACOLYTE:
                MemberData.allLineupsAcolytes = [LineupScreenOptions.SaveLineup()].concat(MemberData.allLineupsAcolytes) // Inserindo nova escala no início. Poupa um sort
                SaveAcolyteData()
                break
            case MemberType.COROINHA:
                MemberData.allLineupsCoroinhas = [LineupScreenOptions.SaveLineup()].concat(MemberData.allLineupsCoroinhas)
                SaveCoroinhaData()
                break
        }

        LineupScreenOptions.loaded = true
        LineupScreenOptions.loadedLineIndex = 0
    }
    else{
        switch(type){
            case MemberType.ACOLYTE:
                MemberData.allLineupsAcolytes[LineupScreenOptions.loadedLineIndex] = LineupScreenOptions.SaveLineup()
                SaveAcolyteData()
                break
            case MemberType.COROINHA:
                MemberData.allLineupsCoroinhas[LineupScreenOptions.loadedLineIndex] = LineupScreenOptions.SaveLineup()
                SaveCoroinhaData()
                break
        }
    }
}
function CopyGeminiPrompt(){
    CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.allLineups,LineupScreenOptions.roles,LineupScreenOptions.roles))
}

type DayLineupProps={
    line:Lineup,
    type:MemberType
}
function DayLineup(props:DayLineupProps) {
    const {theme} = menuStore()
    let roles:Array<string> = props.line.roleset.set
    let members:Array<React.JSX.Element> = []

    for(let i = 0; i < roles.length;i++){
        let role = roles[i]
        let member = props.line.line[role]
        members.push(<LineupMember nick={member!=null ? member.nick : "- Sem escala -"} text={role} lineup={props.line} role={role} key={props.line.day+props.line.weekend+i}/>)
    }

    return(
        <View style={{flex:1}}>
            <View style={{height:"20%", backgroundColor:theme.accentColor}}>
                <Text style={textStyles.lineupTitle}>{props.line.weekend} - {props.line.day}</Text>
            </View>
            
            {members}
        </View>
    )
}