import  Home  from "./screens/HomeScreen"

import { MemberData, MemberType} from "./classes/MemberData";
import { LoadAcolyteRolesets, LoadCoroinhaRolesets, Roles } from "./classes/Roles";
import { Places } from "./classes/Places";
import { ConvertDataToClasses, LoadAcolyteData, LoadCoroinhaData, VerifyMembersIntegrity } from "./classes/DataManager";
import { contextStore } from "./store/store";


export default function App() {
    const {appStarted,updateAppStarted} = contextStore()
    
    if(!appStarted){
        InitializeApp()
        updateAppStarted(true)
    }
    
    return (
      
      <Home/>
      
    );
  }

/**
 * Inicializa a aplicação carregando e validando os dados salvos
 */
function InitializeApp(){
    // Carrega e valida dados dos membros:
    LoadAcolyteData().then(()=>{
        VerifyMembersIntegrity(MemberData.allAcolytes)
    })

    LoadCoroinhaData().then(()=>{
        VerifyMembersIntegrity(MemberData.allCoroinhas)
    })
    
    MemberData.VerifyMemberDataIntegrity() // Valida a integridade de todos os dados dos membros
    
    // Carregando conjuntos de funções
    LoadAcolyteRolesets()
    LoadCoroinhaRolesets().then(()=>{
        Roles.VerifyRolesIntegrity()
    })

    // Carregando locais
    Places.LoadPlaceData().then(()=>{
        Places.VerifyPlacesIntegrity()
    })
    
    // Validações de locais e conjuntos
    if(Places.allPlaces == null){
        Places.allPlaces = Places.defaultPlaces.slice()
    }
    if(Roles.acolyteRoleSets == null || Roles.acolyteRoleSets.length == 0){
        Roles.InitializeSets(MemberType.ACOLYTE)
    }
    
    if(Roles.coroinhaRoleSets == null || Roles.coroinhaRoleSets.length == 0){
        Roles.InitializeSets(MemberType.COROINHA)
    }  

}
