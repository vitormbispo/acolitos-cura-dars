import { View } from "react-native";
import { LinkRowImageButton, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";
export default function SettingsMenu(){
    return(
        <View>
            <UpperBar icon={ICONS.menu} screenName={"Menu"}/>
            <LinkRowImageButton img={ICONS.document} text={"- Dados"}
                textStyle={{
                    paddingLeft:10, 
                    fontFamily:"Inter-Light",
                    fontSize:20
            }}  link={"/screens/DataSettingsMenu"}/>

            <LinkRowImageButton img={ICONS.acolito} text={"- Funções"}
                textStyle={{
                    paddingLeft:10, 
                    fontFamily:"Inter-Light",
                    fontSize:20
            }}  link={"/screens/RolesetList"}/>

            <LinkRowImageButton img={ICONS.home} text="- Locais" 
                textStyle={{
                    paddingLeft:10, 
                    fontFamily:"Inter-Light",
                    fontSize:20
            }}  link={"/screens/PlaceList"}/>
        </View>
    )
}