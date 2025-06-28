import  Home  from "./screens/HomeScreen"

import { MemberData, MemberType} from "./classes/MemberData";
import { LoadAcolyteRolesets, LoadCoroinhaRolesets, Roles } from "./classes/Roles";
import { Places } from "./classes/Places";
import { ConvertDataToClasses, LoadAcolyteData, LoadCoroinhaData, VerifyMembersIntegrity } from "./classes/DataManager";
import { contextStore } from "./store/store";
import { DistinctRandomNumbers } from "./classes/Methods";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";


export default function App() {
    const {appStarted,updateAppStarted} = contextStore()
    
    
    useEffect(()=>{
        if(!appStarted){
            InitializeApp().then(()=>{
                updateAppStarted(true)
            })
            
        }
    },[appStarted])
    return (
      <View style={{flex:1}}>
        {appStarted?<Home/>:null}
      </View>
      
      
    );
  }

/**
 * Inicializa a aplicação carregando e validando os dados salvos
 */
async function InitializeApp(){
    // Carrega e valida dados dos membros:
    await LoadAcolyteData().then(()=>{
        VerifyMembersIntegrity(MemberData.allAcolytes)
    })

    await LoadCoroinhaData().then(()=>{
        VerifyMembersIntegrity(MemberData.allCoroinhas)
        ConvertDataToClasses()
    }).then(()=>{MemberData.VerifyMemberDataIntegrity()})
    
    // Carregando conjuntos de funções
    await LoadAcolyteRolesets()
    await LoadCoroinhaRolesets().then(()=>{
        Roles.VerifyRolesIntegrity()
    })

    // Carregando locais
    await Places.LoadPlaceData().then(()=>{
        Places.VerifyPlacesIntegrity()
    })
    
    // Validações de locais e conjuntos
    if(Places.allPlaces == null){
        Places.ResetToDefault()
    }
    if(Roles.acolyteRoleSets == null || Roles.acolyteRoleSets.length == 0){
        Roles.InitializeSets(MemberType.ACOLYTE)
    }
    
    if(Roles.coroinhaRoleSets == null || Roles.coroinhaRoleSets.length == 0){
        Roles.InitializeSets(MemberType.COROINHA)
    } 
    return Promise.resolve()
}
