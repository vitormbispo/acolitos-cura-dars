import { View,Text} from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GetMemberAddIcon } from "../classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { OrganizeMemberArrayAlpha } from "../classes/Methods"
import { menuStore } from "../store/store";
import { MemberData, MemberType } from "../classes/MemberData";
import { Member } from "../classes/members/Member"
import { Roles } from "../classes/Roles";
import { Dates } from "../classes/Dates";
import { textStyles } from "../styles/GeneralStyles";
import { Places } from "../classes/Places";
import { GenerateMemberID, VerifyMembersIntegrity } from "../classes/DataManager";
import { useRef, useState } from "react";
import { TextButton } from "../components/buttons/TextButton";
import { CheckBox } from "../components/input/CheckBox";
import { TextCheckBox } from "../components/input/TextCheckBox";
import { UpperBar } from "../components/display/UpperBar";
import { DataSection } from "../components/display/DataSection";
import { TextInputBox } from "../components/input/TextInputBox";
import { MemberRepository } from "../classes/repository/MemberRepository";

export default function NewMember(){
    const {theme, type} = menuStore()
    const currentData = useRef(new Member())
    const availabilities = 
    <View>
        <WeekendAvailability member={currentData.current} weekend={"1º"}/>
        <WeekendAvailability member={currentData.current} weekend={"2º"}/>
        <WeekendAvailability member={currentData.current} weekend={"3º"}/>
        <WeekendAvailability member={currentData.current} weekend={"4º"}/>
        <WeekendAvailability member={currentData.current} weekend={"5º"}/>
    </View>

    let members:Array<Member> = MemberRepository.FindAllByMemberType(type)
    let typeName:string

    switch (type){
        case MemberType.ACOLYTE:
            typeName = "Acólito"
            break
        case MemberType.COROINHA:
            typeName = "Coroinha"
            break
    }

    const [nameAvailable,setNameAvailable] = useState(true) // Estado apenas para avisos de nome indisponível
    const [nickAvailable,setNickAvailable] = useState(true) //
    return(
        
        <KeyboardAwareScrollView style={{flex:1,flexDirection:"column",backgroundColor:theme.backgroundColor}}>
                
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
                onChangeText={(text:any)=>currentData.current.setName(text.toString())} 
                placeholder="Nome..."
                onBlur={()=>{
                    //setNameAvailable(MemberData.IsNameAvailable(currentData.current.getName(),members))
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
                onChangeText={(text:any)=>currentData.current.setNick(text.toString())} 
                placeholder="Apelido..."
                onBlur={()=>{
                    //setNickAvailable(MemberData.IsNickAvailable(currentData.current.nick,members))
                }}/>

            <TextInputBox 
                title={"-Responsável: "} 
                enabled={type == MemberType.COROINHA} 
                onChangeText={(text:any)=>currentData.current.setParents(text.toString())}
                placeholder="Responsável..."/>
            <TextInputBox 
                title={"-Contato: "} 
                enabled={true} 
                keyboardType={"numeric"} 
                onChangeText={(text:any)=>currentData.current.setContact(text.toString())} 
                placeholder="Contato..."/>
            
            <DataSection text={"- Disponibilidade -"} centered={true}/>

            <Text style={textStyles.dataTitle}>- Local</Text>
            <PlaceAvailability member={currentData.current}/>
            
            <Text style={textStyles.dataTitle}>- Dias e Horários:</Text>

            <View style={{paddingTop:40}}>
                <View style={{marginTop:30}}>
                    
                    {availabilities}

                </View>
                
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Disponível: </Text>
                    <CheckBox checked={true}press = {()=>
                        {/*currentData.current.onLineup = !currentData.current.onLineup*/}}/>
                </View>
            </View>
            
            <TextButton textStyle={textStyles.textButtonText} buttonStyle={{alignSelf:"center"}} text={"Adicionar "+typeName} press={()=>{SubmitNewMember(currentData.current,type)}} disabled={!(nameAvailable && nickAvailable)}/>
        </KeyboardAwareScrollView>
    )
}

function SubmitNewMember(member:Member,type:MemberType){
    let members:Array<any>
    let storageData:string

    MemberRepository.InsertMember(member)

    /*
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

    member.id = GenerateMemberID()
    VerifyMembersIntegrity([member]) // Deefine valores padrão
    members.push(member)
    members = OrganizeMemberArrayAlpha(members)
    AsyncStorage.setItem(storageData,JSON.stringify(members))

    if(type == MemberType.ACOLYTE){
        MemberData.allAcolytes = members
    }
    else if (type == MemberType.COROINHA){
        MemberData.allCoroinhas = members
    }
    */
    router.back()
}

type WeekendAvailabilityProps = {
    member:Member,
    weekend:string
}


export function WeekendAvailability(props:WeekendAvailabilityProps){
    let checks = []
    let isFirstWeekend = Dates.defaultWeekends[0] == props.weekend
    const availability = props.member.availability.dayAvailability.getMap()
    for(let i = 0; i < Dates.defaultDays.length;i++){
        let curDay = Dates.defaultDays[i]
        
        let check = 
            <CheckBox 
                checked={availability[props.weekend][curDay]} 
                press={()=>{
                    availability[props.weekend][curDay] = !availability[props.weekend][curDay]
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

type PlaceAvailabilityProps = {
    member:Member
}

export function PlaceAvailability(props:PlaceAvailabilityProps){
    let checks:Array<React.JSX.Element> = []
    const availability = props.member.availability.placeAvailability
    for(let i = 0; i < Places.allPlaces.length; i++){
        let curPlace = Places.allPlaces[i]
        let check = <TextCheckBox checked={availability.isAvailable(curPlace)} text={curPlace} key={i} press={()=>{
            availability.setAvailable(curPlace,!availability.isAvailable(curPlace))
        }}/>
        checks.push(check)
    }

    return(
        <View style={{flexDirection:"row",alignItems:"center",flex:1,flexWrap:"wrap",gap:10,padding:10}}>
            {checks}
        </View>
    )
}
