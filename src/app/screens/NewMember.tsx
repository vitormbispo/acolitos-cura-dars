import { View,Text} from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GetMemberAddIcon } from "../../classes/NewComps";
import { router } from "expo-router";
import { menuStore } from "../../store/store";
import { MemberData } from "../../classes/members/MemberData";
import { Member } from "../../classes/members/Member"
import { Dates } from "../../classes/dates/Dates";
import { textStyles } from "../../styles/GeneralStyles";
import { Places } from "../../classes/Places";
import { useRef, useState } from "react";
import { TextButton } from "../../components/buttons/TextButton";
import { CheckBox } from "../../components/input/CheckBox";
import { TextCheckBox } from "../../components/input/TextCheckBox";
import { UpperBar } from "../../components/display/UpperBar";
import { DataSection } from "../../components/display/DataSection";
import { TextInputBox } from "../../components/input/TextInputBox";
import { MemberType } from "../../classes/members/MemberType";

export default function NewMember(){
    const {theme, type} = menuStore()
    const currentData = useRef(new Member(type))
    const availabilities = 
    <View>
        <WeekendAvailability member={currentData.current} weekend={"1º"}/>
        <WeekendAvailability member={currentData.current} weekend={"2º"}/>
        <WeekendAvailability member={currentData.current} weekend={"3º"}/>
        <WeekendAvailability member={currentData.current} weekend={"4º"}/>
        <WeekendAvailability member={currentData.current} weekend={"5º"}/>
    </View>

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
                onChangeText={(text:any)=>currentData.current.name = text.toString()} 
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
                onChangeText={(text:any)=>currentData.current.nick = text.toString()} 
                placeholder="Apelido..."
                onBlur={()=>{
                    //setNickAvailable(MemberData.IsNickAvailable(currentData.current.nick,members))
                }}/>

            <TextInputBox 
                title={"-Responsável: "} 
                enabled={type == MemberType.COROINHA} 
                onChangeText={(text:any)=>currentData.current.parents = text.toString()}
                placeholder="Responsável..."/>
            <TextInputBox 
                title={"-Contato: "} 
                enabled={true} 
                keyboardType={"numeric"} 
                onChangeText={(text:any)=>currentData.current.contact = text.toString()} 
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
            
            <TextButton textStyle={textStyles.textButtonText} buttonStyle={{alignSelf:"center"}} text={"Adicionar "+typeName} press={()=>{SubmitNewMember(currentData.current)}} disabled={!(nameAvailable && nickAvailable)}/>
        </KeyboardAwareScrollView>
    )
}

function SubmitNewMember(member:Member){
    MemberData.AddNewMember(member,true)
    router.back()
}

type WeekendAvailabilityProps = {
    member:Member,
    weekend:string
}


export function WeekendAvailability(props:WeekendAvailabilityProps){
    let checks = []
    let isFirstWeekend = Dates.DEFAULT_WEEKENDS[0] == props.weekend
    const availability = props.member.availability.dayAvailability
    for(let i = 0; i < Dates.DEFAULT_DAYS.length;i++){
        let curDay = Dates.DEFAULT_DAYS[i]
        
        let check = 
            <CheckBox 
                checked={availability.isAvailable(props.weekend,curDay)} 
                press={()=>{
                    availability.setAvailable(props.weekend,curDay,!availability.isAvailable(props.weekend,curDay))
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
