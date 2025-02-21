import { View,Text, ScrollView} from "react-native"
import { ImageButton, TextButton, UpperBar, UpperButton} from "../classes/NewComps"
import { router } from "expo-router"
import { useRef, useState } from "react"
import { Lineup, StructuredLineup } from "../classes/Lineup"
import { CopyToClipboard, GenerateLineupPrompt, GetMemberIndex, SaveAcolyteData, SaveCoroinhaData } from "../classes/Methods"
import { menuStore } from "../store/store"
import { Member, MemberData, MemberType } from "../classes/MemberData"
import {ICONS} from "../classes/AssetManager"
import { textStyles, uiStyles } from "../styles/GeneralStyles"
import { MemberSelectScreenOptions } from "./MemberSelectScreen"


// TODO Otimizar essa tela e aplicar mudanças na geração semanal e mensal.
// TODO Consertar seleção da geração de fim de semana para que tenha um valor inicial padrão e para que não precise
// 
export class LineupScreenOptions{
    static name = "Nova escala"
    static lineupType = "Single" // Tipo da escala
    static roles = ["cero1","cero2","cruci","turib","navet","libri"]

    static days = ["Sábado - 19h","Domingo - 08h","Domingo - 19h"]

    static lineups:Array<Lineup> = []
    static monthLineups:object = {} // Ex.: "1stWE":[Lineup,Lineup,Lineup]

    static loaded:boolean = false; // A escala exibida é carregada?
    static loadedLineIndex:number = 0; // Índice da escala carregada

    /**
     * Salva os dados da lineup
     * @returns StructuredLineup
     */
    public static SaveLineup():StructuredLineup{
        let line = new StructuredLineup()
    
        line.days = LineupScreenOptions.days
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
    public static LoadLineup(line:StructuredLineup){
        LineupScreenOptions.days = line.days
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

// Gerenciador de trocas e substituições de membros
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
    const {type, theme} = menuStore()
    // Rolagem
    
    const[scrollPosition, setScrollPosition] = useState(LineupScreenOptions.scrollPos);
    const scrollViewRef = useRef(LineupScreenOptions.scrollRef);
    
    const upperBtn = LineupScreenOptions.loaded ? <UpperButton img={ICONS.delete} press={()=>{
        EraseLineup(LineupScreenOptions.loadedLineIndex,type)
        router.back()
    }}/>:
    null
    
    /**
     * Salva o estado do scroll da tela
     * @param event 
     */
    const handleScroll = (event:any) => {
        let pos = event.nativeEvent.contentOffset.y
        setScrollPosition(pos);
        LineupScreenOptions.scrollPos = pos;
        LineupScreenOptions.scrollRef = scrollViewRef;
    }

    let lines = []
    for(let i = 0; i < LineupScreenOptions.lineups.length; i++){
        let curLine = LineupScreenOptions.lineups[i]
        lines.push(<DayLineup line={curLine} type={type} key={"Line"+i}/>)
    }

    return(
        <View style={{flex:1}}>
            <View style={{flexDirection:'row', backgroundColor:theme.accentColor}}>
                <UpperBar icon={ICONS.escala} screenName={"Escala:"}/>
                {upperBtn}
            </View>
            
            <ScrollView 
                style={{flex:1}}
                ref={scrollViewRef}
                onScroll={handleScroll}
                onContentSizeChange={() => { scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false }); 
            }}>
                {lines}
            </ScrollView>
            

            <View style={uiStyles.rowButtonContainer}>
                <TextButton text="Gerar prompt Gemini" press={()=>{
                    CopyGeminiPrompt()
                }}/>

                <TextButton text="Salvar escalas" press={()=>{
                    SaveAllLineups(type)
                }}/>
            </View> 
        </View>
    )
}

type LineupMemberType = {
    nick:string, // Apelido
    role:string, // Função
    lineup:Lineup // Escala
}
/**
 * 
 * @param props text = Nome da função
 * lineup = escala
 * role = função
 * nick = apelido do membro
 * @returns 
 */
export function LineupMember(props:LineupMemberType) {
    return(
        <View style={{flexDirection:"row",alignSelf:"center",alignItems:"center",alignContent:"center"}}>
            <Text style={textStyles.functionTitle}>{props.role} - </Text>
            <Text style={textStyles.memberNick}>{props.nick}</Text>
            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={ICONS.switch} imgStyle={uiStyles.buttonIcon} press={()=>{
                ToggleSwitch(props.role,props.lineup)
            }}/>

            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={ICONS.subs} imgStyle={uiStyles.buttonIcon} press={()=>{
                ReplaceMember(props.role,props.lineup)
            }}/>
        </View>
    )
}

type DayLineupProps={
    line:Lineup,
    type:MemberType
}
/**
 * Escala completa de um dia
 * @param props line=Escala type=Tipo de membro
 * @returns 
 */
function DayLineup(props:DayLineupProps) {
    const {theme} = menuStore()
    let roles:Array<string> = props.line.roleset.set
    let members:Array<React.JSX.Element> = []

    for(let i = 0; i < roles.length;i++){
        let role = roles[i]
        let member = props.line.line[role]
        members.push(<LineupMember nick={member!=null ? member.nick : "- Sem escala -"} lineup={props.line} role={role} key={props.line.day+props.line.weekend+i}/>)
    }

    return(
        <View style={{flex:1}}>
            <View style={{flex:1, backgroundColor:theme.accentColor}}>
                <Text style={textStyles.lineupTitle}>{props.line.weekend} - {props.line.day}</Text>
            </View>
            <View style={{flex:1, paddingLeft:10}}>
                {members}
            </View>
            
        </View>
    )
}

