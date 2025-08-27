import { View } from "react-native";
import { ICONS } from "../classes/AssetManager";
import { menuStore } from "../store/store";
import { UpperBar } from "../components/display/UpperBar";
import { LinkRowImageButton } from "../components/buttons/LinkRowImageButton";
export default function SettingsMenu(){
    const {theme} = menuStore()
    return(
        <View style={{backgroundColor:theme.backgroundColor}}>
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