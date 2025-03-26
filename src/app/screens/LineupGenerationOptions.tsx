import { View, Text, ScrollView, Modal, Role} from "react-native"
import { CheckBox,DataSection,DropDown,ExpandableView,LoadingModal,SingleCheck, TextButton, TextCheckBox, UpperBar } from "../classes/NewComps"
import { Lineup, LineupType } from "../classes/Lineup"
import { GenerateLineup, GenerateRandomLineup } from "../classes/LineupGenerator"
import { router } from "expo-router"
import { LineupScreenOptions } from "./LineupScreen"
import { contextStore, menuStore } from "../store/store"
import { Member, MemberData, MemberType } from "../classes/MemberData"
import { Roles, RoleSet } from "../classes/Roles"
import { textStyles } from "../styles/GeneralStyles"
import { ResetAllLastWeekend } from "../classes/Methods"
import { Dates, DateSet } from "../classes/Dates"
import { useShallow } from 'zustand/react/shallow'
import { ICONS } from "../classes/AssetManager"
import { useState } from "react"
import { Places } from "../classes/Places"

// TODO Ajustar pra reiniciar as exclusiveOptions

/**
 * Tipo do objeto que armazena as opções de geração
 */
export type GenerationOptionsType = {
    "weekend":string,
    "day":string,
    "allowOut":boolean,
    "allRandom":boolean,
    "solemnity":boolean,
    "lineupType":LineupType,
    "monthDays":object,
    "dayRotation":boolean,
    "randomness":number,
    "roleset":RoleSet,
    "places":Array<string>,
    "dateset":DateSet,
    "exclusiveOptions":object
}

/**
 * Enumerador com os valores das opções de aleatoriedade, de baixa até alta.
 */
enum Randomness{
    LOW = 1,
    MEDIUM_LOW = 1.3,
    MEDIUM = 1.6,
    MEDIUM_HIGH = 1.7,
    HIGH = 2
}
/**
 * Tela das opções de geração de escalas.
 */
export default function LineupGenerationOptions(){    
    const {lineupType,curGenOptions} = contextStore()
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))
    const {type} = menuStore()
    const [isGenerating,setIsGenerating] = useState(false)
    const [randomness,setRandomness] = useState(Randomness.MEDIUM)
    
    let options:React.JSX.Element

    switch (lineupType){
        case LineupType.SINGLE:  options = <SingleLineupOptions/>; break
        case LineupType.WEEKEND: options = <WeekendLineupOptions/>; break
        case LineupType.MONTH:   options = <MonthLineupOptions/>; break
    }

    // Seleção de RoleSet
    let rolesets:Array<RoleSet> = []
    switch(type){
        case MemberType.ACOLYTE:
            rolesets = Roles.acolyteRoleSets.slice(); break
        case MemberType.COROINHA:
            rolesets = Roles.coroinhaRoleSets.slice(); break
    }

    let rolesetOptions:Array<string> = []
    let rolesetActions:Array<(...args:any)=>any> = []

    for(let i = 0; i < rolesets.length; i++){
        let curSet = rolesets[i]

        rolesetOptions.push(curSet.name)
        rolesetActions.push(()=>{
            curGenOptions.roleset = curSet
        })
    }

    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.escala} screenName={"Nova escala"} toggleEnabled={false}/>
            
            <ScrollView style={{flex:1}}>

                <DataSection text={"- Opções"}/>
                
                {/* < Opções de aleatoriedade > */}
                <Text style = {[textStyles.dataTitle,{padding:10}]}>- Aleatoriedade</Text>
                <RandomnessSelect genOptions={curGenOptions} randomnessNames={["+Baixa","Baixa","Média","Alta","+Alta"]}/>
                

                <View style={{flex:1}}>
                    <View style={{flexDirection:"row",alignItems:"center",padding:10}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Totalmente aleatório</Text>
                        <CheckBox checked={curGenOptions.allRandom} press={()=>{curGenOptions.allRandom = !curGenOptions.allRandom}}/>
                    </View>
                </View>

                {/* RoleSet */}
                <DataSection text={"- Conjunto de funções"}/>
                <DropDown options={rolesetOptions} actions={rolesetActions} placeholder="Selecione as funções:" offset={{x:0,y:0}}/>
                
                <DataSection text={"- Local"}/>
                <PlaceSelect selectedPlaces={generationOptions.places}/>
                {options}

                <AdvancedOptions/>
            </ScrollView>
            <TextButton text="Gerar escala" textStyle={textStyles.textButtonText} press={()=>{
                setIsGenerating(true)
                setTimeout(()=>{
                    GerarEscala(generationOptions,type,()=>{setTimeout(()=>{setIsGenerating(false)},50)})
                },200)
                
            }}/>
            <LoadingModal visible={isGenerating}/>
        </View>
    )
}

