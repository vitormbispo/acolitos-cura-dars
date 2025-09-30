import  Home  from "./screens/HomeScreen"

import { MemberData, MemberType} from "./classes/MemberData";
import { Places } from "./classes/Places";
import { ConvertDataToClasses, LoadAcolyteData, LoadCoroinhaData, VerifyMembersIntegrity } from "./classes/DataManager";
import { contextStore } from "./store/store";
import { DistinctRandomNumbers } from "./classes/Util";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { MemberRepository } from "./classes/repository/MemberRepository";
import { RolesRepository } from "./classes/repository/RolesRepository";
import { RepositoryManager } from "./classes/repository/RepositoryManager";
import { Roles } from "./classes/roles/Roles";
import { RoleSetRepository } from "./classes/repository/RoleSetRepository";
import { SetRolesRepository } from "./classes/repository/SetRolesRepository";
import { RoleSet } from "./classes/roles/RoleSet";
import { RolesData } from "./classes/roles/RolesData";


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
    await MemberRepository.InitRepository()

    await RolesRepository.InitializeRepository().then(() => console.log("Roles OK"), e => console.error(e))
    await SetRolesRepository.InitializeRepository().then(() => console.log("SetRoles OK"), e => console.error(e))
    await RoleSetRepository.InitializeRepository().then(() => console.log("RoleSet OK"), e => console.error(e))

    await MemberData.InitializeMemberData()
    await RolesData.InitializeRolesData()

    console.log(RolesData.rolesets)
    // Carregando locais
    await Places.LoadPlaceData().then(()=>{
        Places.VerifyPlacesIntegrity()
    })
    
    // Validações de locais e conjuntos
    if(Places.allPlaces == null){
        Places.ResetToDefault()
    }
    /*
    if(Roles.acolyteRoleSets == null || Roles.acolyteRoleSets.length == 0){
        Roles.InitializeSets(MemberType.ACOLYTE)
    }
    
    if(Roles.coroinhaRoleSets == null || Roles.coroinhaRoleSets.length == 0){
        Roles.InitializeSets(MemberType.COROINHA)
    } 
    */
    
    return Promise.resolve()
}
