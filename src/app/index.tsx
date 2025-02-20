import  Home  from "./screens/HomeScreen"
import AsyncStorage from '@react-native-async-storage/async-storage';

import { CoroinhaData } from "./classes/CoroinhaData"
import { AcolyteData } from "./classes/AcolyteData"
import { DistinctRandomNumbers, OrganizeMemberArrayAlpha, reviver } from "./classes/Methods"
import { MemberData, MemberType } from "./classes/MemberData";
import { Roles } from "./classes/Roles";


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
        MemberData.allAcolytes = JSON.parse(acolyteData)
        MemberData.allLineupsAcolytes = JSON.parse(acolyteLineups,reviver)
        
        OrganizeMemberArrayAlpha(MemberData.allAcolytes)
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
        MemberData.allCoroinhas = JSON.parse(coroinhaData)
        MemberData.allLineupsCoroinhas = JSON.parse(coroinhaLineups,reviver)

        OrganizeMemberArrayAlpha(MemberData.allCoroinhas)
    } catch (error) {
        console.log(error)
    }
}

export default function App() {
    if(!appStarted){
        console.log("Starting!")
        
        loadAcolyteData()
        loadCoroinhaData()

        if (MemberData.allCoroinhas == null){
            MemberData.allCoroinhas = []
        }
        if (MemberData.allLineupsCoroinhas == null){
            MemberData.allLineupsCoroinhas = []
        }

        if (MemberData.allAcolytes == null){
            MemberData.allAcolytes = []
        }
        if (MemberData.allLineupsAcolytes == null){
            MemberData.allLineupsAcolytes = []
        }
        
        if(Roles.acolyteRoleSets == null || Roles.acolyteRoleSets == undefined){
            Roles.InitializeSets(MemberType.ACOLYTE)
        }

        if(Roles.coroinhaRoleSets == null || Roles.coroinhaRoleSets == undefined){
            Roles.InitializeSets(MemberType.COROINHA)
        }
        
        appStarted = true
    }
    
    return (
      
      <Home/>
      
    );
  }


