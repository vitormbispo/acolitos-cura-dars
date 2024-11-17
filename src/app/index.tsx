
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
import { OrganizeAcolyteArrayAlpha } from "./classes/Methods"


let acolyteData: any
let acolyteLineups: any
let coroinhaData: any
let coroinhaLineups:any

const ICON_IMAGES = {
    home:require("./item_icons/home_icomdpi.png"),
    acolitos:require("./item_icons/users_icomdpi.png"),
    escalas:require("./item_icons/escala_icomdpi.png")  
}

let appStarted = false;

export const loadAcolyteData = async() => {
    try {
        acolyteData = await AsyncStorage.getItem("AcolyteData")
        acolyteLineups = await AsyncStorage.getItem("AcolyteLineups")
        AcolyteData.allAcolytes = JSON.parse(acolyteData)
        //AcolyteData.allLineups = JSON.parse(acolyteLineups)
    } catch (error) {
        console.log(error)
    }
}

const loadCoroinhaData = async() => {
    try {
        coroinhaData = await AsyncStorage.getItem("CoroinhaData")
        coroinhaLineups = await AsyncStorage.getItem("CoroinhaLineups")
        CoroinhaData.allCoroinhas = JSON.parse(coroinhaData)
        //CoroinhaData.allLineups = JSON.parse(coroinhaLineups)

        
        OrganizeAcolyteArrayAlpha(CoroinhaData.allCoroinhas)
    } catch (error) {
        console.log(error)
    }
}


export default function App() {
    if(!appStarted){
        console.log("Starting!")
        
        loadAcolyteData()
        loadCoroinhaData()

        if (CoroinhaData.allCoroinhas == null){
            CoroinhaData.allCoroinhas = []
        }
        if (CoroinhaData.allLineups == null){
            CoroinhaData.allLineups = []
        }

        if (AcolyteData.allAcolytes == null){
            AcolyteData.allAcolytes = []
        }
        if (AcolyteData.allLineups == null){
            AcolyteData.allLineups = []
        }
        AcolyteData.allAcolytes = OrganizeAcolyteArrayAlpha(AcolyteData.allAcolytes)
   
        appStarted = true
    }
    

    return (
      
      <Home/>
      
    );
  }


