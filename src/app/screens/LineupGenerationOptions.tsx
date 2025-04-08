import { View, Text, ScrollView, Modal, Role} from "react-native"
import { CheckBox,DataSection,DropDown,ExpandableView,GetMemberIcon,LoadingModal,MemberSelectModal,RowImageButton,SingleCheck, TextButton, TextCheckBox, UpperBar } from "../classes/NewComps"
import { Lineup, LineupType } from "../classes/Lineup"
import { GenerateLineup, GenerateRandomLineup } from "../classes/LineupGenerator"
import { router } from "expo-router"
import { LineupScreenOptions } from "./LineupScreen"
import { contextStore, menuStore } from "../store/store"
import { Member, MemberData, MemberType } from "../classes/MemberData"
import { Roles, RoleSet } from "../classes/Roles"
import { textStyles, uiStyles } from "../styles/GeneralStyles"
import { GetMemberArray, ResetAllLastWeekend } from "../classes/Methods"
import { Dates, DateSet } from "../classes/Dates"
import { useShallow } from 'zustand/react/shallow'
import { ICONS } from "../classes/AssetManager"
import { useRef, useState } from "react"
import { Places } from "../classes/Places"

// TODO Ajustar pra reiniciar as exclusiveOptions

/**
 * Tipo do objeto que armazena as opções de geração
 */
