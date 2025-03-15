import { Modal, View, Image, Text, Platform, ToastAndroid } from "react-native";
import { DataSection, TextButton, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";
import { MemberData} from "../classes/MemberData";
import { DataSelectors } from "./DataExport";
import { menuStore } from "../store/store";
import { router, useRouter } from "expo-router";
import { SaveAcolyteData, SaveCoroinhaData } from "../classes/Methods";
import { useState } from "react";
import { textStyles, uiStyles } from "../styles/GeneralStyles";
import { AppData, SaveDataFile, VerifyMembersIntegrity } from "../classes/DataManager";
import { Roles } from "../classes/Roles";
import { Places } from "../classes/Places";


export class DataImportOptions{
    static data:object
    static selectedProperties:Array<string>
}
export default function DataImport(){
    const {theme} = menuStore()
    const [confirmationVisible, setConfirmationVisible] = useState(false)
    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.import} screenName={"Importar dados"}/>
            <DataSection text={"Selecione quais dados importar:"} color={theme.accentColor}/>
            <DataSelectors allProperties={DataImportOptions.data} selectedProperties={DataImportOptions.selectedProperties}/>
            <TextButton text={"Importar"} press={()=>setConfirmationVisible(!confirmationVisible)} buttonStyle={{margin:30}}/>

            <Modal
                animationType="fade"
                visible={confirmationVisible}
                transparent={true}
                onRequestClose={()=>{setConfirmationVisible(!confirmationVisible)}}>
                
                <View style={{flex:1,justifyContent:"center",backgroundColor:"#0000005F"}}>
                    <View style={[{backgroundColor:theme.accentColor},uiStyles.modal,{height:"70%",width:"90%"}]}>
                        <View>
                            <Image source={ICONS.alert} style={{width:64,height:64,alignSelf:"center"}}/>
                            <Text style={{fontFamily:'Inter-Bold',textAlign:"center",alignSelf:"center",fontSize:24,color:"#EE2D24"}}>ATENÇÃO!</Text>
                        </View>
                        
                        <Text style={[textStyles.dataText,{padding:20,alignSelf:"center",textAlign:"center"}]}>
                        TODOS os dados atuais serão SOBRESCRITOS pelos dados importados selecionados. Os dados atuais serão perdidos. 
                        Essa ação não pode ser desfeita. Deseja fazer uma cópia dos dados atuais e prosseguir?
                        </Text>
        
                        <View style={{alignSelf:"center",gap:10,marginTop:30}}>
                            <TextButton text="Salvar e continuar" press={()=>{
                                SaveDataFile("data","application/json",DataImportOptions.selectedProperties)
                                    .then(()=>{
                                        LoadData(DataImportOptions.data,DataImportOptions.selectedProperties)
                                        setConfirmationVisible(false)

                                        if(Platform.OS == 'android'){
                                            ToastAndroid.show("Dados carregados com sucesso!",2)
                                        }
                                        router.back()}
                                    )
                                    .catch(()=>{
                                        if(Platform.OS == 'android'){
                                            ToastAndroid.show("Ação cancelada.",2)
                                        }
                                    })
                            }}/>
                            <TextButton text="Continuar sem salvar" press={()=>{
                                LoadData(DataImportOptions.data,DataImportOptions.selectedProperties)
                                if(Platform.OS == 'android'){
                                    ToastAndroid.show("Dados carregados com sucesso!",2)
                                }
                                router.back()
                            }}/>
                            <TextButton text="Cancelar" press={()=>{
                                setConfirmationVisible(!confirmationVisible)
                            }}/>
                        </View>
                    </View>
                    
                </View>
            </Modal>
        </View>
    )
}

function LoadData(data:AppData|object,properties:Array<string>){
    properties.forEach((prop)=>{
        let propData = data[prop].data
        
        if(MemberData[prop] != undefined){
            MemberData[prop] = propData
        }
        else if(Roles[prop] != undefined){
            Roles[prop] = propData
        }
        else if(Places[prop] != undefined){
            Places[prop] = propData
        }
        
    })
    SaveAcolyteData()
    SaveCoroinhaData()

    Places.VerifyPlacesIntegrity()
    Roles.VerifyRolesIntegrity()
    VerifyMembersIntegrity(MemberData.allAcolytes)
    VerifyMembersIntegrity(MemberData.allCoroinhas)
}