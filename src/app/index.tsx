import  Home  from "./screens/HomeScreen"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CoroinhaData } from "./classes/CoroinhaData"
import { AcolyteData } from "./classes/AcolyteData"
import { OrganizeMemberArrayAlpha } from "./classes/Methods"


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
        AcolyteData.allLineups = JSON.parse(acolyteLineups)
        AcolyteData.ConvertLineObjectToMap()

    } catch (error) {
        console.log(error)
    }
}

const loadCoroinhaData = async() => {
    try {
        coroinhaData = await AsyncStorage.getItem("CoroinhaData")
        coroinhaLineups = await AsyncStorage.getItem("CoroinhaLineups")
        CoroinhaData.allCoroinhas = JSON.parse(coroinhaData)
        CoroinhaData.allLineups = JSON.parse(coroinhaLineups)

        
        OrganizeMemberArrayAlpha(CoroinhaData.allCoroinhas)
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
        AcolyteData.allAcolytes = OrganizeMemberArrayAlpha(AcolyteData.allAcolytes)
   
        appStarted = true
    }
    

    return (
      
      <Home/>
      
    );
  }


