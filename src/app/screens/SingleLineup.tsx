import { View,Image,Text, ScrollView, Role } from "react-native"
import { Global } from "../Global"
import { CheckBox, LinkRowImageButton, RowImageButton, SingleCheck, SingleCheckColor, TextButton, UpperBar } from "../classes/NewComps"
import { Lineup, LineupType } from "../classes/Lineup"
import { GenerateLineup, GenerateRandomLineup } from "../classes/FlexLineupGenerator"
import { router } from "expo-router"
import { useRef, useState } from "react"
import { LineupScreenOptions } from "./LineupScreen"
import { contextStore, menuStore } from "../store/store"
import { Member, MemberData, MemberType } from "../classes/MemberData"
import { Roles, RoleSet } from "../classes/Roles"
import { textStyles } from "../styles/GeneralStyles"
import { ResetAllLastWeekend } from "../classes/Methods"
import { ICONS } from "../classes/AssetManager"
import { Dates, DateSet } from "../classes/Dates"
import { useShallow } from 'zustand/react/shallow'

// TODO: Usar useRef para não reiniciar o valor do generationOptions e por fim compactar essa merda toda
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
    "dateset":DateSet
}

enum Randomness{
    LOW = 1,
    MEDIUM_LOW = 1.3,
    MEDIUM = 1.6,
    MEDIUM_HIGH = 1.7,
    HIGH = 2
}

export default function LineupOptions(){    
    const {lineupType,curGenOptions} = contextStore()
    let options:React.JSX.Element

    switch (lineupType){
        case LineupType.SINGLE:
            options = <SingleLineupOptions/>; break
        case LineupType.WEEKEND:
            options = <WeekendLineupOptions/>; break
        case LineupType.MONTH:
            options = <MonthLineupOptions/>; break
    }

    return(
        <View style={{flex:1}}>
            <UpperBar icon={require("@/src/app/item_icons/escala_icomdpi.png")} screenName={"Nova escala única"} toggleEnabled={false}/>
            
            <ScrollView style={{flex:1}}>

                <View style={{height:80,backgroundColor:"#9BFFF9"}}>
                    <Text style={textStyles.dataSection}>-Opções</Text>
                </View>
                
                {/* < Opções de aleatoriedade > */}
                <Text style = {[textStyles.dataText,{padding:10}]}>Aleatoriedade</Text>
                <View style={{flexDirection:"row",alignItems:"center",flex:0.5,alignContent:"center"}}>
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center"}}>
                        <Text numberOfLines={1} style={{fontFamily:"Inter-Light",fontSize:15}}>+ Baixa</Text>
                        <SingleCheck img={CheckImage(curGenOptions.randomness,Randomness.LOW)} checked={curGenOptions.randomness == Randomness.LOW} press={()=>{curGenOptions.randomness = Randomness.LOW}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>Baixa</Text>
                        <SingleCheck img={CheckImage(curGenOptions.randomness,Randomness.MEDIUM_LOW)} checked={curGenOptions.randomness == Randomness.MEDIUM_LOW} press={()=>{curGenOptions.randomness = Randomness.MEDIUM_LOW}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>Normal</Text>
                        <SingleCheck img={CheckImage(curGenOptions.randomness,Randomness.MEDIUM)} checked={curGenOptions.randomness == Randomness.MEDIUM} press={()=>{curGenOptions.randomness = Randomness.MEDIUM}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>Alta</Text>
                        <SingleCheck img={CheckImage(curGenOptions.randomness,Randomness.MEDIUM_HIGH)} checked={curGenOptions.randomness == Randomness.MEDIUM_HIGH} press={()=>{curGenOptions.randomness = Randomness.MEDIUM_HIGH}}/>
                    </View>
                    
                    <View style={{flex:(1/5), padding:10, alignSelf:"center",alignContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:15}}>+ Alta</Text>
                        <SingleCheck img={CheckImage(curGenOptions.randomness,Randomness.HIGH)} checked={curGenOptions.randomness == Randomness.HIGH} press={()=>{curGenOptions.randomness = Randomness.HIGH}}/>
                    </View>
                </View>
                {/* </ Opções de aleatoriedade > */}
                
                <View style={{flex:1}}>
                    <View style={{flexDirection:"row",alignItems:"center",padding:10}}>
                        <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Totalmente aleatório</Text>
                        <CheckBox checked={false} press={()=>{curGenOptions.allRandom = !curGenOptions.allRandom}}/>
                    </View>
                </View>
            
            {options}
            </ScrollView>
        </View>
        )
    }
    

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
 * @param props generationOptions = Opções de geração
 * @returns 
 */
const SingleLineupOptions = (props) => {
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))

    const {type} = menuStore()
    return(
        <View style={{flex:1}}>
                
            <View style={{height:80,backgroundColor:"#9BFFF9"}}>
                <Text style={Global.textStyles.dataSection}>-Opções</Text>
            </View>
            
            <WeekendSelection set={new DateSet()} single={true}/>
            <SingleDaySelection/>

            <TextButton text="Gerar escala" press={()=>{GerarEscala(generationOptions,type)}} buttonStyle={{alignSelf:"center"}}/>
        </View>
    )
}

const WeekendLineupOptions = () => {
    const {type} = menuStore()
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))

    return(
        <View style={{flex:1}}>
            <View style={{height:80,backgroundColor:"#9BFFF9"}}>
                <Text style={Global.textStyles.dataSection}>-Opções</Text>
            </View>
            
            <WeekendSelection set={new DateSet()}/>

            <View style={{flexDirection:"row",alignItems:"center"}}>
                <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Horário</Text>
                <DaySelection/>
            </View>


            <TextButton text="Gerar escala" press={()=>{GerarEscala(generationOptions,type)}}/>
        </View>

    )
}


