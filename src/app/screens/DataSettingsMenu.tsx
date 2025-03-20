import { View } from "react-native";
import { LinkRowImageButton, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";

export default function DataSettingsMenu(){
    
    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.document} screenName={"Dados"}/>
            <LinkRowImageButton img={ICONS.export} text={"Exportar dados"} link={"/screens/DataExport"}/>
            <LinkRowImageButton img={ICONS.import} text={"Importar dados"} link={"/screens/DataImport"}/>
            <LinkRowImageButton img={ICONS.erase_data} text={"Excluir dados"} link={"/screens/DataErase"}/>   
        </View>
    )
}