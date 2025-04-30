import { ToastAndroid, View } from "react-native";
import { DataSection, TextButton, TextCheckBox, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";
import { router } from "expo-router";
import { AppData, RetrieveAppData, RetrieveAppDataProperties, SaveDataFile } from "../classes/DataManager";

export default function DataExport(){
    let allProperties = RetrieveAppData()
    let selectedProperties = RetrieveAppDataProperties()
    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.export} screenName={"Exportar dados"}/>
            <DataSection text={"Selecione os dados para exportar:"} textStyle={{fontSize:20}}/>
            <DataSelectors allProperties={allProperties} selectedProperties={selectedProperties}/>
            <TextButton buttonStyle={{margin:30}} text={"Exportar"} press={()=>{
                SaveDataFile("data","application/json",selectedProperties)
                    .then(()=>router.back())
                    .catch(()=>{ToastAndroid.show("Salvamento cancelado.",2)})
            }}/>
        </View>
    )
}
type DataSelectorsProps = {
    allProperties:AppData|object
    selectedProperties:Array<string>
}
export function DataSelectors(props:DataSelectorsProps){
    let checks = []
    let allKeys = Object.keys(props.allProperties)
    for(let i = 0; i < allKeys.length; i++){
        checks.push(
            <TextCheckBox text={props.allProperties[allKeys[i]].name} checked={props.selectedProperties.indexOf(allKeys[i]) != -1} press={()=>{
                let property = allKeys[i]
                let propIndex = props.selectedProperties.indexOf(property)
                if(propIndex == -1){
                    props.selectedProperties.push(property)
                }
                else{
                    props.selectedProperties.splice(propIndex,1)
                }
            }} key={i}/>
        )
    }

    return(
        <View style={{flex:1,margin:20,gap:10}}>
            {checks}
        </View>
    )
}