/**
 * Retorna o membro escalado em determinada função em determinada escala
 * @param role Função
 * @param lineup Escala
 * @returns Member
 */
function GetRoleMember(role:string,lineup:Lineup):Member{
    return lineup.line[role]
}

/**
 * Retorna a função que o 'membro' está escalado em determinada 'escala'.
 * @param member Membro
 * @param lineup Escala
 * @returns 
 */
function GetMemberRole(member:Member,lineup:Lineup):string|null{
    let roles:Array<string> = lineup.roleset.set
    
    for(let i = 0; i < roles.length; i++){
        let curRole = roles[i]
        if(lineup.line[curRole] == member){
            return curRole
        }
    }
    return null
}


/**
 * Alterna o estado da troca de membros.
 * Caso não esteja no estado 'trocando', define o membro a ser trocado e entra no estado 'trocando'.
 * Se já está no estado, define o membro a ser trocado, realiza a troca e atualiza a tela.
 * @param role 
 * @param lineup 
 */
function ToggleSwitch(role:string,lineup:Lineup){
    let thisMember = GetRoleMember(role,lineup)
    if(!SwitchHandler.isSwitching){
        SwitchHandler.switchingMember = thisMember
        SwitchHandler.switchingMemberLineup = lineup
        SwitchHandler.isSwitching = true
    }
    else{
        SwitchHandler.memberSwitched = thisMember
        SwitchHandler.memberSwitchedLineup = lineup
        SwitchHandler.isSwitching = false
        SwitchMembers(SwitchHandler.switchingMember,SwitchHandler.switchingMemberLineup,SwitchHandler.memberSwitched,SwitchHandler.memberSwitchedLineup)
        router.replace("/screens/LineupScreen")
    }     
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

/**
 * Configura e tela de seleção de membros para realizar uma
 * troca de membros na função de determinada escala
 * @param role 
 * @param lineup 
 */
function ReplaceMember(role:string,lineup:Lineup){
    SwitchHandler.isReplacing = true
    let curLine:Lineup= lineup
    let thisMember = GetRoleMember(role,curLine)
    SwitchHandler.memberReplaced = thisMember

    MemberSelectScreenOptions.selectMode="Single"
    MemberSelectScreenOptions.selected = []
    
    MemberSelectScreenOptions.action = ()=>{

        if(SwitchHandler.memberReplaced != null){
            SwitchHandler.memberReplaced.rodizio[role]=SwitchHandler.memberReplaced.oldRodizio[role]
            SwitchHandler.memberReplaced.priority=SwitchHandler.memberReplaced.oldPriority
            SwitchHandler.memberReplaced.weekendPriority=SwitchHandler.memberReplaced.oldWeekendPriority
        }
                            
        SwitchHandler.replacingMember = MemberSelectScreenOptions.selected[0]
        SwitchHandler.replacingMember.rodizio[role]=6
        SwitchHandler.replacingMember.priority=4
        SwitchHandler.replacingMember.weekendPriority[lineup.day]=3
        
        curLine.line[role] = SwitchHandler.replacingMember
        
        let replacedID = GetMemberIndex(SwitchHandler.memberReplaced,curLine.members)
        lineup.members.splice(replacedID,1)
        lineup.members.push(SwitchHandler.replacingMember)

        router.back()
    }
    MemberSelectScreenOptions.excludedMembers = curLine.members
    MemberSelectScreenOptions.lineup = curLine
    router.push("/screens/MemberSelectScreen")
}

/**
 * Exclui uma escala da lista do histórico de escalas dado o índice.
 * @param index Índice a ser excluído
 */
function EraseLineup(index:number,type:MemberType){
    let lineupsList:Array<StructuredLineup>
    switch (type){
        case MemberType.ACOLYTE:
            lineupsList = MemberData.allLineupsAcolytes
            break
        case MemberType.COROINHA:
            lineupsList = MemberData.allLineupsCoroinhas
            break
    }
    lineupsList.splice(index,1)
    
    switch(type){
        case MemberType.ACOLYTE:
            SaveAcolyteData()
            break
        case MemberType.COROINHA:
            SaveCoroinhaData()
            break
    }
}

/**
 * Salva todas as escalas.
 * @param type Tipo de membro
 */
function SaveAllLineups(type:MemberType){
    if(!LineupScreenOptions.loaded){
        switch(type){
            case MemberType.ACOLYTE:
                LineupScreenOptions.name = "Escala | Acólitos "+(MemberData.allLineupsAcolytes.length+1)
                MemberData.allLineupsAcolytes = [LineupScreenOptions.SaveLineup()].concat(MemberData.allLineupsAcolytes) // Inserindo nova escala no início. Poupa um sort
                SaveAcolyteData()
                break
            case MemberType.COROINHA:
                LineupScreenOptions.name = "Escala | Coroinhas "+(MemberData.allLineupsCoroinhas.length+1)
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

/**
 * Copia um prompt para o Gemini à área de transferência.
 */
function CopyGeminiPrompt(){
    CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.lineups,LineupScreenOptions.roles,LineupScreenOptions.roles))
}
