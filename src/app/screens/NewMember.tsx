import { View,Text} from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CheckBox, TextButton, TextInputBox, UpperBar } from "../classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { OrganizeMemberArrayAlpha } from "../classes/Methods"
import { menuStore } from "../store/store";
import { Member, MemberData, MemberType } from "../classes/MemberData";
import { Roles } from "../classes/Roles";
import { Dates } from "../classes/Dates";
import { textStyles } from "../styles/GeneralStyles";

export default function NewAcolyte(){
    const {theme, type} = menuStore()
    let currentData:Member = new Member()
    let typeName:string

    switch (type){
        case MemberType.ACOLYTE:typeName = "Acólito"; break
        case MemberType.COROINHA:typeName = "Coroinha"; break
    }
    
    currentData.disp = DefaultDispMap()


    let availabilities:Array<React.JSX.Element> = []
    for(let i = 0; i < Dates.defaultWeekends.length;i++){
        let curWeekend:string = Dates.defaultWeekends[i]
        let available:React.JSX.Element = <WeekendAvailability member={currentData} weekend={curWeekend} key={curWeekend+i}/>
        availabilities.push(available)
    }
    return(
        
        <KeyboardAwareScrollView style={{flex:1,flexDirection:"column"}}>
                
                <UpperBar icon={require("@/src/app/item_icons/add_ico.png")}screenName={"-Novo "+typeName}/>

                <TextInputBox 
                    title={"-Nome: "} 
                    enabled={true} 
                    onChangeText={(text:any)=>currentData.name=text.toString()} 
                    placeholder="Nome..."/>

                <TextInputBox 
                    title={"-Apelido: "} 
                    enabled={true} 
                    maxLength={20}
                    onChangeText={(text:any)=>currentData.nick=text.toString()} 
                    placeholder="Apelido..."/>

                <TextInputBox 
                    title={"-Responsável: "} 
                    enabled={type == MemberType.COROINHA} 
                    onChangeText={(text:any)=>currentData.parents=text.toString()}/>
                <TextInputBox 
                    title={"-Contato: "} 
                    enabled={true} 
                    keyboardType={"numeric"} 
                    onChangeText={(text:any)=>currentData.contact=text.toString()} 
                    placeholder="Contato..."/>
                
                <View style={{flex:0.1,backgroundColor:theme.secondary}}>
                    <Text style={{fontFamily:"Inther-Bold",padding:20,alignSelf:"center",fontSize:24}}>-Disponibilidade-</Text>
                </View>
                
                <View style={{paddingTop:20}}>
                    <View style={{flexDirection:"row",alignContent:"space-between",paddingLeft:90}}>
                        <Text style={{flex:1}}>Sábado - 19h</Text>
                        <Text style={{flex:1}}>Domingo - 08h</Text>
                        <Text style={{flex:1}}>Domingo - 19h</Text>
                    </View>
                    
                    <View>
                        
                    {availabilities}

                    </View>
                    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Escalável?</Text>
                        <CheckBox checked={true}press = {()=>
                            {currentData.onLineup = !currentData.onLineup}}/>
                    </View>
                </View>
                
                <TextButton textStyle={textStyles.textButtonText} buttonStyle={{alignSelf:"center"}} text={"Adicionar "+typeName} press={()=>{SubmitNewMember(currentData,type)}}/>
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

    for(let i = 0; i < Dates.defaultDays.length;i++){
        let curDay = Dates.defaultDays[i]
        let check = <CheckBox checked={props.member.disp[props.weekend][curDay]} press={()=>{props.member.disp[props.weekend][curDay] = !props.member.disp[props.weekend][curDay]}} key={props.weekend+curDay+i}/>

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