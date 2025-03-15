import { View,Text, ScrollView } from "react-native"
import { GetMemberIcon, UpperBar, VisualCheckBox, UpperButton, DataDisplay, TextVisualCheckBox, ExpandableView, ImageButton } from "../classes/NewComps"
import { contextStore, menuStore } from "../store/store"
import { Member, MemberData, MemberType } from "../classes/MemberData"
import { textStyles, uiStyles} from "../styles/GeneralStyles"
import { Dates } from "../classes/Dates"
import { ICONS } from "../classes/AssetManager"
import { Places } from "../classes/Places"
import { Roles } from "../classes/Roles"
import { useEffect, useRef, useState } from "react"
import { SaveAcolyteData, SaveCoroinhaData } from "../classes/Methods"

export default function MemberProfile() {
    const {type,name,theme} = menuStore()
    const {memberID} = contextStore()
    
    let members:Array<Member>
    let defaultRoles:Array<string> = []

    switch (type){
        case MemberType.ACOLYTE:
            members = MemberData.allAcolytes
            defaultRoles = Object.keys(Roles.defaultAcolyteRoles)
            break
        case MemberType.COROINHA:
            members = MemberData.allCoroinhas 
            defaultRoles = Object.keys(Roles.defaultCoroinhaRoles)
            break
    }
    
    let curMember:Member = members[memberID]
    
    const parents =  type == MemberType.COROINHA? 
                    <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                        <Text style={textStyles.dataTitle}>Responsável: </Text>
                        <Text style={textStyles.dataText}>{curMember.parents}</Text>
                    </View> : null
    

    const rodizio = []
    const [rodizioAlt,setRodizioAlt] = useState([])
    
    Object.keys(curMember.rodizio).forEach((role) => {
        let display = <DataDisplay dataTitle={role} data={curMember.rodizio[role]} key={role}/>
        if(defaultRoles.includes(role)){
            rodizio.push(display)
        }
        else{
            let altDisplay = 
            <View style={{flexDirection:"row"}} key={role}>
                {display}
                <ImageButton img={ICONS.delete} imgStyle={uiStyles.buttonIconSmall} press={()=>{
                    delete curMember.rodizio[role]
                    switch(type){
                        case MemberType.ACOLYTE:
                            SaveAcolyteData()
                        case MemberType.COROINHA:
                            SaveCoroinhaData()
                    }
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
        <View style={{flex:1}}>
            <View style={{flexDirection:'row'}}>
                <UpperBar icon={GetMemberIcon()} screenName={curMember.nick}/>
                <UpperButton img={ICONS.edit} link={"/screens/EditMember"} backgroundColor={theme.accentColor}/>
            </View>
            

            <ScrollView style={{flex:1}} ref={scrollRef}>
                <View style={{flex:1,backgroundColor:theme.secondary,height:80}}>
                    <Text style={textStyles.dataSection}>-Dados Pessoais-</Text>
                </View>
                
                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={textStyles.dataTitle}>Nome: </Text>
                    <Text style={textStyles.dataText}>{curMember.name}</Text>
                </View>
                
                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={textStyles.dataTitle}>Apelido: </Text>
                    <Text style={textStyles.dataText}>{curMember.nick}</Text>
                </View>

                {parents}

                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={textStyles.dataTitle}>Contato: </Text>
                    <Text style={textStyles.dataText}>{curMember.contact}</Text>
                </View>

                <View style={{flex:0.1,backgroundColor:theme.secondary,height:80}}>
                    <Text style={[textStyles.dataSection,{backgroundColor:theme.secondary}]}>-Disponibilidade-</Text>
                </View>
                <Text style={textStyles.dataTitle}>- Local:</Text>
                <VisualPlaceAvailability member={curMember}/>

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
                        <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Disponível: </Text>
                        <VisualCheckBox enabled={curMember.onLineup}/>
                    </View>
                 </View>

                 <View style={{flex:0.1,backgroundColor:theme.secondary,height:80}}>
                    <Text style={textStyles.dataSection}>-Rodízio-</Text>
                 </View>

                <View style={{padding:10,flexDirection:"row"}}>
                    <Text style={{fontFamily:"Inter-Bold",fontSize:20,alignSelf:"center"}}>Geral: </Text>
                    <Text style={{fontFamily:"Inter-Regular",fontSize:20,alignSelf:"center"}}>{curMember.priority}</Text>
                </View>

                <View style={{flex:1}}>
                    {rodizio}
                    
                    {rodizioAlt.length > 0 ? 
                    <ExpandableView expanded={false} title={"Outras funções:"} content={
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

    for(let i = 0; i < Dates.defaultDays.length;i++){
        let curDay = Dates.defaultDays[i]
        let check = <VisualCheckBox enabled={props.member.disp[props.weekend][curDay]} key={props.weekend+curDay+i}/>

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
        let check = <TextVisualCheckBox enabled={props.member.placeDisp[curPlace]} text={curPlace}key={i}/>
        checks.push(check)
    }

    return(
        <View style={{flexDirection:"row",alignItems:"center",flex:1,flexWrap:"wrap",gap:10,padding:10}}>
            {checks}
        </View>
    )
}