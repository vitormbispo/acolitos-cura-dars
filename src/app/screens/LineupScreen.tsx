import { View, Image, Text, ScrollView, } from "react-native"
import { ImageButton, TextButton } from "../classes/NewComps"
import { router } from "expo-router"
import { Global } from "../Global"
import { Acolyte, AcolyteData } from "../classes/AcolyteData"
import { StyleSheet } from "react-native"
import { useRef, useState } from "react"
import { AcolyteSelectScreenOptions } from "./AcolyteSelectScreen"
import { Lineup, StructuredLineup } from "../classes/Lineup"
import { CopyToClipboard, GenerateLineupPrompt, SaveAcolyteData } from "../classes/Methods"

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
    static name = "Nova escala"
    static lineupType = "Single" // Tipo da escala
    static roles = ["cero1","cero2","cruci","turib","navet","libri"]
    static rolesNames = ["Ceroferario 1","Ceroferario 2","Cruciferário","Turiferário","Naveteiro","Librífero"]

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
        line.rolesNames = LineupScreenOptions.rolesNames
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
        LineupScreenOptions.rolesNames = line.rolesNames
        LineupScreenOptions.name = line.name
    }

    // Rolagem da tela
    static scrollPos = 0
    static scrollRef = null
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
    let rolesNames = LineupScreenOptions.rolesNames
    let lineupAcolytes = []


    if(LineupScreenOptions.lineupType=="Single"){
        
    }

    let weekendAcolytes:Map<string,Array<any>> = new Map<string,Array<any>>()
    let weekendLineups = []

    let monthAcolytes:Map<string,Map<string,Array<any>>> = new Map<string,Map<string,Array<any>>>()

    switch(LineupScreenOptions.lineupType){
        case "Single":
        // Lógica:    
            for(let i = 0; i < roles.length;i++){
                    lineupAcolytes.push(<LineupAcolyte text={rolesNames[i]} role={roles[i]} key={i} lineup={LineupScreenOptions.lineups[0]}/>)
                }
        // Tela:
            return(
                <View style={{flex:1}}>
                    <UpperBar/>
                
                    <View style={{flex:1,paddingLeft:20}}>
                        {lineupAcolytes}
                    </View>

                    <View style={{alignSelf:"center",alignContent:"center",alignItems:"center",padding:10, flexDirection:"row"}}>
                        <TextButton buttonStyle={{padding:10}} text="Gerar prompt Gemini" press={()=>{
                            CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.allLineups,LineupScreenOptions.rolesNames,LineupScreenOptions.roles))
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
        
        case "Weekend":
        // Lógica:
            for(let i = 0;i < LineupScreenOptions.days.length;i++){
                let curDay = LineupScreenOptions.days[i]
                let line = LineupScreenOptions.lineups[i]
                let acolytes:Array<any> = []
                
                for(let h = 0;h < LineupScreenOptions.roles.length; h++){
                    acolytes.push(<LineupAcolyte text={rolesNames[h]} role={roles[h]} key={h} lineup={line}/>)
                }
        
                weekendAcolytes.set(curDay,acolytes)
                weekendLineups.push(<WeekendLineup name={LineupScreenOptions.daysNames[i]} acolytes={weekendAcolytes.get(curDay)} key={i}/>)
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
                            <WeekendLineup aco={weekendAcolytes.get("sabado")} day={"Sábado - 19h"}/>
                            <WeekendLineup aco={weekendAcolytes.get("domingoAM")} day={"Domingo - 8h"}/>
                            <WeekendLineup aco={weekendAcolytes.get("domingoPM")} day={"Domingo - 19h"}/>
                        </View>
                    </ScrollView>

                    <View style={{alignSelf:"center",alignContent:"center",alignItems:"center",padding:10,flexDirection:"row"}}>
                        <TextButton buttonStyle={{padding:10}} text="Gerar prompt Gemini" press={()=>{
                            CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.allLineups,LineupScreenOptions.rolesNames,LineupScreenOptions.roles))
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
                            acolytes.push(<LineupAcolyte text={rolesNames[k]} role={roles[k]} key={(i*100)+(j*10)+k} lineup={line}/>)
                        }
                
                        if(monthAcolytes.get(curWeekendKey) != undefined){
                            monthAcolytes.get(curWeekendKey)?.set(curDay,acolytes)
                        }
                        else{
                            monthAcolytes.set(curWeekendKey,new Map<string,Array<any>>)
                            monthAcolytes.get(curWeekendKey)?.set(curDay,acolytes)
                        }
                        
                        weekendLineups.push(<WeekendLineup name={LineupScreenOptions.daysNames[j]} acolytes={weekendAcolytes.get(curDay)} key={600+j}/>)
                        
                    }
                }
            }   
        // Tela 
            let array = Array.from(LineupScreenOptions.monthLineups.keys())
            
            return(
                <View style={{flex:1}}>
                    <UpperBar/>         
                    <MonthLineups weekends={array} monthAco={monthAcolytes}/>  
                    
                    <View style={{alignSelf:"center",alignContent:"center",alignItems:"center",padding:10,flexDirection:"row"}}>
                        <TextButton buttonStyle={{padding:10}} text="Gerar prompt Gemini" press={()=>{
                            CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.allLineups,LineupScreenOptions.rolesNames,LineupScreenOptions.roles))
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

            {LineupScreenOptions.loaded && // Se for uma escala carregada, aparece a opção de deletar.
            
            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
                <ImageButton img={require("@/src/app/shapes/delete_ico.png")} imgStyle={[Global.styles.buttonIcons,{width:48}]} press={()=>{EraseLineup(LineupScreenOptions.loadedLineIndex),SaveAcolyteData(),router.back()}}/>
            </View>
            }
        </View>
    )
}

