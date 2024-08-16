import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { EscalaDiaria, ImageButton, TextButton, LinkImageButton } from "@/src/app/classes/NewComps";
import { Link } from "expo-router";
import { GenerateLineup } from "@/src/app/classes/LineupGenerator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Global } from "@/src/app/Global";

const ICON_IMAGES = {
    home:require("@/src/app/item_icons/home_icomdpi.png"),
    coroinhas:require("@/src/app/shapes/coroinha_ico.png"),
    escalas:require("@/src/app/item_icons/escala_icomdpi.png")  
}

const styles = StyleSheet.create({
    icons: {
        width:64,
        height:64,
        padding:26,
        paddingRight:10,
        paddingLeft:10,
        resizeMode:"contain"
    },
    buttonIcons: {
        width:64,
        height:64,
        resizeMode:"contain",
    },
    rowContainer:{
        flex:0.1,
        flexDirection:"row",
        alignContent:"center",
        alignItems:"center",
        backgroundColor: '#FFEBA4',
        padding:10
    },
    columnContainer:{
        flex:0.1,
        flexDirection:"column",
        alignContent:"center",
        alignItems:"center"
    }
})

var currentScreen = {
    screenName: "Tela Inicial - Coroinhas",
    iconPath: "../item_icons/home_icomdpi.png"
}

const textStyles = StyleSheet.create({
    menuTitle:{
        fontFamily:"Inter-Light",
        fontSize:20,
        paddingLeft:20
    }
})


export default function Home(){
    return(
        <View style = {{flex:1}}>
            {UpperBar()}
            
            <View style={{flex:1}}>

            </View>
            <View style = {{alignSelf:"flex-end"}}>
                <Image source={require("@/src/app/shapes/LowerBarCoroinhas.png")} style = {{width:420,height:125}}/>
                <View style = {{position:"absolute", flex:1,flexDirection:"row",alignSelf:"center",paddingTop:30}}>
                    <LinkImageButton img={ICON_IMAGES.coroinhas} imgStyle={styles.buttonIcons} link={"/screens/coroinhas/CoroinhasListScreen"} press={()=>{}}/>
                    <ImageButton img={ICON_IMAGES.home} imgStyle={styles.buttonIcons}/>
                    <LinkImageButton img={ICON_IMAGES.escalas} imgStyle={styles.buttonIcons} link={"/screens/coroinhas/CoroinhaLineupOptions"} press={()=>{}}/>
                </View>
            </View>
            
            
        </View>
        
    )
}
export function AppBody(){
    return(
    <View style={{flex:1, flexDirection:"column",alignSelf:"center",padding:10}}>
        <EscalaDiaria dayTitle="Sábado - 10/02 - 19h"/>
        <EscalaDiaria/>

        <TextButton text="Gerar Escala!" sizeFont={16} familyFont="Inter-Regular" buttonStyle={{alignSelf:"center"}} press = {()=>{GenerateLineup()}}/>
        <TextButton text="Clear AsyncStorage." sizeFont={16} familyFont="Inter-Regular" buttonStyle={{alignSelf:"center"}} press={()=>AsyncStorage.clear()}/>
        
    </View>
    )
}

export const UpperBar = () => {
    return(
        <View style = {[Global.styles.rowContainer, {backgroundColor:"#fca4a4"}]}>
            <Image style = {styles.icons} source={require("@/src/app/item_icons/home_icomdpi.png")}/>
            <Text style = {textStyles.menuTitle}>- {currentScreen.screenName}</Text>
        </View>
    )
}

export const LowerBar = () => {
    return(
        <View style = {{alignSelf:"flex-end", alignContent:"center"}}>
            <Image source={require("@/src/app/shapes/LowerBar.png")} style = {{width:420,height:125}}/>
            <View style = {{position:"absolute", flex:1,flexDirection:"row",alignSelf:"center",paddingTop:30}}>
                <ImageButton img={ICON_IMAGES.coroinhas} imgStyle={styles.buttonIcons} press={{}}/>
                <ImageButton img={ICON_IMAGES.home} imgStyle={styles.buttonIcons}/>
                <ImageButton img={ICON_IMAGES.escalas} imgStyle={styles.buttonIcons}/>
            </View>
        </View>
    )
}

export const Escala = () => {
    return(
        <View style={{flex:1,flexDirection:"row"}}>
            <Text>Cruciferário</Text>
            <Text>Librífero</Text>
            <Text>Ceroferário 1</Text>
            <Text>Ceroferário 2</Text>
            <Text>Turiferário</Text>
            <Text>Naveteiro</Text>
        </View>
    )
}