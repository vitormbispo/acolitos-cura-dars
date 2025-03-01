import { View, Image, Text, StyleSheet} from "react-native";
import { ImageButton, ImageTextButton, LinkImageButton, TextButton, TextPosition, UpperBar } from "../classes/NewComps";
import { uiStyles, textStyles } from "../styles/GeneralStyles";
import { menuStore} from "@/src/app/store/store";
import { MemberType } from "../classes/MemberData";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ícones:
const ICON_IMAGES = {
    home:require("../item_icons/home_icomdpi.png"),
    acolitos:require("../item_icons/users_icomdpi.png"),
    escalas:require("../item_icons/escala_icomdpi.png")  
}

// Barra inferior:
const LOWER_BARS = [require("@/src/app/shapes/LowerBar.png"),require("@/src/app/shapes/LowerBarCoroinhas.png")]

// Tela
export default function Home(){
    const {name} = menuStore()
    return(
        <View style = {{flex:1}}>
            <UpperBar screenName={"Tela inicial | "+name} icon={require("../item_icons/home_icomdpi.png")} toggleEnabled={true}/>
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
    </View>
    )
}

// Rodapé
export const LowerBar = () => {
    const {type,theme} = menuStore()
    return(
        <View style = {[uiStyles.lowerBar,{backgroundColor:theme.accentColor}]}>
            <ImageTextButton img={type==MemberType.ACOLYTE ? 
                    require("@/src/app/item_icons/users_icomdpi.png"):
                    require("@/src/app/shapes/coroinha_ico.png")
                    } imgStyle={uiStyles.buttonIconSmall} text={"Membros"} textPos={TextPosition.BOTTOM} link={"/screens/MemberListScreen"}/>
            
            <ImageTextButton img={ICON_IMAGES.home} imgStyle={uiStyles.buttonIconSmall} text={"Início"} textPos={TextPosition.BOTTOM}/>
            <ImageTextButton img={ICON_IMAGES.escalas} imgStyle={uiStyles.buttonIconSmall} text={"Escalas"} textPos={TextPosition.BOTTOM} link={"/screens/LineupOptions"}/>
        </View>
    )
}