import { View, Text, ScrollView, Modal, Role, Pressable, TextInput, Platform, ToastAndroid} from "react-native"
import { CheckBox,DataSection,DropDown,ExpandableView,GetMemberIcon,ImageButton,LoadingModal,MemberSelectModal,RowImageButton,SingleCheck, TextButton, TextCheckBox, TextInputBox, TextInputModal, UpperBar } from "../classes/NewComps"
import { Lineup, LineupType } from "../classes/Lineup"
import { BalanceDiscarded, BalanceLineups, GenerateLineup, GenerateRandomLineup, GenerationCache } from "../classes/LineupGenerator"
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
import { useEffect, useRef, useState } from "react"
import { Places } from "../classes/Places"
import { Preset, PresetsData } from "../classes/PresetsData"

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
    "exclusiveOptions":object,
    "preset":Preset
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
    const {lineupType,curGenOptions,updateGenOptions} = contextStore()
    const [memberSelectOpen,setMemberSelectOpen] = useState(false)
    const {type,theme} = menuStore()
    const [isGenerating,setIsGenerating] = useState(false)
    
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
            let newState:GenerationOptionsType = JSON.parse(JSON.stringify(curGenOptions))
            newState.roleset = curSet
            updateGenOptions(newState)
        })
    }

    /**
     * Configurações de predefinições 
    */  
    const [presetAddOpen,setPresetAddOpen] = useState(false)
    const [newPresetName,setNewPresetName] = useState("")
    const [curPreset,setCurPreset] = useState(new Preset()) // Referência da predefinição atual. Use essa referência para modificar diretamente a predefinição.
    
    let presets:Array<Preset> = []
    switch(type){
        case MemberType.ACOLYTE:
            presets = PresetsData.acolyteGenerationPresets; break
        case MemberType.COROINHA:
            presets = PresetsData.coroinhaGenerationPresets; break
    }
    
    let presetsOptions:Array<string> = []
    let presetsActions:Array<(...args:any)=>any> = []

    for(let i = 0; i < presets.length; i++){
        
        let curSet = new Preset()
        curSet.UpdatePreset(presets[i].options,presets[i].name)

        presetsOptions.push(curSet.name)
        presetsActions.push(()=>{
            curSet.UpdatePreset(presets[i].options,presets[i].name) // Atualiza novamente para o contexto de quando o botão é pressionado
            setCurPreset(presets[i]) // Definindo a referência
            
            updateGenOptions(curSet.options)
        })
    }

    // Funções das predefinições:
    const CreateNewPreset = ()=>{
        let newOptions = CloneGenerationOptions(curGenOptions)                           
        let newPreset:Preset = new Preset()
        newPreset.name = newPresetName,
        newPreset.options = newOptions
        switch(type){
            case MemberType.ACOLYTE:
                PresetsData.acolyteGenerationPresets.push(newPreset);
                newOptions.presetID = PresetsData.acolyteGenerationPresets.length-1
                break
            case MemberType.COROINHA:
                PresetsData.coroinhaGenerationPresets.push(newPreset);
                newOptions.presetID = PresetsData.coroinhaGenerationPresets.length-1
        }
        PresetsData.SavePresets()
        setPresetAddOpen(false)
    }

    

    const scrollRef = useRef<ScrollView>(null)
    
    // Funções
    const SavePreset = () =>{
        presets[curPreset.options.presetID].UpdatePreset(CloneGenerationOptions(curGenOptions))
    }
    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.escala} screenName={"Nova escala"} toggleEnabled={false}/>
            
            <ScrollView style={{flex:1}} ref={scrollRef}>

                <DataSection text={"- Opções"}/>
                
                <Text style = {[textStyles.dataTitle,{padding:10}]}>- Predefinições:</Text>
                <View style={{flexDirection:"row"}}>
                    <DropDown placeholder={"Selecione: "}options={presetsOptions} actions={presetsActions}/>
                    <ImageButton imgStyle={uiStyles.buttonIcon} img={ICONS.add} press={()=>{setPresetAddOpen(true)}}/>
                    <ImageButton imgStyle={uiStyles.buttonIcon} img={ICONS.save} press={()=>{
                        SavePreset()
                        
                        if(Platform.OS == "android"){
                            ToastAndroid.show("Predefinição atualizada!",2)
                          
                        }
                        }}/>
                </View>
                
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
                <DropDown 
                    options={rolesetOptions} 
                    actions={rolesetActions} 
                    selectedTextOverride={curGenOptions.roleset.name == "default" ? "Selecione as funções:" : curGenOptions.roleset.name} 
                    offset={{x:0,y:0}}/>
                
                <DataSection text={"- Local"}/>
                <PlaceSelect selectedPlaces={curGenOptions.places}/>
                {options}

                <AdvancedOptions/>
                <RowImageButton img={GetMemberIcon()}text="Selecionar membros" press={()=>{
                    setMemberSelectOpen(true)
                }}/>
                <MemberSelectModal title={"Selecione"} 
                    returnCallback={
                        (selected)=>{
                            curGenOptions.members = selected;
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
                    BeginGeneration(curGenOptions,type,()=>{setTimeout(()=>{setIsGenerating(false)},100)})
                },10)
            }}/>
            <LoadingModal visible={isGenerating}/>

            {/* Modal para criar nova predefinição */}
            <TextInputModal 
                visible={presetAddOpen} 
                isTextValid={PresetsData.IsNameAvailable(newPresetName,presets)}

                title={"Nome"} 
                description={"Insira o nome da nova predefinição"} 
                unvalidTextMessage="Esse nome já está em uso!"
                
                onRequestClose={()=>{
                    setPresetAddOpen(false)
                }}
                submitAction={()=>{
                    CreateNewPreset()
                    setNewPresetName("")
                }}
                onChangeText={(text:string)=>{
                    setNewPresetName(text)
                }}/>
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
function BeginGeneration(generateOptions:GenerationOptionsType,type:MemberType,finished?:(...args:any)=>void){
    GenerationCache.Reset()
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
                        GenerateRandomLineup(placeOpt.roleset,type,weekendKey,curDay,curPlace):
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
    
    let members:Array<Member> = GetMemberArray(type)

    BalanceLineups(members)
    BalanceDiscarded(members)
    
    LineupScreenOptions.monthLineups = generatedLineups
    LineupScreenOptions.lineups = allLineups
    LineupScreenOptions.loaded = false

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
    const {type} = menuStore()
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
   
    let rolesets:Array<RoleSet> = []
    switch(type){
        case MemberType.ACOLYTE:
            rolesets = Roles.acolyteRoleSets; break
        case MemberType.COROINHA:
            rolesets = Roles.coroinhaRoleSets; break
    }

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
                    rolesets={rolesets} 
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
/**
 * Modal de configuração para uma configuração exclusiva.
 * 
 * @param props visible = visível; genOptionsKey = chave da opção exclusiva que está sendo editada; rolesets = todos os conjuntos de função;
 * @returns 
 */
function ExclusiveOptions(props:ExclusiveOptionsProps){
    const {curGenOptions} = contextStore()
    const [memberSelectOpen,setMemberSelectOpen] = useState(false)
    const isEditing = useRef(false) // As opções estão em processo de edição?
    const {theme} = menuStore()
    
    const daysChecks = useRef([])
    const dayExceptions = useRef([])


    const rolesetOptions = useRef([])
    const rolesetActions = useRef([])

    let key = props.genOptionsKey.weekend
        key += props.genOptionsKey.day != undefined ? props.genOptionsKey.day : Dates.defaultDays[0]
        key += props.genOptionsKey.place != undefined ? props.genOptionsKey.place : ""
    let baseOptions = curGenOptions.exclusiveOptions[key] != undefined ? curGenOptions.exclusiveOptions[key] : curGenOptions
    const options = useRef({members:baseOptions.members.slice(),places:baseOptions.places.slice(),roleset:baseOptions.roleset,randomness:baseOptions.randomness,allRandom:baseOptions.allRandom,dayExceptions:[]})
    const [roleSet,setRoleSet] = useState(props.rolesets[0]) // Estado do roleset
    const [builded,setBuilded] = useState(false)
    if(!isEditing.current){ // Se ainda não estiver editando:
        options.current = {members:baseOptions.members.slice(),places:baseOptions.places.slice(),roleset:baseOptions.roleset,allRandom:baseOptions.allRandom,randomness:baseOptions.randomness,dayExceptions:baseOptions.dayExceptions}
        isEditing.current = true
    }
    
    /**
     * Constrói os componentes da tela
     */
    const BuildComponents = ()=>{
    // Criar botões de seleção de dias
        daysChecks.current = []
        dayExceptions.current = options.current.dayExceptions != undefined ? options.current.dayExceptions : dayExceptions.current
        console.log(curGenOptions.dateset.days)
        

        for(let i = 0; i < curGenOptions.dateset.days.length; i++){
            console.log("Building "+i)
            let curDay = curGenOptions.dateset.days[i]
            console.log(curDay)
            let comp = <CheckBox checked={!dayExceptions.current.includes(curDay)} press={()=>{
                let dayIndex = dayExceptions.current.indexOf(curDay)
                if(dayIndex == -1){
                    dayExceptions.current.push(curDay)
                }
                else{
                    dayExceptions.current.splice(dayIndex,1)
                }
                
            }} topText={curDay} topTextStyle={textStyles.buttonText} key={i}/>

            console.log(comp)
            daysChecks.current.push(comp)
            console.log(daysChecks.current)
            setBuilded(true)
        }
    }
    
    // Atualiza os dados quando a chave da opção exclusiva é alterada (outras opções exclusivas são selecionadas).
    useEffect(()=>{
        console.log("Update Key")
        let key = props.genOptionsKey.weekend
        key += props.genOptionsKey.day != undefined ? props.genOptionsKey.day : Dates.defaultDays[0]
        key += props.genOptionsKey.place != undefined ? props.genOptionsKey.place : ""
    
        baseOptions = curGenOptions.exclusiveOptions[key] != undefined ? curGenOptions.exclusiveOptions[key] : curGenOptions
        if(!isEditing.current){ // Se ainda não estiver editando:
            options.current = {members:baseOptions.members.slice(),places:baseOptions.places.slice(),roleset:baseOptions.roleset,allRandom:baseOptions.allRandom,randomness:baseOptions.randomness,dayExceptions:baseOptions.dayExceptions}
            isEditing.current = true
        }
        setRoleSet(options.current.roleset)
        BuildComponents()
        console.log(daysChecks.current)
    },[props.genOptionsKey])

    // Atualiza as opções do roleset quand outro é selecionado
    useEffect(()=>{
        console.log("Roleset changed")
        UpdateRolesetOptions()
        BuildComponents()
        console.log(daysChecks.current)
    },[roleSet,props.rolesets])

    /**
     * Atualiza as informações do DropDown de funções
     */
    const UpdateRolesetOptions = ()=>{
        for(let i = 0; i < props.rolesets.length; i++){
            let curSet = props.rolesets[i]
    
            rolesetOptions.current.push(curSet.name)
            rolesetActions.current.push(()=>{
                options.current.roleset = curSet
                setRoleSet(curSet)
                UpdateRolesetOptions()
                BuildComponents()
            })
        }
    }
    /**
     * Fechar o modal.
     */
    const Close = ()=>{
        isEditing.current = false
        props.onClose()
    }

    /**
     * Confirmar nova configuração exclusiva.
     */
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
    console.log("Before return: ",daysChecks.current)
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
                        <RandomnessSelect genOptions={options.current} randomnessNames={["+Baixa","Baixa","Média","Alta","+Alta"]}/>

                        <View style={{flex:1}}>
                            <View style={{flexDirection:"row",alignItems:"center",padding:10}}>
                                <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Totalmente aleatório</Text>
                                <CheckBox checked={options.current.allRandom} press={()=>{options.current.allRandom = !options.current.allRandom}}/>
                            </View>
                        </View>

                        
                        <DataSection text={"- Conjunto de funções"}/>
                        <DropDown 
                            options={rolesetOptions.current} 
                            actions={rolesetActions.current} 
                            selectedTextOverride={roleSet.name == "default" ? "Selecione as funções:" : roleSet.name} 
                            offset={{x:0,y:0}}
                        />

                        
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
                                {daysChecks.current}
                            </View>
                            
                        </View> : null}
                        
                        <RowImageButton img={GetMemberIcon()}text="Selecionar membros" press={()=>{
                            setMemberSelectOpen(true)
                         }}/>
                        <MemberSelectModal title={"Selecione"} 
                            returnCallback={
                                (selected)=>{
                                    options.current.members = selected; 
                                    
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
/**
 * Seleção de aleatoriedade
 * @param props genOptions = Opções de geração em edição; randomnessNames = nomes das aleatoriedades.
 * @returns 
 */
function RandomnessSelect(props:RandomnessSelectProps){
    const [randomness,setRandomness] = useState(props.genOptions.randomness)
    
    let keys = Object.values(Randomness).filter(key => typeof key == "number")
    let selectors = []
    
    for(let i = 0; i < keys.length;i++){
        let level:Randomness = Number(keys[i])
        let comp =
        <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center"}} key={i}>
            <Text numberOfLines={1} style={{fontFamily:"Inter-Light",fontSize:15}}>{props.randomnessNames[i]}</Text>
            <SingleCheck img={CheckImage(randomness,level)} press={()=>{setRandomness(level),props.genOptions.randomness = level}}/>
        </View>;
        selectors.push(comp)
        
    }

    useEffect(()=>{
        setRandomness(props.genOptions.randomness)
      },[props])
    
    return(
        <View style={{flexDirection:"row",alignItems:"center",flex:0.5,alignContent:"center"}}>
            {selectors}
        </View>
    )
}

/**
 * Faz uma cópia profunda de um objeto de Opções de Geração
 * 
 * @param source Objeto fonte
 * @returns Cópia do objeto
 */
function CloneGenerationOptions(source:GenerationOptionsType){
    let newOptions:any = JSON.parse(JSON.stringify(source)) // Cópia superficial. Referências à valores mutáveis ainda são as mesmas da original.

    // Criando novas instâncias dos valores mutáveis:
    let newDateset = new DateSet()
    newDateset.days = source.dateset.days.slice()
    newDateset.weekends = source.dateset.weekends.slice()

    newOptions.dateset = newDateset

    // Criando cópia profunda de todas as configurações exclusivas:
    newOptions.exclusiveOptions = {}
    let exclusiveOptionsKeys = Object.keys(source.exclusiveOptions)
    for(let i = 0; i < exclusiveOptionsKeys.length; i++){
        let option = exclusiveOptionsKeys[i]
        newOptions.exclusiveOptions[option] = CloneExclusiveOptions(source.exclusiveOptions[option])
    }

    newOptions.members = source.members.slice()
    newOptions.randomness = source.randomness
    newOptions.monthDays = JSON.parse(JSON.stringify(source.monthDays))
    newOptions.places = source.places.slice()

    return newOptions
}
/** 
 * Faz uma cópia profunda de um objeto de Opções Exclusivas
 * 
 * @param source Objeto fonte
 * @returns Cópia do objeto
*/
function CloneExclusiveOptions(source:object) {
    let clone = JSON.parse(JSON.stringify(source)) // Cópia superficial
    
    clone["members"] = source["members"].slice()
    
    let oldRoleset = source["roleset"]
    clone["roleset"] = new RoleSet(oldRoleset.name,oldRoleset.type,oldRoleset.set.slice(),false)
    clone["dayExceptions"] = source["dayExceptions"].slice()
    clone["places"] = source["places"].slice()
    return clone
}