const MonthLineupOptions = (props:any) => {
    
    const {type} = menuStore()
    
    const generationOptions = contextStore(useShallow((state)=>state.curGenOptions))
    return(
        <View style={{flex:1}}>
            
                <View style={{paddingTop:20}}>
                    <View style={{flexDirection:"row",alignContent:"space-between",paddingLeft:100}}>
                        <Text style={{flex:1}}>Sábado - 19h</Text>
                        <Text style={{flex:1}}>Domingo - 08h</Text>
                        <Text style={{flex:1}}>Domingo - 19h</Text>
                    </View>
                    
                    <MonthDaySelection/>
                </View>

                <TextButton text="Gerar escala" press={()=>{GerarEscala(generationOptions,type)}}/>
        </View>
    )
}


function GerarEscala(generateOptions:GenerationOptionsType,type:MemberType){

    // Definir funções se for solenidade ou não
    let roles = []
    let roleset:RoleSet

    switch(type){
        case MemberType.ACOLYTE:
            if(generateOptions.solemnity){
                roles = Roles.GetRoleSet("default",MemberType.ACOLYTE).set
                roleset = Roles.GetRoleSet("default",MemberType.ACOLYTE)              
            }
            else{
                roles = Roles.GetRoleSet("minimal",MemberType.ACOLYTE).set
                roleset = Roles.GetRoleSet("minimal",MemberType.ACOLYTE)
            }
            break
        case MemberType.COROINHA:
            if(generateOptions.solemnity){
                roles = Roles.GetRoleSet("default",MemberType.COROINHA).set
                roleset = Roles.GetRoleSet("default",MemberType.COROINHA)              
            }
            else{
                roles = Roles.GetRoleSet("minimal",MemberType.COROINHA).set
                roleset = Roles.GetRoleSet("minimal",MemberType.COROINHA)
            }
            break
    }

    LineupScreenOptions.roles = roles
    LineupScreenOptions.lineups = []

    let generatedLineups:object = {}
    let allLineups:Array<Lineup> = []

    LineupScreenOptions.lineups = []
    LineupScreenOptions.days = generateOptions.dateset.days
    LineupScreenOptions.daysNames = generateOptions.dateset.days
            
    let weekends = generateOptions.dateset.weekends

    for(let i = 0; i < weekends.length;i++){
        let weekendKey = weekends[i] // Finais de semana
        let curWeekend = generateOptions.monthDays[weekendKey] // Dias no fim de semana
        
        generatedLineups[weekendKey] = new Array<Lineup>
        
        if(curWeekend != undefined){
            for(let k = 0; k < curWeekend.length;k++){
                let curDay:string = curWeekend[k]
                
                let newLineup = generateOptions.allRandom ?
                    GenerateRandomLineup(roleset,type,weekendKey,curDay):
                    GenerateLineup(weekendKey,curDay,roleset,type,generateOptions.randomness,generateOptions.dayRotation)
                generatedLineups[weekendKey].push(newLineup)
                allLineups.push(newLineup)
            }
        }

        if(generatedLineups[weekendKey].length == 0){
            delete generatedLineups[weekendKey]
        }
        
    }

    LineupScreenOptions.lineupType = "Single"
    LineupScreenOptions.monthLineups = generatedLineups
    LineupScreenOptions.lineups = allLineups
    LineupScreenOptions.loaded = false

    if(!generateOptions.allRandom){
        switch(type){
            case MemberType.ACOLYTE:
                ResetAllLastWeekend(MemberData.allAcolytes); break
            case MemberType.COROINHA:
                ResetAllLastWeekend(MemberData.allCoroinhas); break
        }
    }

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
            let check = <CheckBox checked={generationOptions.monthDays[curWeekend].indexOf(curDay)!=-1} press={()=>{ToggleDay(curWeekend,curDay,generationOptions)}} key={curWeekend+curDay+j}/>

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
                }
                let tempDays:Array<string> = generationOptions.monthDays[week] // Armazenar temporariamente os dias de outro fim de semana
                generationOptions.monthDays = {}
                generationOptions.monthDays[week] = tempDays
                updateWeekend(week)

            }} key={week+i}/>
        )
    }

    return(
        <View style={{flex:1, flexDirection:'row'}}>
            {checks}
        </View>
    )
}