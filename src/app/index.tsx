import  Home  from "./screens/HomeScreen"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CoroinhaData } from "./classes/CoroinhaData"
import { AcolyteData } from "./classes/AcolyteData"
import { DistinctRandomNumbers, OrganizeMemberArrayAlpha, reviver } from "./classes/Methods"


//let acolyteData: any
//let acolyteLineups: any
//let coroinhaData: any
//let coroinhaLineups:any

const ICON_IMAGES = {
    home:require("./item_icons/home_icomdpi.png"),
    acolitos:require("./item_icons/users_icomdpi.png"),
    escalas:require("./item_icons/escala_icomdpi.png")  
}

let appStarted = false;

/**
 * Carrega os dados dos acólitos.
 */
export const loadAcolyteData = async() => {
    try {
        let acolyteData = await AsyncStorage.getItem("AcolyteData")
        let acolyteLineups = await AsyncStorage.getItem("AcolyteLineups")
        AcolyteData.allAcolytes = JSON.parse(acolyteData)
        AcolyteData.allLineups = JSON.parse(acolyteLineups,reviver)
        

    } catch (error) {
        console.log(error)
    }
}

/**
 * Carrega os dados dos coroinhas.
 */
const loadCoroinhaData = async() => {
    try {
        let coroinhaData = await AsyncStorage.getItem("CoroinhaData")
        let coroinhaLineups = await AsyncStorage.getItem("CoroinhaLineups")
        CoroinhaData.allCoroinhas = JSON.parse(coroinhaData)
        CoroinhaData.allLineups = JSON.parse(coroinhaLineups,reviver)

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


