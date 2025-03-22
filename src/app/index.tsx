import  Home  from "./screens/HomeScreen"

import { MemberData, MemberType} from "./classes/MemberData";
import { LoadAcolyteRolesets, LoadCoroinhaRolesets, Roles } from "./classes/Roles";
import { Places } from "./classes/Places";
import { LoadAcolyteData, LoadCoroinhaData, VerifyMembersIntegrity } from "./classes/DataManager";
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

function InitializeApp(){
    LoadAcolyteData().then(()=>{
        VerifyMembersIntegrity(MemberData.allAcolytes)
    })

    LoadCoroinhaData().then(()=>{
        VerifyMembersIntegrity(MemberData.allCoroinhas)
    })
    MemberData.VerifyMemberDataIntegrity()
    
    LoadAcolyteRolesets()
    LoadCoroinhaRolesets().then(()=>{
        Roles.VerifyRolesIntegrity()
    })

    Places.LoadPlaceData().then(()=>{
        Places.VerifyPlacesIntegrity()
    })
    
    if(Places.allPlaces == undefined || Places.allPlaces == null){
        Places.allPlaces = Places.defaultPlaces.slice()
    }
    if(Roles.acolyteRoleSets == null || Roles.acolyteRoleSets == undefined || Roles.acolyteRoleSets.length == 0){
        Roles.InitializeSets(MemberType.ACOLYTE)
    }
    
    if(Roles.coroinhaRoleSets == null || Roles.coroinhaRoleSets == undefined || Roles.coroinhaRoleSets.length == 0){
        Roles.InitializeSets(MemberType.COROINHA)
    }  

}
