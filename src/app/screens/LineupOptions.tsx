import { View,Image,Text } from "react-native"
import { Global } from "../Global"
import { LinkRowImageButton, RowImageButton } from "../classes/NewComps"


export default function LineupOptions(){
    Global.currentScreen = {screenName:"Escalas",iconPath:""}
    return(
    <View style={{flex:1}}>
        <UpperBar/>

        <LinkRowImageButton textStyle=
                {{paddingLeft:10, 
                fontFamily:"Inter-Light",
                fontSize:20}}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala única"
                link="/screens/SingleLineup"/>
       
        <LinkRowImageButton textStyle=
                {{paddingLeft:10, 
                fontFamily:"Inter-Light",
                fontSize:20}}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala de fim de semana"
                link="/screens/WeekendLineup"/>
        
        <LinkRowImageButton textStyle=
                {{paddingLeft:10, 
                fontFamily:"Inter-Light",
                fontSize:20}}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala mensal"
                link="/screens/MonthLineup"/>
    </View>
   )
}
export const UpperBar = () => {
    return(
        <View style = {Global.styles.rowContainer}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            padding:26,
            paddingRight:40,
            paddingLeft:40,
            resizeMode:"contain"}}  source={require("../item_icons/escala_icomdpi.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
        </View>
    )
}