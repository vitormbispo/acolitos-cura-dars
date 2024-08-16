import { View,Image,Text } from "react-native"
import { Global } from "@/src/app/Global"
import { LinkRowImageButton, RowImageButton } from "@/src/app/classes/NewComps"


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
                link="/screens/coroinhas/CoroinhaSingleLineup"/>
        
        <LinkRowImageButton textStyle=
                {{paddingLeft:10, 
                fontFamily:"Inter-Light",
                fontSize:20}}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala de fim de semana"
                link="/screens/coroinhas/CoroinhaWeekendLineup"/>
        <LinkRowImageButton textStyle=
                {{paddingLeft:10, 
                fontFamily:"Inter-Light",
                fontSize:20}}
                img={require("@/src/app/item_icons/users_icomdpi.png")}
                text ="Gerar escala mensal"
                link="/screens/coroinhas/CoroinhaMonthLineup"/>
    </View>
   )
}
export const UpperBar = () => {
    return(
        <View style = {[Global.styles.rowContainer,{backgroundColor:"#fca4a4"}]}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            padding:26,
            paddingRight:40,
            paddingLeft:40,
            resizeMode:"contain"}}  source={require("@/src/app/item_icons/escala_icomdpi.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
        </View>
    )
}