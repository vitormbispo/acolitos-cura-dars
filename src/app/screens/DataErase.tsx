import { Modal, Platform, ToastAndroid, View, Image, Text} from "react-native";
import { DataSection, TextButton, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";
import { DataSelectors } from "./DataExport";
import { MemberData} from "../classes/MemberData";
import { useRef, useState } from "react";
import { router } from "expo-router";
import { menuStore } from "../store/store";
import { textStyles, uiStyles } from "../styles/GeneralStyles";
import { RetrieveAppData, RetrieveAppDataProperties, SaveDataFile } from "../classes/DataManager";
import { Roles } from "../classes/Roles";
import { Places } from "../classes/Places";

export default function DataErase(){
    const [confirmationVisible, setConfirmationVisible] = useState(false)
    const {theme} = menuStore()

    const allProperties = useRef(RetrieveAppData()) // Todos os dados da aplicação
    const selectedProperties = useRef(RetrieveAppDataProperties()) // Nomes das propriedades
    
    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.erase_data} screenName={"Excluir dados"}/>
            <DataSection text={"- Selecione quais dados excluir: "} textStyle={{fontSize:20}}/>
            <DataSelectors allProperties={allProperties.current} selectedProperties={selectedProperties.current}/>
            <TextButton text={"Excluir"} press={()=>setConfirmationVisible(!confirmationVisible)} buttonStyle={{margin:30,backgroundColor:theme.reject}} textStyle={{fontFamily:"Inter-Bold"}}/>

            {/* Modal de confirmação */}
            <Modal
                animationType="fade"
                visible={confirmationVisible}
                transparent={true}
                onRequestClose={()=>{setConfirmationVisible(!confirmationVisible)}}>
                
                <View style={{flex:1,justifyContent:"center",backgroundColor:"#0000005F"}}>
                    <View style={[{backgroundColor:theme.primary},uiStyles.modal,{minHeight:"70%",minWidth:"90%"}]}>
                        <View>
                            <Image source={ICONS.alert} style={{width:64,height:64,alignSelf:"center"}}/>
                            <Text style={{fontFamily:'Inter-Bold',textAlign:"center",alignSelf:"center",fontSize:24,color:"#EE2D24"}}>ATENÇÃO!</Text>
                        </View>
                        
                        <Text style={[textStyles.dataText,{padding:20,alignSelf:"center",textAlign:"center",fontFamily:"Inter-Bold"}]}>
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
                                    .catch(()=>{
                                        ToastAndroid.show("Salvamento cancelado. Os dados não foram excluídos",2)
                                    })
                            }} buttonStyle={{backgroundColor:theme.confirm}}/>

                            <TextButton text="Continuar sem salvar" press={()=>{
                                EraseSelectedData(selectedProperties.current)
                                if(Platform.OS == 'android'){
                                    ToastAndroid.show("Dados excluídos com sucesso.",2)
                                }
                                router.back()
                            }}/>

                            <TextButton text="Cancelar" press={()=>{
                                setConfirmationVisible(!confirmationVisible)
                            }} buttonStyle={{backgroundColor:theme.reject}}/>
                        </View>
                    </View>
                </View>
              </Modal>
        </View>
    )
}

/**
 * Apaga todos os dados selecionados da aplicação
 * @param selectedData 
 */
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
    MemberData.VerifyMemberDataIntegrity()
    Places.VerifyPlacesIntegrity()
    Roles.VerifyRolesIntegrity()
    MemberData.SaveMemberData()
}