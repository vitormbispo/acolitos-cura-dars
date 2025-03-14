import  Home  from "./screens/HomeScreen"

import { MemberData, MemberType} from "./classes/MemberData";
import { LoadAcolyteRolesets, LoadCoroinhaRolesets, Roles } from "./classes/Roles";
import { Places } from "./classes/Places";
import { LoadAcolyteData, LoadCoroinhaData, VerifyMembersIntegrity } from "./classes/DataManager";


export default function App() {
    LoadAcolyteData().then(()=>{
        VerifyMembersIntegrity(MemberData.allAcolytes)
    })

    LoadAcolyteRolesets()

    LoadCoroinhaData().then(()=>{
        VerifyMembersIntegrity(MemberData.allCoroinhas)
    })

    LoadCoroinhaRolesets()
    

    if(Places.allPlaces == undefined || Places.allPlaces == null){
        Places.allPlaces = Places.defaultPlaces.slice()
    }
    if(Roles.acolyteRoleSets == null || Roles.acolyteRoleSets == undefined || Roles.acolyteRoleSets.length == 0){
        Roles.InitializeSets(MemberType.ACOLYTE)
    }
    
    if(Roles.coroinhaRoleSets == null || Roles.coroinhaRoleSets == undefined || Roles.coroinhaRoleSets.length == 0){
        Roles.InitializeSets(MemberType.COROINHA)
    }
    
    return (
      
      <Home/>
      
    );
  }


