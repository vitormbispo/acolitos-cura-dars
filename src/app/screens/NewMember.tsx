import { View,Text} from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CheckBox, DataSection, GetMemberAddIcon, TextButton, TextCheckBox, TextInputBox, UpperBar } from "../classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { OrganizeMemberArrayAlpha } from "../classes/Methods"
import { menuStore } from "../store/store";
import { Member, MemberData, MemberType } from "../classes/MemberData";
import { Roles } from "../classes/Roles";
import { Dates } from "../classes/Dates";
import { textStyles } from "../styles/GeneralStyles";
import { Places } from "../classes/Places";
import { VerifyMembersIntegrity } from "../classes/DataManager";
import { useState } from "react";

export default function NewMember(){
    const {theme, type} = menuStore()
    let currentData:Member = new Member()
    let members:Array<Member> = []
    let typeName:string

    switch (type){
        case MemberType.ACOLYTE:
            typeName = "Acólito"
            members = MemberData.allAcolytes
            break
        case MemberType.COROINHA:
            typeName = "Coroinha"
            members = MemberData.allCoroinhas
            break
    }
    
    currentData.disp = DefaultDispMap()
    currentData.placeDisp = Places.PlacesDispMap()
    currentData.placeRotation = Places.PlacesRotationMap()

    let availabilities:Array<React.JSX.Element> = []
    for(let i = 0; i < Dates.defaultWeekends.length;i++){
        let curWeekend:string = Dates.defaultWeekends[i]
        let available:React.JSX.Element = <WeekendAvailability member={currentData} weekend={curWeekend} key={curWeekend+i}/>
        availabilities.push(available)
    }

    const [nameAvailable,setNameAvailable] = useState(true) // Estado apenas para avisos de nome indisponível
    const [nickAvailable,setNickAvailable] = useState(true) //
    return(
        
        <KeyboardAwareScrollView style={{flex:1,flexDirection:"column"}}>
                
            <UpperBar icon={GetMemberAddIcon()}screenName={"Novo "+typeName}/>

            <DataSection text={"-Dados pessoais-"} centered={true}/>
            
            {!nameAvailable ? 
                <Text style={
                    [textStyles.dataTitle,{color:theme.reject}]}>Já existe um {typeName.toLocaleLowerCase()} com esse nome!</Text>
                    :
                    null
            }
            <TextInputBox 
                title={"-Nome: "} 
                enabled={true} 
                onChangeText={(text:any)=>currentData.name=text.toString()} 
                placeholder="Nome..."
                onBlur={()=>{
                    setNameAvailable(MemberData.IsNameAvailable(currentData.name,members))
                }}/>

            {!nickAvailable ? 
                <Text style={
                    [textStyles.dataTitle,{color:theme.reject}]}>Já existe um {typeName.toLocaleLowerCase()} com esse apelido!</Text>
                    :
                    null
            }
            <TextInputBox 
                title={"-Apelido: "} 
                enabled={true} 
                maxLength={20}
                onChangeText={(text:any)=>currentData.nick=text.toString()} 
                placeholder="Apelido..."
                onBlur={()=>{
                    setNickAvailable(MemberData.IsNickAvailable(currentData.nick,members))
                }}/>

            <TextInputBox 
                title={"-Responsável: "} 
                enabled={type == MemberType.COROINHA} 
                onChangeText={(text:any)=>currentData.parents=text.toString()}
                placeholder="Responsável..."/>
            <TextInputBox 
                title={"-Contato: "} 
                enabled={true} 
                keyboardType={"numeric"} 
                onChangeText={(text:any)=>currentData.contact=text.toString()} 
                placeholder="Contato..."/>
            
            <DataSection text={"- Disponibilidade -"} centered={true}/>

            <Text style={textStyles.dataTitle}>- Local</Text>
            <PlaceAvailability member={currentData}/>

            <View style={{paddingTop:20}}>
                <View style={{marginTop:30}}>
                    
                    {availabilities}

                </View>
                
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Disponível: </Text>
                    <CheckBox checked={true}press = {()=>
                        {currentData.onLineup = !currentData.onLineup}}/>
                </View>
            </View>
            
            <TextButton textStyle={textStyles.textButtonText} buttonStyle={{alignSelf:"center"}} text={"Adicionar "+typeName} press={()=>{SubmitNewMember(currentData,type)}} disabled={!(nameAvailable && nickAvailable)}/>
        </KeyboardAwareScrollView>
    )
}

function SubmitNewMember(member:any,type:MemberType){
    let members:Array<any>
    let storageData:string

    if(type == MemberType.ACOLYTE){
        member.rodizio = Roles.defaultAcolyteRoles
        member.oldRodizio = Roles.defaultAcolyteRoles

        members = MemberData.allAcolytes
        storageData = "AcolyteData"
    }
    else if (type == MemberType.COROINHA){
        member.rodizio = Roles.defaultCoroinhaRoles
        member.oldRodizio = Roles.defaultCoroinhaRoles

        members = MemberData.allCoroinhas
        storageData = "CoroinhaData"
    }
    if(members == null){
        members = []
    }

    VerifyMembersIntegrity([member])
    members.push(member)
    members = OrganizeMemberArrayAlpha(members)
    AsyncStorage.setItem(storageData,JSON.stringify(members))

    if(type == MemberType.ACOLYTE){
        MemberData.allAcolytes = members
    }
    else if (type == MemberType.COROINHA){
        MemberData.allCoroinhas = members
    }

    router.back()
}

type WeekendAvailabilityProps = {
    member:Member,
    weekend:string
}
export function WeekendAvailability(props:WeekendAvailabilityProps){
    let checks = []
    let isFirstWeekend = Dates.defaultWeekends[0] == props.weekend
    
    for(let i = 0; i < Dates.defaultDays.length;i++){
        let curDay = Dates.defaultDays[i]
        
        let check = 
            <CheckBox 
                checked={props.member.disp[props.weekend][curDay]} 
                press={()=>{
                    props.member.disp[props.weekend][curDay] = !props.member.disp[props.weekend][curDay]
                }} 
                key={props.weekend+curDay+i}
                topText={isFirstWeekend ? curDay:null}/>
        
        checks.push(check)
    }
    return(
        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
            <Text style={{padding:10,flex:1}}>{props.weekend}</Text>
            {checks}
        </View>
    )
}

export function DefaultDispMap(){
    let map = {}

    Dates.defaultWeekends.forEach((weekend)=>{
        map[weekend] = {}
        Dates.defaultDays.forEach((days)=>{
            map[weekend][days] = true
        })
    })

    return map
}

export function DefaultDayPriorityMap(){
    let map = {}
    
    Dates.defaultWeekends.forEach((weekend)=>{
        map[weekend] = 0
    })
}

type PlaceAvailabilityProps = {
    member:Member
}

export function PlaceAvailability(props:PlaceAvailabilityProps){
    let checks:Array<React.JSX.Element> = []
    for(let i = 0; i < Places.allPlaces.length; i++){
        let curPlace = Places.allPlaces[i]
        let check = <TextCheckBox checked={props.member.placeDisp[curPlace]} text={curPlace} key={i} press={()=>{
            props.member.placeDisp[curPlace] = !props.member.placeDisp[curPlace]
        }}/>
        checks.push(check)
    }

    return(
        <View style={{flexDirection:"row",alignItems:"center",flex:1,flexWrap:"wrap",gap:10,padding:10}}>
            {checks}
        </View>
    )
}