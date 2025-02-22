import { View } from "react-native"
import { LinkRowImageButton, UpperBar} from "../classes/NewComps"
import { textStyles } from "../styles/GeneralStyles"
import { contextStore, menuStore } from "../store/store"
import { LineupType } from "../classes/Lineup"
import { useShallow } from "zustand/react/shallow"
import { Dates } from "../classes/Dates"
import { Roles } from "../classes/Roles"
import LineupListScreen from "./LineupListScreen"


export default function LineupOptions(){
    const {setLineupType,updateWeekend} = contextStore()
    const {type} = menuStore()
    const genOptions = contextStore(useShallow((state)=>state.curGenOptions))
    return(
    <View style={{flex:1}}>
        <UpperBar icon={require("@/src/app/item_icons/escala_icomdpi.png")} screenName={"Gerar escalas"} toggleEnabled={true}/>

        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala única"
                link="/screens/LineupGenerationOptions"
                press={()=>{
                        setLineupType(LineupType.SINGLE)
                        genOptions.roleset = Roles.GetDefaultRoleset(type)
                        genOptions.monthDays = {}
                        genOptions.monthDays[Dates.defaultWeekends.slice()[0]] = [Dates.defaultDays.slice()[0]]

                }}/>
       
        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala de fim de semana"
                link="/screens/LineupGenerationOptions"
                press={()=>{
                        setLineupType(LineupType.WEEKEND)
                        genOptions.roleset = Roles.GetDefaultRoleset(type)
                        genOptions.monthDays = {}
                        genOptions.monthDays[Dates.defaultWeekends.slice()[0]] = Dates.defaultDays.slice()
                        updateWeekend(Dates.defaultWeekends.slice()[0])

                }}/>
        
        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala mensal"
                link="/screens/LineupGenerationOptions"
                press={()=>{
                        setLineupType(LineupType.MONTH)
                        genOptions.roleset = Roles.GetDefaultRoleset(type)
                        genOptions.monthDays = {}  
                        genOptions.monthDays = Dates.DefaultMonthDays()
                                  
                }}/>
        
        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Histórico de escalas"
                link="/screens/LineupListScreen"
                />
    </View>
   )
}