/**
 * Valida de o 'value' de uma checkbox única é igual ao 'id'.
 * Ou seja, retorna uma imagem de checkbox verdadeira caso a caixa de 'id' X
 * tenha o mesmo valor do atual 'value'. 
 * Retorna uma imagem de checkbox falsa caso contrário.
 * @param value 
 * @param id 
 * @returns 
 */
function CheckImage(value:any,id:any){
    if(value == id){
      return(require("@/src/app/shapes/check_true.png"))
    }
    else{
      return(require("@/src/app/shapes/check_false.png"))
    }
}

/**
 * Opções para geração de uma escala úncia
 * @returns React.JSX.Component
 */
const SingleLineupOptions = () => {
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))

    const {type} = menuStore()
    return(
        <View style={{flex:1}}>
                
            <DataSection text={"- Dias e horários"}/>
            
            <WeekendSelection set={new DateSet()} single={true}/>
            <SingleDaySelection/>  
        </View>
    )
}

/**
 * Opções para geração de uma escala para um fim de semana
 * @returns React.JSX.Component
 */
const WeekendLineupOptions = () => {
    const {type} = menuStore()
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))

    return(
        <View style={{flex:1}}>
            <DataSection text={"- Dias e horários"}/>
            
            <WeekendSelection set={new DateSet()}/>

            <View style={{flexDirection:"row",alignItems:"center"}}>
                <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Horário</Text>
                <DaySelection/>
            </View>
        </View>

    )
}

/**
 * Opções para geração de uma escala mensal
 * @returns React.JSX.Component
 */
const MonthLineupOptions = () => {
    
    const {type} = menuStore()
    
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))
    return(
        <View style={{flex:1}}>
            <DataSection text={"- Dias e horários"}/>
                
            <View style={{paddingTop:50}}>               
                <MonthDaySelection/>
            </View>
        </View>
    )
}

/**
 * Gera as escalas de determinado tipo('type') de acordo com as 'generateOptions'
 * @param generateOptions Opções de geração
 * @param type Tipo de membro a gerar
 * @param finished Ação ao finalizar a geração
 */
