
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
let coroinhaData: any


const ICON_IMAGES = {
    home:require("./item_icons/home_icomdpi.png"),
    acolitos:require("./item_icons/users_icomdpi.png"),
    escalas:require("./item_icons/escala_icomdpi.png")  
}

let appStarted = false;

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

        AcolyteData.allAcolytes = OrganizeAcolyteArrayAlpha(AcolyteData.allAcolytes)
   
        appStarted = true
    }
    

    return (
      
      <Home/>
      
    );
  }


