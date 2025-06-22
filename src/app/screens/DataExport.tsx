import { ToastAndroid, View } from "react-native";
import { DataSection, TextButton, TextCheckBox, TextInputModal, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";
import { router } from "expo-router";
import { AppData, RetrieveAppData, RetrieveAppDataProperties, SaveDataFile } from "../classes/DataManager";
import { useRef, useState } from "react";
import { menuStore } from "../store/store";

export default function DataExport(){
    const {theme} = menuStore()
    const allProperties = RetrieveAppData()
    const selectedProperties = useRef(RetrieveAppDataProperties())
    
    const [fileNameOpen,setFileNameOpen] = useState(false)
    const fileName = useRef("data")
    
    const ExportData = ()=>{
        SaveDataFile(fileName.current,"application/json",selectedProperties.current)
            .then(()=>router.back())
            .catch(()=>{ToastAndroid.show("Salvamento cancelado.",2)})
    }
    return(
        <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
            <UpperBar icon={ICONS.export} screenName={"Exportar dados"}/>
            <DataSection text={"Selecione os dados para exportar:"} textStyle={{fontSize:20}}/>
            <DataSelectors allProperties={allProperties} selectedProperties={selectedProperties.current}/>
            
            <TextInputModal 
                visible={fileNameOpen} 

                title={"Nome: "} 
                description={"Insira o nome do novo arquivo"} 
                
                onRequestClose={()=>{
                    setFileNameOpen(false)
                }}
                submitAction={ExportData}
                onChangeText={(text:string)=>{
                    fileName.current = text
                }}/>

            <TextButton buttonStyle={{margin:30}} text={"Exportar"} press={()=>{
               setFileNameOpen(true)
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