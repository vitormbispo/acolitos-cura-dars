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
    MemberData.LoadMembersFromDatabaseSync()

    await RepositoryManager.database.runAsync(`DROP TABLE set_roles`).then(_=>{console.log("Dropped table")},e => {console.error(e)})
    await RepositoryManager.database.runAsync(`DROP TABLE role_set`).then(_=>{console.log("Dropped table")},e => {console.error(e)})
    await RepositoryManager.database.runAsync(`DROP TABLE roles`).then(_=>{console.log("Dropped table")},e => {console.error(e)})
    
    await RolesRepository.InitializeRepository().then(() => console.log("Roles OK"), e => console.error(e))
    await SetRolesRepository.InitializeRepository().then(() => console.log("SetRoles OK"), e => console.error(e))
    await RoleSetRepository.InitializeRepository().then(() => console.log("RoleSet OK"), e => console.error(e))

    RolesRepository.InsertRole("Ceroferário 1")
    RolesRepository.InsertRole("Ceroferário 2")
    RolesRepository.InsertRole("Cruciferário")
    console.log(RolesRepository.FindAllRoles())
    
    try {
        let newRoleset = Roles.GetDefaultRoleset(MemberType.ACOLYTE)
        console.log(newRoleset.set)
        
        RoleSetRepository.InsertRoleSet(newRoleset)
        let found = RoleSetRepository.FindRoleSetByID(1)
        console.log(found.set)
        console.log("Full object: ",found)

        let newRoleset2 = new RoleSet("Bispo",MemberType.ACOLYTE,["Ceroferário 1","Ceroferário 2","Cruciferário","Turiferário","Naveteiro","Librífero","Baculoferário","Mitrífero"],false)
        RoleSetRepository.InsertRoleSet(newRoleset2)
        let found2 = RoleSetRepository.FindRoleSetByID(2)
        console.log(found2.set)
        console.log("Full object: ",found2)

        let all = RoleSetRepository.FindAll()
        console.log(all)

    } catch(e) {
        console.error(e)
    }
    
    // Carrega e valida dados dos membros:
    await LoadAcolyteData().then(()=>{
        VerifyMembersIntegrity(MemberData.allAcolytes)
    })

    await LoadCoroinhaData().then(()=>{
        VerifyMembersIntegrity(MemberData.allCoroinhas)
        ConvertDataToClasses()
    }).then(()=>{MemberData.VerifyMemberDataIntegrity()})
    
    // Carregando conjuntos de funções
    /*
    await LoadAcolyteRolesets()
    await LoadCoroinhaRolesets().then(()=>{
        Roles.VerifyRolesIntegrity()
    })
    */
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
