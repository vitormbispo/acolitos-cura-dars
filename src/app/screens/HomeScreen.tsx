import { View } from "react-native";
import { DropDown, ExpandableView, GetMemberIcon, ImageTextButton, TextPosition, UpperBar } from "../classes/NewComps";
import { uiStyles} from "../styles/GeneralStyles";
import { menuStore} from "@/src/app/store/store";
import { ICONS } from "../classes/AssetManager";

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
    return(
    <View style={{flex:1, flexDirection:"column",alignSelf:"center",padding:10}}>
{/*}
<       TextButton text="Clear AsyncStorage." textStyle={textStyles.textButtonText} buttonStyle={{alignSelf:"center"}} press={()=>AsyncStorage.clear()}/>
        
{*/}
    <ExpandableView title="drop" expanded={false} content={
        <DropDown options={["Opção 1","Opção 2","Opção 3"]} actions={[()=>{console.log("Opção 1")},()=>{console.log("Opção 2")},()=>{console.log("Opção 3")}]}/>
    }/>
    
    </View>
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