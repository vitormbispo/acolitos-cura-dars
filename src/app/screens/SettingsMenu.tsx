import { View } from "react-native";
import { LinkRowImageButton, RowImageButton, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";
import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import { MemberData } from "../classes/MemberData";
export default function SettingsMenu(){
    return(
        <View>
            <UpperBar icon={ICONS.menu} screenName={"Menu"}/>
            <RowImageButton img={ICONS.acolito} text={"Exportar dados"} press={()=>{
                SaveDataFile("Data","application/json")
            }}/>
            <RowImageButton img={ICONS.acolito} text={"Importar dados"} press={()=>{
                LoadDataFile()
            }}/>
        </View>
    )
}

async function SaveDataFile(name:string,mimetype:string){
    let data = {
        "allAcolytes":MemberData.allAcolytes,
        "allCoroinhas":MemberData.allCoroinhas,
        "allLineups":MemberData.allLineups,
        "allLineupsCoroinhas":MemberData.allLineupsCoroinhas,
        "allLineupsAcolytes":MemberData.allLineupsAcolytes,
        "allMembers":MemberData.allMembers
    }
    
    let permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()
    
    if(permissions.granted){
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri,name,mimetype)
        .then(async(uri)=>{
            await FileSystem.writeAsStringAsync(uri,JSON.stringify(data),{encoding: FileSystem.EncodingType.UTF8})
        })
    }
}

async function LoadDataFile() {
    let doc = DocumentPicker.getDocumentAsync({type:"application/json",copyToCacheDirectory:true,multiple:false})
        .then(
            (result)=>{return result.assets[0]}
    )

    console.log(doc)
    
}