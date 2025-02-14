import { View } from "react-native"
import { LinkRowImageButton, UpperBar} from "../classes/NewComps"
import { textStyles } from "../styles/GeneralStyles"


export default function LineupOptions(){
    return(
    <View style={{flex:1}}>
        <UpperBar icon={require("@/src/app/item_icons/escala_icomdpi.png")} screenName={"Gerar escalas"} toggleEnabled={true}/>

        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala única"
                link="/screens/SingleLineup"/>
       
        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala de fim de semana"
                link="/screens/WeekendLineup"/>
        
        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala mensal"
                link="/screens/MonthLineup"/>
        
        <LinkRowImageButton textStyle=
                {textStyles.buttonText}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Histórico de escalas"
                link="/screens/LineupListScreen"/>
    </View>
   )
}
