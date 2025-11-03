import { View,Text, ScrollView } from "react-native"
import { GetMemberIcon } from "../classes/NewComps"
import { contextStore, menuStore } from "../store/store"
import { MemberData } from "../classes/MemberData"
import { textStyles, uiStyles} from "../styles/GeneralStyles"
import { Dates } from "../classes/Dates"
import { ICONS } from "../classes/AssetManager"
import { Places } from "../classes/Places"
import { useRef, useState } from "react"
import { ImageButton } from "../components/buttons/ImageButton"
import { VisualCheckBox } from "../components/input/VisualCheckBox"
import { TextVisualCheckBox } from "../components/input/TextVisualCheckBox"
import { UpperBar } from "../components/display/UpperBar"
import { UpperButton } from "../components/buttons/UpperButton"
import { DataDisplay } from "../components/display/DataDisplay"
import { DataSection } from "../components/display/DataSection"
import { ExpandableView } from "../components/frames/ExpandableView"
import { Member } from "../classes/members/Member"
import { MemberType } from "../classes/members/MemberType"

export default function MemberProfile() {
    const {type,name,theme} = menuStore()
    const {memberID} = contextStore()
    
    //let members:Array<Member> = MemberRepository.FindAllByMemberType(type)
    let defaultRoles:Array<string> = []
    
    let curMember:Member = MemberData.FindMemberById(memberID)
    
    const parents =  type == MemberType.COROINHA? 
    <DataDisplay dataTitle={"- Responsável: "} data={curMember.parents} titleStyle={textStyles.dataTitle} dataStyle={textStyles.dataText}/> : null
    

    const rodizio = []
    const [rodizioAlt,setRodizioAlt] = useState([])
    
    const roleRotation = curMember.rotation.roleRotation
    const roleMap = roleRotation.getMap()

    Object.keys(roleMap).forEach((role) => {
        let display = <DataDisplay dataTitle={role} data={roleMap[role]} key={role}/>
        
        if(defaultRoles.includes(role)){
            rodizio.push(display)
        }
        else{
            let altDisplay = 
            <View style={{flexDirection:"row"}} key={role}>
                {display}
                <ImageButton img={ICONS.delete} imgStyle={uiStyles.buttonIconSmall} press={()=>{
                    curMember.rotation.roleRotation.removeKey(role)
                    setRodizioAlt([]) // Causa um rerender
                    }}/>
            </View>
            rodizioAlt.push(altDisplay)
        }
    })
    
    let availabilities:Array<React.JSX.Element> = []
    for(let i = 0; i < Dates.defaultWeekends.length;i++){
        let curWeekend:string = Dates.defaultWeekends[i]
        let available:React.JSX.Element = <VisualWeekendAvailability member={curMember} weekend={curWeekend} key={curWeekend+i}/>
        availabilities.push(available)
    }

    const scrollRef = useRef<ScrollView>(null)
    const [scrollPos,setScrollPos] = useState(0)
    const handleScroll = (event:any) =>{
        setScrollPos(event.nativeEvent.contentOffset.y)
    }
    return(
        <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
            <View style={{flexDirection:'row'}}>
                <UpperBar icon={GetMemberIcon()} screenName={curMember.nick}/>
                <UpperButton img={ICONS.edit} link={"/screens/EditMember"} backgroundColor={theme.accentColor}/>
            </View>
            

            <ScrollView style={{flex:1}} ref={scrollRef}>
                <DataSection text={"- Dados pessoais -"} centered={true}/>
                
                <DataDisplay dataTitle={"- Nome: "} data={curMember.name} titleStyle={textStyles.dataTitle} dataStyle={textStyles.dataText}/>
                <DataDisplay dataTitle={"- Apelido: "} data={curMember.nick} titleStyle={textStyles.dataTitle} dataStyle={textStyles.dataText}/>

                {parents}

                <DataDisplay dataTitle={"- Contato: "} data={curMember.contact} titleStyle={textStyles.dataTitle} dataStyle={textStyles.dataText}/>

                <DataSection text={"- Disponibilidade -"} centered={true}/>
                <Text style={textStyles.dataTitle}>- Local:</Text>
                <VisualPlaceAvailability member={curMember}/>

                <Text style={textStyles.dataTitle}>- Dias e Horários:</Text>
                <View style={{paddingTop:40}}>
                    <View>
                        {availabilities}
                    </View>
                        
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Disponível: </Text>
                        <VisualCheckBox enabled={curMember.availability.isAvailable()}/>
                    </View>
                 </View>

                <DataSection text={"- Rodízio -"} centered={true}/>
                <DataDisplay dataTitle={"Geral: "} data={curMember.genOptions.priority.toString()}
                             titleStyle={{fontFamily:"Inter-Bold",fontSize:30,alignSelf:"center"}}
                             dataStyle={{fontFamily:"Inter-Regular",fontSize:20,alignSelf:"center"}}/>
                
                <View style={{flex:1}}>
                    {rodizio}
                    
                    {rodizioAlt.length > 0 ? 
                    <ExpandableView color={theme.neutral} expanded={false} title={"Outras funções:"} content={
                        <View>
                            {rodizioAlt}
                        </View>}
                        action={()=>{scrollRef.current.scrollToEnd({animated:true})}}>
                    </ExpandableView> : null}
                </View>
                

            </ScrollView>
        </View>
    )
}

type VisualWeekendAvailabilityProps = {
    member:Member,
    weekend:string
}

export function VisualWeekendAvailability(props:VisualWeekendAvailabilityProps){
    let checks = []
    let isFirstWeekend = Dates.defaultWeekends[0] == props.weekend

    for(let i = 0; i < Dates.defaultDays.length;i++){
        let curDay = Dates.defaultDays[i]
        let check = 
        <VisualCheckBox 
            enabled={props.member.availability.dayAvailability.isAvailable(props.weekend,curDay)} 
            key={props.weekend+curDay+i}
            topText={isFirstWeekend ? curDay : null}
        
        />

        checks.push(check)
    }
    return(
        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
            <Text style={{padding:10,flex:1}}>{props.weekend}</Text>
            {checks}
        </View>
    )
}

type VisualPlaceAvailabilityProps = {
    member:Member
}
export function VisualPlaceAvailability(props:VisualPlaceAvailabilityProps){
    let checks:Array<React.JSX.Element> = []
    for(let i = 0; i < Places.allPlaces.length; i++){
        let curPlace = Places.allPlaces[i]
        let check = <TextVisualCheckBox enabled={props.member.availability.placeAvailability.isAvailable(curPlace)} text={curPlace}key={i}/>
        checks.push(check)
    }

    return(
        <View style={{flexDirection:"row",alignItems:"center",flex:1,flexWrap:"wrap",gap:10,padding:10}}>
            {checks}
        </View>
    )
}