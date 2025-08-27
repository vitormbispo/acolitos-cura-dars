import { View } from "react-native";
import { ICONS } from "../classes/AssetManager";
import { router } from "expo-router";
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { DataImportOptions } from "./DataImport";
import { menuStore } from "../store/store";
import { RowImageButton } from "../components/buttons/RowImageButton";
import { UpperBar } from "../components/display/UpperBar";
import { LinkRowImageButton } from "../components/buttons/LinkRowImageButton";

export default function DataSettingsMenu(){
    const {theme} = menuStore()
    return(
        <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
            <UpperBar icon={ICONS.document} screenName={"Dados"}/>
            <LinkRowImageButton img={ICONS.export} text={"Exportar dados"} link={"/screens/DataExport"}/>
            <RowImageButton img={ICONS.import} text={"Importar dados"} press={()=>{
                LoadDataFile()
            }}/>
            <LinkRowImageButton img={ICONS.erase_data} text={"Excluir dados"} link={"/screens/DataErase"}/>
        </View>
    )
}
/**
 * Solicita ao usuário que selecione um arquivo para importação
 */
async function LoadDataFile() {
    let doc = DocumentPicker.getDocumentAsync({type:"application/json",copyToCacheDirectory:true,multiple:false})
    .then((result)=>{FileSystem.readAsStringAsync(result.assets[0].uri)
        .then((result) => {
            let data:object = JSON.parse(result)
            DataImportOptions.data = data
            DataImportOptions.selectedProperties = Object.keys(data)
            router.push("/screens/DataImport")
        })
        .catch(()=>console.error("Reading file failed"))
    })
    .catch(()=>console.error("Impossible to read file."))
}