function GerarEscala(generateOptions:GenerationOptionsType,type:MemberType,finished?:(...args)=>void){
    let members:Array<Member>
    
    switch(type) {
        case MemberType.ACOLYTE:members = MemberData.allAcolytes;break
        case MemberType.COROINHA:members = MemberData.allCoroinhas;break
    }
    if(members == null || members.length == 0){
        console.error("Unable to generate lineup. Members is empty.")
        return
    }
    
    let roleset:RoleSet = generateOptions.roleset

    LineupScreenOptions.lineups = []

    let generatedLineups:object = {}
    let allLineups:Array<Lineup> = []

    LineupScreenOptions.lineups = []
    LineupScreenOptions.days = generateOptions.dateset.days
            
    let weekends = Object.keys(generateOptions.monthDays)
    
    generateOptions.places = Places.OrganizePlaceArray(generateOptions.places) // Organiza a ordem dos locais
    
    // Organiza a ordem dos dias
    for(let i = 0; i < weekends.length; i++){
        let curWeekend = weekends[i]
        generateOptions.monthDays[curWeekend] = Dates.OrganizeDays(generateOptions.dateset,generateOptions.monthDays[curWeekend])
    }

    // Organiza a ordem dos fins de semana
    generateOptions.monthDays = Dates.OrganizeWeekends(generateOptions.dateset,generateOptions.monthDays) 
    weekends = Object.keys(generateOptions.monthDays) // Atualiza com os fins de semana organizados

    if(generateOptions.places.length == 0 || generateOptions.places == undefined){
        generateOptions.places = [null]
    }
    
    for(let i = 0; i < weekends.length;i++){
        let weekendKey = weekends[i] // Finais de semana
        let curWeekend = generateOptions.monthDays[weekendKey] // Dias no fim de semana
        
        generatedLineups[weekendKey] = new Array<Lineup>
        
        if(curWeekend != undefined){
            for(let k = 0; k < curWeekend.length;k++){
                let curDay:string = curWeekend[k] // Dia
                
                for(let p = 0; p < generateOptions.places.length;p++){
                    let curPlace = generateOptions.places[p]
                    let key = weekendKey+""+curDay
                    let newLineup

                    if(generateOptions.exclusiveOptions[key] != undefined){
                        let opt = generateOptions.exclusiveOptions[key]
                        newLineup = GenerateLineup({weekend:weekendKey,day:curDay,roleset:opt.roleset,type:type,randomness:opt.randomness,place:curPlace})
                    }
                    else{
                        newLineup = generateOptions.allRandom ?
                        GenerateRandomLineup(roleset,type,weekendKey,curDay):
                        GenerateLineup({weekend:weekendKey,day:curDay,roleset:roleset,type:type,randomness:generateOptions.randomness,place:curPlace})
                    }
                    
                    generatedLineups[weekendKey].push(newLineup)
                    allLineups.push(newLineup)
                }
                
            }
        }

        if(generatedLineups[weekendKey].length == 0){
            delete generatedLineups[weekendKey]
        } 
    }
    
    
    LineupScreenOptions.monthLineups = generatedLineups
    LineupScreenOptions.lineups = allLineups
    LineupScreenOptions.loaded = false
    LineupScreenOptions.roles = roleset.set

    if(!generateOptions.allRandom){ResetAllLastWeekend(members)}

    LineupScreenOptions.scrollPos = 0
    finished()
    router.push("/screens/LineupScreen")
}


/**
 * Alterna entre ativado/desativado o dia do fim de semana
 * das opções de geração
 * @param weekend fim de semana
 * @param day dia
 * @param generateOptions opções
 */
function ToggleDay(weekend:any,day:any,generateOptions:GenerationOptionsType){
    let days = generateOptions.monthDays
    
    if(days[weekend] == undefined){ // Array não inicializada
        days[weekend] = [day]
        return
    }

    let dayIndex = days[weekend].indexOf(day)

    if(dayIndex == -1){ // O dia não está incluído
        days[weekend].push(day)
    }
    else { // Dia incluído
        days[weekend].splice(dayIndex,1) // Deleta
    }
}


/**
 * Seleção dos dias a serem gerados em uma escala mensal
 * @returns 
 */
export function MonthDaySelection(){
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))
    let checks = []
    let days = generationOptions.dateset.days
    let weekends = generationOptions.dateset.weekends
    
    for(let i = 0; i <  weekends.length;i++){
        let curWeekend = weekends[i]
        let dayChecks = []
        for(let j = 0; j < days.length;j++){
            let curDay = days[j]
            let check = <CheckBox checked={generationOptions.monthDays[curWeekend] != null && 
                                           generationOptions.monthDays[curWeekend].indexOf(curDay)!=-1} 
                                  press={()=>{ToggleDay(curWeekend,curDay,generationOptions)}} key={curWeekend+curDay+j}
                                  topText={i == 0 ? curDay : null}
                                  />

            dayChecks.push(check)
        }
        checks.push(
        <View style={{flexDirection:"row",alignItems:"center",flex:1}} key={curWeekend+i}>
            <Text style={{padding:10,flex:1}}>{curWeekend}</Text>
            {dayChecks}
        </View>)
    }
    
    return(
        <View>
            {checks}
        </View>
        
    )
}

/**
 * Seleção dos dias de um único fim de semana
 */
