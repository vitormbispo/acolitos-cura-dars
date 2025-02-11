import { View, Image, Text, StyleSheet} from "react-native";
import { ImageButton, LinkImageButton } from "../classes/NewComps";
import { uiStyles, textStyles } from "../styles/GeneralStyles";
import { menuStore} from "@/src/app/store/store";

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
    return(
        <View style = {{flex:1}}>
            <UpperBar/>
            <AppBody/>
            <LowerBar/> 
        </View>
        
    )
}

// Corpo da tela
export function AppBody(){
    return(
    <View style={{flex:1, flexDirection:"column",alignSelf:"center",padding:10}}>

        
        
    </View>
    )
}

// Cabeçalho
export const UpperBar = () => {
    const {theme,toggleTheme,name} = menuStore() 
    return(
        <View style = {[uiStyles.upperBar,{backgroundColor:theme.accentColor}]}>
            <Image style = {[uiStyles.buttonIcon,{margin:10}]} source={require("../item_icons/home_icomdpi.png")}/>
            <Text style = {textStyles.menuTitle}>- Tela inicial | {name}</Text>

            <View style = {{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
                <ImageButton img={require("@/src/app/shapes/coroinha_ico.png")} imgStyle={[uiStyles.buttonIcon,{margin:10}]} press={toggleTheme}/>
            </View>
        </View>
    )
}

// Rodapé
export const LowerBar = () => {
    const {type} = menuStore()
    return(
        <View style = {{alignSelf:"flex-end"}}>
            <Image source={LOWER_BARS[type]} style = {{width:420,height:125}}/>
            
            <View style = {{position:"absolute", flex:1,flexDirection:"row",alignSelf:"center",paddingTop:30}}>
                <LinkImageButton img={ICON_IMAGES.acolitos} imgStyle={uiStyles.buttonIcon} link={"/screens/AcolyteListScreen"} press={()=>{}}/>
                <ImageButton img={ICON_IMAGES.home} imgStyle={uiStyles.buttonIcon}/>
                <LinkImageButton img={ICON_IMAGES.escalas} imgStyle={uiStyles.buttonIcon} link={"/screens/LineupOptions"} press={()=>{}}/>
            </View>
        </View>
    )
}

export const Escala = () => {
    return(
        <View style={{flex:1,flexDirection:"row"}}>
            
        </View>
    )
}
