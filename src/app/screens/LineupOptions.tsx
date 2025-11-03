import { View } from "react-native"
import { textStyles } from "../../styles/GeneralStyles"
import { contextStore, menuStore } from "../../store/store"
import { LineupType } from "../../classes/lineups/Lineup"
import { useShallow } from "zustand/react/shallow"
import { Dates } from "../../classes/Dates"
import { ICONS } from "../../classes/AssetManager"
import { MemberData, MemberIDList } from "../../classes/MemberData"
import { UpperBar } from "../../components/display/UpperBar"
import { LinkRowImageButton } from "../../components/buttons/LinkRowImageButton"
import { RolesData } from "../../classes/roles/RolesData"


export default function LineupOptions(){
    const {setLineupType,updateWeekend} = contextStore()
    const {type,theme} = menuStore()
    const genOptions = contextStore(useShallow((state)=>state.curGenOptions))
    return(
    <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
        <UpperBar icon={ICONS.escala} screenName={"Gerar escalas"} toggleEnabled={true}/>

        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={ICONS.escala}
                text ="Escala única"
                link="/screens/LineupGenerationOptions"
                press={()=>{
                        setLineupType(LineupType.SINGLE)
                        genOptions.roleset = RolesData.GetDefaultRoleset(type)
                        genOptions.monthDays = {}
                        genOptions.monthDays[Dates.defaultWeekends.slice()[0]] = [Dates.defaultDays.slice()[0]]
                        genOptions.members = MemberIDList(MemberData.FindMembersByType(type))
                }}/>
       
        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={ICONS.escala}
                text ="Escala de fim de semana"
                link="/screens/LineupGenerationOptions"
                press={()=>{
                        setLineupType(LineupType.WEEKEND)
                        genOptions.roleset = RolesData.GetDefaultRoleset(type)
                        genOptions.monthDays = {}
                        genOptions.monthDays[Dates.defaultWeekends.slice()[0]] = Dates.defaultDays.slice()
                        updateWeekend(Dates.defaultWeekends.slice()[0])
                        genOptions.members = MemberIDList(MemberData.FindMembersByType(type))

                }}/>
        
        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={ICONS.escala}
                text ="Escala mensal"
                link="/screens/LineupGenerationOptions"
                press={()=>{
                        setLineupType(LineupType.MONTH)
                        genOptions.roleset = RolesData.GetDefaultRoleset(type)
                        genOptions.monthDays = {}  
                        genOptions.monthDays = Dates.DefaultMonthDays()
                        genOptions.members = MemberIDList(MemberData.FindMembersByType(type))              
                }}/>
        
        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={ICONS.historicoEscalas}
                text ="Histórico de escalas"
                link="/screens/LineupListScreen"
                />
    </View>
   )
}