export function DaySelection(){
    const {curWeekend} = contextStore()
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))

    let days = generationOptions.dateset.days
    let checks = []
    for(let i = 0; i < days.length;i++){
        checks.push(
        <CheckBox checked={
            generationOptions.monthDays[curWeekend] != undefined ?
                generationOptions.monthDays[curWeekend].indexOf(days[i]) != -1:
                false
            } 
            press={()=>{
            ToggleDay(curWeekend,days[i],generationOptions)
        }} key={days[i]}/>)
    }

    return(
        <View style={{flex:1, flexDirection:'row'}}>
            {checks}
        </View>
    )
}

/**
 * Seleção de um único dia para geração de uma escala individual
 * @returns 
 */
function SingleDaySelection(){
    const {curWeekend,curDay,updateDay} = contextStore()
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))
    let days = generationOptions.dateset.days
    let checks = []
    for(let i = 0; i < days.length;i++){
        let day = days[i]
        checks.push(<SingleCheck img={CheckImage(curDay,day)} topText={day} press={()=>{
            SetSingleDay(day,curWeekend,generationOptions   )
            updateDay(day)
        }} key={day+i}/>)
    }

    return(
        <View style={{flex:1, flexDirection:'row'}}>
            {checks}
        </View>
    )
}

/**
 * Define os dias do mês para um único dia
 * @param day 
 * @param weekend 
 * @param options 
 */
function SetSingleDay(day:string,weekend:string,options:GenerationOptionsType){
    options.monthDays = {}
    options.monthDays[weekend] = [day]
}

type WeekendSelection = {
    set:DateSet
    single?:boolean
}
export function WeekendSelection(props:WeekendSelection){
    const {curDay,curWeekend,updateWeekend} = contextStore()
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))

    let weekends = props.set.weekends
    let checks = []
    for(let i = 0; i < weekends.length;i++){
        let week = weekends[i]
        checks.push(
            <SingleCheck img={CheckImage(curWeekend,week)} topText={week} press={()=>{
                if(props.single){
                    SetSingleDay(curDay,week,generationOptions)
                    updateWeekend(week)
                    return
                }
                let tempDays:Array<string> = generationOptions.monthDays[curWeekend] // Armazenar temporariamente os dias de outro fim de semana
                generationOptions.monthDays = {}
                updateWeekend(week)
                generationOptions.monthDays[week] = tempDays

            }} key={week+i}/>
        )
    }

    return(
        <View style={{flex:1, flexDirection:'row'}}>
            {checks}
        </View>
    )
}

type PlaceSelectProps = {
    selectedPlaces:Array<string>
}
function PlaceSelect(props:PlaceSelectProps){
    let checks:Array<React.JSX.Element> = []
    const {curGenOptions} = contextStore()

    for(let i = 0; i < Places.allPlaces.length; i++){
        let curPlace = Places.allPlaces[i]
        let placeSelectedIndex = curGenOptions.places.indexOf(curPlace)
        let check = <TextCheckBox checked={placeSelectedIndex != -1} text={curPlace} key={i} press={()=>{
            placeSelectedIndex = curGenOptions.places.indexOf(curPlace)
            if(placeSelectedIndex != -1){
                curGenOptions.places.splice(placeSelectedIndex,1)
                console.log(curGenOptions.places)
            } 
            else{
                curGenOptions.places.push(curPlace)
                console.log(curGenOptions.places)
            }
            
            
        }}/>
        checks.push(check)
    }

    return(
        <View style={{flexDirection:"row",alignItems:"center",flex:1,flexWrap:"wrap",gap:10,padding:10}}>
            {checks}
        </View>
    )
}

