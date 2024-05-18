
import { types } from "@babel/core"
import { useFonts } from "expo-font"
import {View,Text,Image,StyleSheet, Button, TouchableOpacity} from "react-native"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { TextButton, ImageButton, EscalaDiaria} from "./classes/NewComps"
import  Home  from "./screens/HomeScreen"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  List  from "./screens/AcolyteListScreen"
import {Link} from "expo-router"
import { GenerateLineup } from "./classes/LineupGenerator"
import { CoroinhaData } from "./classes/CoroinhaData"
import { AcolyteData } from "./classes/AcolyteData"
//import { LineUpData } from "./classes/LineupData"
//import { Home } from "../screens/HomeScreen"

//import {Acolyte} from "../app/classes/AcolyteData"
//import { AcolyteData } from "../app/classes/AcolyteData"

//var lineupData = new LineUpData()
//var acolyteData = null


var acolyteData: any
var coroinhaData: any
var currentScreen = {
    screenName: "Tela inicial",
    iconPath: "./item_icons/home_icomdpi.png"
}

const ICON_IMAGES = {
    home:require("./item_icons/home_icomdpi.png"),
    acolitos:require("./item_icons/users_icomdpi.png"),
    escalas:require("./item_icons/escala_icomdpi.png")  
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
        resizeMode:"contain"
    },
    rowContainer:{
        flex:0.1,
        flexDirection:"row",
        alignContent:"center",
        alignItems:"center",
        backgroundColor: '#FFEBA4'
    },
    columnContainer:{
        flex:0.1,
        flexDirection:"column",
        alignContent:"center",
        alignItems:"center"
    }
})

const textStyles = StyleSheet.create({
    menuTitle:{
        fontFamily:"Inter-Light",
        fontSize:20,
        paddingLeft:20
    }
})

var appStarted = false;

const saveAcolyteData = async() => {
    try {
        await AsyncStorage.setItem(
          'AcolyteData',
          acolyteData,
        );
      } catch (error) {
        // Error saving data
      }
}

export const loadAcolyteData = async() => {
    try {
        acolyteData = await AsyncStorage.getItem("AcolyteData")
        AcolyteData.allAcolytes = JSON.parse(acolyteData)
    } catch (error) {
        console.log(error)
    }
}

const loadCoroinhaData = async() => {
    try {
        coroinhaData = await AsyncStorage.getItem("CoroinhaData")
        CoroinhaData.allCoroinhas = JSON.parse(coroinhaData)
    } catch (error) {
        console.log(error)
    }
}


export default function App() {
    if(!appStarted){
        console.log("Starting!")
        
        loadAcolyteData()
        loadCoroinhaData()

        
        
        
        console.log("Lineup!")
        appStarted = true
    }
    
    console.log("Acolytes: "+AcolyteData.allAcolytes)

    return (
      <Home/>
      
    );
  }