export function LineupAcolyte(props:any) {
    return(
        <View style={{flexDirection:"row",alignSelf:"center",alignItems:"center",alignContent:"center"}}>
            <Text style={textStyles.functionTitle}>{props.text} - </Text>
            <Text style={textStyles.acolyteNick}>{CheckAcolyte(props.lineup.line.get(props.role))}</Text>
            <ImageButton buttonStyle={{alignContent:"center",alignItems:"center"}}img={require("@/src/app/shapes/switch_ico.png")} imgStyle={Global.styles.buttonIcons} press={()=>{
                let thisAcolyte = GetRoleAcolyte(props.role,props.lineup)
                if(!isSwitching){
                    switchingAcolyte = thisAcolyte
                    switchingAcolyteRole = props.role
                    switchingAcolyteLineup = props.lineup
                    isSwitching = true
                }
                else{
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

                AcolyteSelectScreenOptions.selectMode="Single"
                AcolyteSelectScreenOptions.selected = []
                
                AcolyteSelectScreenOptions.action = ()=>{
  
                    if(replacing != null){
                        replacing.rodizio[props.role]=replacing.oldRodizio[props.role]
                        replacing.priority=replacing.oldPriority
                        replacing.weekendPriority=replacing.oldWeekendPriority

                    }
                                      
                    replaced = AcolyteSelectScreenOptions.selected[0]
                    replaced.rodizio[props.role]=6
                    replaced.priority=4
                    replaced.weekendPriority[props.lineup.day]=3

                    props.lineup.line.set(props.role,replaced)
                    props.lineup.acolytes.splice(props.lineup.acolytes.indexOf(replacing),1)
                    props.lineup.acolytes.push(replaced)
            
                    router.back()
                }
                AcolyteSelectScreenOptions.excludedAcolytes=props.lineup.acolytes
                Global.currentScreen={screenName:"Selecione - Substituição",iconPath:""}
                AcolyteSelectScreenOptions.lineup = props.lineup
                router.push("/screens/AcolyteSelectScreen")
            }}/>
        </View>
    )
}

/**
 * Checa se o acólito existe ou não e retorna seu apelido caso exista,
 * Retorna "-Sem escala-" caso contrário.
 * @param aco Acólito
 * @returns string
 */
function CheckAcolyte(aco:Acolyte): string{
    if(aco != null){
        return aco.nick
    }
    else{
        return "-Sem escala-"
    }
}

/**
 * Retorna o acólito escalado em determinada função em determinada escala
 * @param role Função
 * @param lineup Escala
 * @returns 
 */
function GetRoleAcolyte(role:string,lineup:any){
    return lineup.line.get(role)
    
}

/**
 * Troca os acólitos
 * @param switching Acótico a ser trocado
 * @param switched Acólito que substituirá
 * @param switchingRole Função do acólito a ser trocado
 * @param switchedRole Função do acólito que substituirá
 * @param switchingLineup Escala a ser trocado
 * @param switchedLineup Escala que substituirá
 */
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