export type GenerationOptionsType = {
    "members":Array<Member>
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
    const [memberSelectOpen,setMemberSelectOpen] = useState(false)
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

    const scrollRef = useRef<ScrollView>(null)
    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.escala} screenName={"Nova escala"} toggleEnabled={false}/>
            
            <ScrollView style={{flex:1}} ref={scrollRef}>

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
                <RowImageButton img={GetMemberIcon()}text="Selecionar membros" press={()=>{
                    setMemberSelectOpen(true)
                }}/>
                <MemberSelectModal title={"Selecione"} 
                    returnCallback={
                        (selected)=>{
                            generationOptions.members = selected; 
                            console.log(generationOptions.members.length)
                        }}
                    visible={memberSelectOpen} 
                    requestClose={()=>{setMemberSelectOpen(false)}} 
                    onSubmit={()=>{
                        setMemberSelectOpen(false)
                    }} 
                    multiselect={true} 
                    allSelected={true}
                />

            </ScrollView>
            <TextButton text="Gerar escala" textStyle={textStyles.textButtonText} press={()=>{
                setIsGenerating(true)
                setTimeout(()=>{ // O setTimeout serve apenas para iniciar a animação de loading.
                    GerarEscala(generationOptions,type,()=>{setTimeout(()=>{setIsGenerating(false)},100)})
                },10)
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
    LineupScreenOptions.lineups = []

    let generatedLineups:object = {}
    let allLineups:Array<Lineup> = []

    LineupScreenOptions.lineups = []
            
    let weekends = Object.keys(generateOptions.monthDays)
    
    // Organiza a ordem dos dias
    for(let i = 0; i < weekends.length; i++){
        let curWeekend = weekends[i]
        generateOptions.monthDays[curWeekend] = Dates.OrganizeDays(generateOptions.dateset,generateOptions.monthDays[curWeekend])
    }

    // Organiza a ordem dos fins de semana
    generateOptions.monthDays = Dates.OrganizeWeekends(generateOptions.dateset,generateOptions.monthDays) 
    weekends = Object.keys(generateOptions.monthDays) // Atualiza com os fins de semana organizados
    
    for(let i = 0; i < weekends.length;i++){
        let weekendKey = weekends[i] // Finais de semana
        let curWeekend = generateOptions.monthDays[weekendKey] // Dias no fim de semana
        
        generatedLineups[weekendKey] = new Array<Lineup>
        
        if(curWeekend != undefined){
            for(let k = 0; k < curWeekend.length;k++){
                let curDay:string = curWeekend[k] // Dia
                let key:string = weekendKey+""+curDay
                let opt = generateOptions.exclusiveOptions[key] != undefined ? generateOptions.exclusiveOptions[key] : generateOptions
                opt.places = Places.OrganizePlaceArray(opt.places)
                let places:Array<string> = opt.places
                
                if(places.length == 0 || places == undefined){
                    places = [null]
                }

                for(let p = 0; p < places.length;p++){
                    let curPlace:string = places[p]
                    if(curPlace != undefined){key = weekendKey+curDay+curPlace}
                    
                    let placeOpt = generateOptions.exclusiveOptions[key] != undefined ? generateOptions.exclusiveOptions[key] : Object.create(opt) // Se houver configuração específica para o local

                    if(placeOpt.dayExceptions != undefined && placeOpt.dayExceptions.includes(curDay)){ // Se está nas excessões de dia, pula essa escala
                        continue
                    }
                    let newLineup:Lineup = generateOptions.allRandom ?
                        GenerateRandomLineup(placeOpt.roleset,type,weekendKey,curDay):
                        GenerateLineup({members:placeOpt.members,weekend:weekendKey,day:curDay,roleset:placeOpt.roleset,type:type,randomness:placeOpt.randomness,place:curPlace})
        
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

    let members:Array<Member> = GetMemberArray(type)

    if(members == null || members.length == 0){
        console.error("Unable to generate lineup. Members is empty.")
        return
    }
    
    if(!generateOptions.allRandom){ResetAllLastWeekend(members)}

    LineupScreenOptions.places = generateOptions.places
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

    for(let i = 0; i < Places.allPlaces.length; i++){
        let curPlace = Places.allPlaces[i]
        let placeSelectedIndex = props.selectedPlaces.indexOf(curPlace)
        let check = <TextCheckBox checked={placeSelectedIndex != -1} text={curPlace} key={i} press={()=>{
            placeSelectedIndex = props.selectedPlaces.indexOf(curPlace)
            if(placeSelectedIndex != -1){
                props.selectedPlaces.splice(placeSelectedIndex,1)
            } 
            else{
                props.selectedPlaces.push(curPlace)
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


function AdvancedOptions(props:any){
    const [isExpanded,setExpanded] = useState(false)
    const {curGenOptions} = contextStore()
    const [editingExclusive,setEditingExclusive] = useState({weekend:undefined,day:undefined,place:undefined})
    const [editingModalOpened,setEditingModalOpened] = useState(false)
    
    
    // Seleção do local
    let placeOptions = ["Todos"]
    let placeActions = [()=>{editingExclusive.place = undefined}]

    for(let i = 0; i < Places.allPlaces.length; i++){
        let curPlace = Places.allPlaces[i]

        placeOptions.push(curPlace)
        placeActions.push(()=>{setEditingExclusive({weekend:editingExclusive.weekend,day:editingExclusive.day,place:curPlace})})
    }
    // Botões de configuração individual dos fins de semana
    let weekends = Object.keys(curGenOptions.monthDays)
    let wkButtons = []
   
    for(let i = 0; i < weekends.length; i++){
        let newButton = <TextButton text={weekends[i]} press={()=>{
            setEditingExclusive({weekend:weekends[i],day:undefined,place:editingExclusive.place})
            setEditingModalOpened(true)
        }} key={i}/>;
        wkButtons.push(newButton)
    }

    // Botões de configuração individual de dias específicos
    let daysButtons = []
   
    for(let i = 0; i < weekends.length; i++){
        let curWeekend = weekends[i]
        let days = curGenOptions.monthDays[curWeekend]
        let rows = []
        
        for(let j = 0; j < days.length; j++){
            let curDay = days[j]
            let newButton = <TextButton textStyle={{fontSize:10}}text={curWeekend+"\n"+curDay} press={()=>{
                setEditingExclusive({weekend:curWeekend,day:curDay,place:editingExclusive.place})
                setEditingModalOpened(true)
            }} key={j}/>;

            rows.push(newButton)
        }
        
        daysButtons.push(<View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}} key={i}>{rows}</View>)
        
    }

    return(
        <ExpandableView expanded={isExpanded} title={"Opções avançadas"} content={
            
            <View style={{flex:1}}>
                <DataSection text="Opções individuais:"/>
                
                <Text style={textStyles.dataTitle}> - Selecione o local:</Text>
                <DropDown options={placeOptions} actions={placeActions} placeholder="Todos"/>
                <Text style={textStyles.dataTitle}> - Por final de semana:</Text>
                <View style={{flexDirection:'row',justifyContent:"center"}}>
                    {wkButtons}
                </View>
                <Text style={textStyles.dataTitle}> - Por dia:</Text>
                <View style={{flexDirection:'row',justifyContent:'center',flexWrap:'wrap'}}>
                    {daysButtons}
                </View>
                {editingModalOpened ? <ExclusiveOptions 
                    visible={editingModalOpened} 
                    genOptionsKey={editingExclusive} 
                    rolesets={Roles.acolyteRoleSets} 
                    onClose={()=>{setEditingModalOpened(false)}}/> : null}
            </View>
        }/>
    )
}

type ExclusiveOptionsProps = {
    visible:boolean
    genOptionsKey:{weekend:string,day:string,place:string}
    rolesets:Array<RoleSet>
    onClose?:(...args:any) => void
}
function ExclusiveOptions(props:ExclusiveOptionsProps){
    const {curGenOptions} = contextStore()
    const [memberSelectOpen,setMemberSelectOpen] = useState(false)
    const isEditing = useRef(false) // As opções estão em processo de edição?
    const {theme} = menuStore()
    
    let key = props.genOptionsKey.weekend
    key += props.genOptionsKey.day != undefined ? props.genOptionsKey.day : Dates.defaultDays[0]
    key += props.genOptionsKey.place != undefined ? props.genOptionsKey.place : ""
    
    let baseOptions = curGenOptions.exclusiveOptions[key] != undefined ? curGenOptions.exclusiveOptions[key] : curGenOptions
    const options = useRef({members:baseOptions.members.slice(),places:baseOptions.places.slice(),roleset:baseOptions.roleset,allRandom:baseOptions.allRandom,dayExceptions:[]})
    
    if(!isEditing.current){ // Se ainda não estiver editando:
        options.current = {members:baseOptions.members.slice(),places:baseOptions.places.slice(),roleset:baseOptions.roleset,allRandom:baseOptions.allRandom,dayExceptions:baseOptions.dayExceptions}
        isEditing.current = true
    }
    
    // Configurar opções do DropDown de seleção de RoleSet
    let rolesetOptions:Array<string> = []
    let rolesetActions:Array<(...args:any)=>any> = []

    for(let i = 0; i < props.rolesets.length; i++){
        let curSet = props.rolesets[i]

        rolesetOptions.push(curSet.name)
        rolesetActions.push(()=>{
            options.current.roleset = curSet
        })
    }

    // Criar botões de seleção de dias
    let daysChecks = []
    const dayExceptions = useRef([])
    dayExceptions.current = options.current.dayExceptions != undefined ? options.current.dayExceptions : dayExceptions.current
    for(let i = 0; i < curGenOptions.dateset.days.length; i++){
        let curDay = curGenOptions.dateset.days[i]
        
        
        let comp = <CheckBox checked={!dayExceptions.current.includes(curDay)} press={()=>{
            let dayIndex = dayExceptions.current.indexOf(curDay)
            if(dayIndex == -1){
                dayExceptions.current.push(curDay)
            }
            else{
                dayExceptions.current.splice(dayIndex,1)
            }
            console.log(dayExceptions.current)
        }} topText={curDay} topTextStyle={textStyles.buttonText} key={i}/>

        daysChecks.push(comp)
    }

    const Close = ()=>{
        isEditing.current = false
        props.onClose()
    }

    const Submit = ()=>{
        let key = props.genOptionsKey.weekend
        options.current.dayExceptions = dayExceptions.current
        if(props.genOptionsKey.day != undefined){
            key += props.genOptionsKey.day
            key += props.genOptionsKey.place != undefined ? props.genOptionsKey.place : ""

            curGenOptions.exclusiveOptions[key] = options.current
        }
        else{
            curGenOptions.dateset.days.forEach((day)=>{
                key = props.genOptionsKey.weekend + day
                key += props.genOptionsKey.place != undefined ? props.genOptionsKey.place : ""

                curGenOptions.exclusiveOptions[key] = options.current
            })
        }
        
        isEditing.current = false
        props.onClose()
    }

    return(
        <Modal visible={props.visible} transparent={true} animationType="fade" onRequestClose={Close}>
            <View style={{flex:1,backgroundColor:"#00000099"}}>
                <View style={{flex:1,backgroundColor:"#FFFFFF",marginHorizontal:20,marginVertical:40,borderRadius:15}}>
                    <View style={{backgroundColor:theme.primary,height:100,borderRadius:15,margin:10,justifyContent:"center",alignItems:"center"}}>
                        <Text style={textStyles.dataTitle}>Editando {props.genOptionsKey.weekend + (props.genOptionsKey.day != null ? props.genOptionsKey.day : "") + (props.genOptionsKey.place != null ? props.genOptionsKey.place : "")}</Text>
                    </View>
                    
                    <ScrollView style={{flex:1}}>
                        <DataSection text={"- Opções"}/>

                        
                        <Text style = {[textStyles.dataTitle,{padding:10}]}>- Aleatoriedade</Text>
                        <RandomnessSelect genOptions={options} randomnessNames={["+Baixa","Baixa","Média","Alta","+Alta"]}/>

                        <View style={{flex:1}}>
                            <View style={{flexDirection:"row",alignItems:"center",padding:10}}>
                                <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Totalmente aleatório</Text>
                                <CheckBox checked={options.current.allRandom} press={()=>{options.current.allRandom = !options.current.allRandom}}/>
                            </View>
                        </View>

                        
                        <DataSection text={"- Conjunto de funções"}/>
                        <DropDown options={rolesetOptions} actions={rolesetActions} placeholder="Selecione as funções:" offset={{x:0,y:0}}/>

                        
                        {props.genOptionsKey.place == undefined ? 
                        <View>
                            <DataSection text={"- Local"}/>
                            <PlaceSelect selectedPlaces={options.current.places}/>
                        </View>
                        : null}

                        {props.genOptionsKey.day == undefined ?
                        <View>
                            <DataSection text={"Dias"}/>
                            <View style={{flexDirection:"row",marginTop:35}}>
                                {daysChecks}
                            </View>
                            
                        </View> : null}
                        
                        <RowImageButton img={GetMemberIcon()}text="Selecionar membros" press={()=>{
                            setMemberSelectOpen(true)
                         }}/>
                        <MemberSelectModal title={"Selecione"} 
                            returnCallback={
                                (selected)=>{
                                    options.current.members = selected; 
                                    console.log(options.current.members.length)
                                }}
                            visible={memberSelectOpen} 
                            requestClose={()=>{setMemberSelectOpen(false)}} 
                            onSubmit={()=>{
                                setMemberSelectOpen(false)
                            }} 
                            multiselect={true} 
                            allSelected={false}
                            selectedMembers={options.current.members}
                        />
                    </ScrollView>
                    
                    <View style={{flexDirection:"row", justifyContent:"center"}}>
                        <TextButton text="Cancelar" buttonStyle={{backgroundColor:theme.reject}} press={()=>{
                            Close()
                        }}/>

                        <TextButton text={"Concluir"} buttonStyle={{backgroundColor:theme.confirm}} press={()=>{
                            Submit()
                        }}/>
                    </View>
                    
                </View>
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