type AdvancedOptionsProps = {

}
function AdvancedOptions(){
    const [isExpanded,setExpanded] = useState(false)
    const {curGenOptions} = contextStore()
    const [editingExclusive,setEditingExclusive] = useState({weekend:undefined,day:undefined})
    const [editingModalOpened,setEditingModalOpened] = useState(false)
    let weekends = Object.keys(curGenOptions.monthDays)
    let wkButtons = []
   
    for(let i = 0; i < weekends.length; i++){
        let newButton = <TextButton text={weekends[i]} press={()=>{
            setEditingExclusive({weekend:weekends[i],day:undefined})
            setEditingModalOpened(true)
        }} key={i}/>;
        wkButtons.push(newButton)
    }

    return(
        <ExpandableView expanded={isExpanded} title={"Opções avançadas"} content={
            <View style={{flex:1}}>
                <View style={{flexDirection:'row'}}>
                    {wkButtons}
                </View>
                <SingleDayOptions visible={editingModalOpened} genOptionsKey={editingExclusive} rolesets={Roles.acolyteRoleSets} onClose={()=>{setEditingModalOpened(false)}}/>
            </View>
        }/>
        
    )
}

type SingleDayOptionsProps = {
    visible:boolean
    genOptionsKey:{weekend:undefined,day:undefined}
    rolesets:Array<RoleSet>
    onClose?:(...args:any)=>void
}
function SingleDayOptions(props:SingleDayOptionsProps){
    const {curGenOptions} = contextStore()
    let options = Object.create(curGenOptions)
    
    let rolesetOptions:Array<string> = []
    let rolesetActions:Array<(...args:any)=>any> = []

    for(let i = 0; i < props.rolesets.length; i++){
        let curSet = props.rolesets[i]

        rolesetOptions.push(curSet.name)
        rolesetActions.push(()=>{
            options.roleset = curSet
        })
    }

    return(
        <Modal visible={props.visible} transparent={true}>
            <View style={{flex:1,backgroundColor:"#FFFFFF"}}>
                <UpperBar icon={ICONS.escala} screenName={props.genOptionsKey.weekend + "" + (props.genOptionsKey.day != undefined ? props.genOptionsKey.day : "")}/>
                <ScrollView style={{flex:1}}>
                    <DataSection text={"- Opções"}/>

                    
                    <Text style = {[textStyles.dataTitle,{padding:10}]}>- Aleatoriedade</Text>
                    <RandomnessSelect genOptions={options} randomnessNames={["+Baixa","Baixa","Média","Alta","+Alta"]}/>

                    <View style={{flex:1}}>
                        <View style={{flexDirection:"row",alignItems:"center",padding:10}}>
                            <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Totalmente aleatório</Text>
                            <CheckBox checked={options.allRandom} press={()=>{options.allRandom = !options.allRandom}}/>
                        </View>
                    </View>

                    
                    <DataSection text={"- Conjunto de funções"}/>
                    <DropDown options={rolesetOptions} actions={rolesetActions} placeholder="Selecione as funções:" offset={{x:0,y:0}}/>

                    <DataSection text={"- Local"}/>
                    <PlaceSelect selectedPlaces={options.places}/>
                </ScrollView>
                
                <TextButton text={"Concluir"} press={()=>{
                    if(props.genOptionsKey.day != undefined){
                        curGenOptions.exclusiveOptions[props.genOptionsKey.weekend + "" + props.genOptionsKey.day] = options
                    }
                    else{
                        curGenOptions.dateset.days.forEach((day)=>{
                            curGenOptions.exclusiveOptions[props.genOptionsKey.weekend + "" + day] = options
                        })
                    }
                    
                    props.onClose()
                }}/>
            </View>
        </Modal>
    )
}

type RandomnessSelectProps = {
    genOptions:any
    randomnessNames:Array<string>
}
function RandomnessSelect(props:RandomnessSelectProps){
    const [randomness,setRandomness] = useState(Randomness.MEDIUM)
    let keys = Object.values(Randomness).filter(key => typeof key == "number")
    let selectors = []
    for(let i = 0; i < keys.length;i++){
        let level:Randomness = Number(keys[i])
        let comp =
        <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center"}} key={i}>
            <Text numberOfLines={1} style={{fontFamily:"Inter-Light",fontSize:15}}>{props.randomnessNames[i]}</Text>
            <SingleCheck img={CheckImage(randomness,level)} press={()=>{props.genOptions.randomness = level, setRandomness(level)}}/>
        </View>;
        selectors.push(comp)
        
    }

    return(
        <View style={{flexDirection:"row",alignItems:"center",flex:0.5,alignContent:"center"}}>
            {selectors}
        </View>
    )
}