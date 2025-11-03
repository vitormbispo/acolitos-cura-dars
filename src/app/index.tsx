import  Home  from "./screens/HomeScreen"

import { MemberData } from "../classes/MemberData";
import { Places } from "../classes/Places";
import { contextStore } from "../store/store";
import { useEffect } from "react";
import { View } from "react-native";
import { MemberRepository } from "../classes/repository/MemberRepository";
import { RolesRepository } from "../classes/repository/RolesRepository";
import { RoleSetRepository } from "../classes/repository/RoleSetRepository";
import { SetRolesRepository } from "../classes/repository/SetRolesRepository";
import { RolesData } from "../classes/roles/RolesData";
import { LineupRepository } from "../classes/repository/LineupRepository";
import { LineupGroupRepository } from "../classes/repository/LineupGroupRepository";
import { LineupData } from "../classes/lineups/LineupData";
import { GroupPlacesRepository } from "../classes/repository/GroupPlacesRepository";
import { GroupLineupsRepository } from "../classes/repository/GroupLineupsRepository";
import { SerializedLineupRepository } from "../classes/repository/SerializedLineupRepository";
import { PlacesRepository } from "../classes/repository/PlacesRespository";
import { RepositoryManager } from "../classes/repository/RepositoryManager";

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

    //await RepositoryManager.database.runAsync(`DROP TABLE lineup_members`).then(_ => console.log("Dropped table lineup_members"))
    //await RepositoryManager.database.runAsync(`DROP TABLE lineups`).then(_ => console.log("Dropped table lineups"))
    //await RepositoryManager.database.runAsync(`DROP TABLE role_set`).catch((e)=>{console.log("Error: "+e)})
    
    //await RepositoryManager.database.runAsync(`DROP TABLE group_lineups`).catch((e)=>{console.log("Error: "+e)})
    //await RepositoryManager.database.runAsync(`DROP TABLE group_places`).catch((e)=>{console.log("Error: "+e)})
    //await RepositoryManager.database.runAsync(`DROP TABLE lineup_group`).catch((e)=>{console.log("Error: "+e)})
    //await RepositoryManager.database.runAsync(`DROP TABLE serialized_lineups`).catch((e)=>{console.log("Error: "+e)})

    await RolesRepository.InitializeRepository().then(() => console.log("Roles OK"), e => console.error(e))
    await PlacesRepository.InitializeRepository().then(() => console.log("Places OK"), e => console.error(e))
    await SetRolesRepository.InitializeRepository().then(() => console.log("SetRoles OK"), e => console.error(e))
    await RoleSetRepository.InitializeRepository().then(() => console.log("RoleSet OK"), e => console.error(e))
    await LineupRepository.InitializeRepository().then(() => console.log("Lineup OK"), e => console.error(e))
    await LineupGroupRepository.InitializeRepository().then(() => console.log("Lineup OK"), e => console.error(e))
    await GroupPlacesRepository.InitializeRepository().then(() => console.log("Lineup OK"), e => console.error(e))
    await GroupLineupsRepository.InitializeRepository().then(() => console.log("Lineup OK"), e => console.error(e))
    await SerializedLineupRepository.InitializeRepository().then(() => console.log("Lineup OK"), e => console.error(e))

    await MemberData.InitializeMemberData()
    await RolesData.InitializeRolesData()
    
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
   LineupData.InitializeLineupData()
    
    return Promise.resolve()
}
