import { View, Image, Text, StyleSheet} from "react-native";
import { ImageButton, LinkImageButton, TextButton, UpperBar } from "../classes/NewComps";
import { uiStyles, textStyles } from "../styles/GeneralStyles";
import { menuStore} from "@/src/app/store/store";
import { MemberType } from "../classes/Member";
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

<TextButton text="Clear AsyncStorage." sizeFont={16} familyFont="Inter-Regular" buttonStyle={{alignSelf:"center"}} press={()=>AsyncStorage.clear()}/>
        
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
                <LinkImageButton img={type==MemberType.ACOLYTE ? 
                      require("@/src/app/item_icons/users_icomdpi.png"):
                      require("@/src/app/shapes/coroinha_ico.png")
                      } imgStyle={uiStyles.buttonIcon} link={"/screens/MemberListScreen"} press={()=>{}}/>
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
