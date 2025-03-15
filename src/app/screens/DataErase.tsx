import { Modal, Platform, ToastAndroid, View, Image, Text} from "react-native";
import { ConfirmationModal, TextButton, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";
import { DataSelectors } from "./DataExport";
import { MemberData} from "../classes/MemberData";
import { useRef, useState } from "react";
import { SaveAcolyteData, SaveCoroinhaData } from "../classes/Methods";
import { router } from "expo-router";
import { menuStore } from "../store/store";
import { textStyles, uiStyles } from "../styles/GeneralStyles";
import { RetrieveAppData, RetrieveAppDataProperties, SaveDataFile } from "../classes/DataManager";
import { Roles } from "../classes/Roles";
import { Places } from "../classes/Places";

// TODO Corrigir problema que ao selecionar salvar e continuar, caso o usuário não
// escolha o diretório para salvar, os dados são excluídos mesmo assim.
export default function DataErase(){
    const [confirmationVisible, setConfirmationVisible] = useState(false)
    const {theme} = menuStore()

    const allProperties = useRef(RetrieveAppData())
    const selectedProperties = useRef(RetrieveAppDataProperties())
    
    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.erase_data} screenName={"Excluir dados"}/>
            <DataSelectors allProperties={allProperties.current} selectedProperties={selectedProperties.current}/>
            <TextButton text={"Excluir"} press={()=>setConfirmationVisible(!confirmationVisible)} buttonStyle={{margin:30}}/>

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
                            Você está prestes a excluir TODOS os dados selecionados. 
                            Essa ação não pode ser desfeita. Deseja fazer uma cópia dos dados e prosseguir?
                            </Text>
            
                            <View style={{alignSelf:"center",gap:10,marginTop:30}}>
                                <TextButton text="Salvar e continuar" press={()=>{
                                    SaveDataFile("data","application/json",selectedProperties.current)
                                        .then(()=>{
                                            EraseSelectedData(selectedProperties.current)
                                            setConfirmationVisible(false)
                                            router.back()}
                                        )
                                }}/>
                                <TextButton text="Continuar sem salvar" press={()=>{
                                    EraseSelectedData(selectedProperties.current)
                                    if(Platform.OS == 'android'){
                                        ToastAndroid.show("Dados excluídos com sucesso.",2)
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

function EraseSelectedData(selectedData:Array<string>){
    selectedData.forEach((data)=>{
        if(MemberData[data] != undefined){
            MemberData[data] = null
        }
        else if(Roles[data] != undefined){
            Roles[data] = null
        }
        else if(Places[data] != undefined){
            Places[data] = null
        }
        
    })
    Places.VerifyPlacesIntegrity()
    Roles.VerifyRolesIntegrity()
    SaveAcolyteData()
    SaveCoroinhaData()
}