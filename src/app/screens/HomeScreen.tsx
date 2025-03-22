import { View } from "react-native";
import { CompactLineup, DropDown, ExpandableView, GetMemberIcon, ImageTextButton, LinkRowImageButton, TextPosition, UpperBar } from "../classes/NewComps";
import { uiStyles} from "../styles/GeneralStyles";
import { contextStore, menuStore} from "@/src/app/store/store";
import { ICONS } from "../classes/AssetManager";
import { Member, MemberData } from "../classes/MemberData";
import { ConvertDataToClasses } from "../classes/DataManager";
import { Lineup, StructuredLineup } from "../classes/Lineup";

// Tela
export default function Home(){
    const {name} = menuStore()
    return(
        <View style = {{flex:1}}>
            <UpperBar screenName={"Tela inicial | "+name} icon={ICONS.home} toggleEnabled={true}/>
            <AppBody/>
            
            <LowerBar/> 
        </View>
        
    )
}

// Corpo da tela
export function AppBody(){
    const {appStarted} = contextStore()
    return(
    appStarted ?
    <View style={{flex:1, flexDirection:"column",alignSelf:"center",padding:10}}>
        <LinkRowImageButton img={ICONS.acolito} text={"TESTE"} link={"/screens/TestScreen"}/>
    </View> : null
    )
}

// Rodapé
export const LowerBar = () => {
    const {type,theme} = menuStore()
    return(
        <View style = {[uiStyles.lowerBar,{backgroundColor:theme.accentColor}]}>
            <ImageTextButton img={GetMemberIcon()} imgStyle={uiStyles.buttonIconSmall} text={"Membros"} textPos={TextPosition.BOTTOM} link={"/screens/MemberListScreen"}/>
            
            <ImageTextButton img={ICONS.home} imgStyle={uiStyles.buttonIconSmall} text={"Início"} textPos={TextPosition.BOTTOM}/>
            <ImageTextButton img={ICONS.escala} imgStyle={uiStyles.buttonIconSmall} text={"Escalas"} textPos={TextPosition.BOTTOM} link={"/screens/LineupOptions"}/>
            <ImageTextButton img={ICONS.menu} imgStyle={uiStyles.buttonIconSmall} text={"Menu"} textPos={TextPosition.BOTTOM} link={"/screens/SettingsMenu"}/>
            
        </View>
    )
}