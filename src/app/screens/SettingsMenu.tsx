import { View } from "react-native";
import { LinkRowImageButton, RowImageButton, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";
import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import { MemberData } from "../classes/MemberData";
import { SaveAcolyteData, SaveCoroinhaData } from "../classes/Methods";
import { router } from "expo-router";
import { DataImportOptions } from "./DataImport";
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
        </View>
    )
}