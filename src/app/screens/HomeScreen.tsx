import { View, Text, Touchable, Pressable} from "react-native";
import { CompactLineup, DropDown, ExpandableView, GetMemberIcon, ImageTextButton, LinkRowImageButton, TextButton, TextPosition, UpperBar } from "../classes/NewComps";
import { uiStyles} from "../styles/GeneralStyles";
import { contextStore, menuStore} from "@/src/app/store/store";
import { ICONS } from "../classes/AssetManager";
import { Member, MemberData } from "../classes/MemberData";
import { ConvertDataToClasses } from "../classes/DataManager";
import { Lineup, StructuredLineup } from "../classes/Lineup";
import Rive from "rive-react-native";
import { Places } from "../classes/Places";
import { useRef, useState } from "react";
// Tela
export default function Home(){
    const {name,theme} = menuStore()
    console.log("Acolitos: "+MemberData.allAcolytes)
    console.log(MemberData.allAcolytes)
    console.log(Places.allPlaces)
    return(
        <View style = {{flex:1,backgroundColor:theme.backgroundColor}}>
            <UpperBar screenName={"Tela inicial | "+name} icon={ICONS.home} toggleEnabled={true} hideGoBack={true}/>
            <AppBody/>
            
            <LowerBar/> 
        </View>
        
    )
}

// Corpo da tela
export function AppBody(){
    const {appStarted} = contextStore()
    const [isShown,setIsShown] = useState(false)

    const riveRef = useRef(null)
    const toggleShown = () =>{
        riveRef.current?.setInputState('State Machine 1','isShown',!isShown)
        setIsShown(!isShown)
        console.log(isShown)
    }
    return(
    appStarted ?
    <View style={{flex:1, flexDirection:"column",alignSelf:"center",padding:10}}>
            <Text>Iniciado</Text>
            
            <DropDown options={[]}actions={[]} placeholder="AAQAAAAA"/>
            
        
    </View> : null
    )
}

// Rodapé
export const LowerBar = () => {
    const {type,theme} = menuStore()
    return(
        <View style = {[uiStyles.lowerBar,{backgroundColor:theme.accentColor}]}>
            <ImageTextButton img={ICONS.home} imgStyle={uiStyles.buttonIconSmall} text={"Início"} textPos={TextPosition.BOTTOM}/>
            <ImageTextButton img={GetMemberIcon()} imgStyle={uiStyles.buttonIconSmall} text={"Membros"} textPos={TextPosition.BOTTOM} link={"/screens/MemberListScreen"}/>
            <ImageTextButton img={ICONS.escala} imgStyle={uiStyles.buttonIconSmall} text={"Escalas"} textPos={TextPosition.BOTTOM} link={"/screens/LineupOptions"}/>
            <ImageTextButton img={ICONS.menu} imgStyle={uiStyles.buttonIconSmall} text={"Menu"} textPos={TextPosition.BOTTOM} link={"/screens/SettingsMenu"}/>
            
        </View>
    )
}