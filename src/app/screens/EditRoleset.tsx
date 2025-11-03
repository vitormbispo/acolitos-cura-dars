import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useRef, useState } from "react";
import { ICONS } from "../../classes/AssetManager";
import { contextStore, menuStore } from "../../store/store";
import { textStyles, uiStyles } from "../../styles/GeneralStyles";
import { router } from "expo-router";
import { AbbreviateText } from "../../classes/Util";
import { ImageButton } from "../../components/buttons/ImageButton";
import { RowImageButton } from "../../components/buttons/RowImageButton";
import { TextButton } from "../../components/buttons/TextButton";
import { UpperBar } from "../../components/display/UpperBar";
import { TextInputBox } from "../../components/input/TextInputBox";
import { RoleSet } from "../../classes/roles/RoleSet";
import { RolesData } from "../../classes/roles/RolesData";

export default function EditRoleset(){
    const [modalVisible,setModalVisible] = useState(false)
    
    const {theme} = menuStore()
    const {rolesetID} = contextStore()

    const [curSet] = useState(RolesData.GetRoleSetByID(rolesetID).clone())
    console.log("Cur set: "+curSet.name)
    const [newSet,setNewSet] = useState(curSet.clone())
    
    let rolesComps:Array<React.JSX.Element> = []
    
    for(let i = 0; i < newSet.set.length;i++){
        let newComp = <RowRole allRoles={newSet.set} role={newSet.set[i]} index={i} key={i} deleteAction={()=>{
            newSet.RemoveRole(newSet.set[i]);
            setNewSet(newSet.clone())}}/>
        rolesComps.push(newComp)
    }

    return(
        <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
            <UpperBar icon={ICONS.acolito} screenName={AbbreviateText("Conjunto: "+newSet.name,25)}/>
            <TextInputBox title={"Nome: "} default={newSet.name} onChangeText={(text)=>{newSet.name=text}}/>
            <RowImageButton img={ICONS.acolito} text={"Adicionar..."} press={()=>{
                setModalVisible(!modalVisible)
            }}
            />
            <AddModal visible={modalVisible} roles={newSet.set} requestClose={()=>{setModalVisible(!modalVisible)}} onSubmit={()=>setModalVisible(!modalVisible)}/>
            
            <ScrollView style={{flex:1}}>
                {rolesComps}
            </ScrollView>
            
            <TextButton  buttonStyle={{margin:30}}text={"Concluir"} press={()=>{
                RolesData.UpdateRoleset(newSet)
                router.back()
            }}/>
        </View>
    )
}

type AddModalProps = {
    visible:boolean
    roles:Array<string>
    requestClose?:(...args:any) => any
    onSubmit?:(...args:any) => any
}
/**
 * Modal para adicionar um novo RoleSet
 * @param props visible = visível; roles = funções do RoleSet; 
 * requestClose ?= ação ao solicitar fechamento do modal; onSubmit ?= ação ao confirmar.
 */
function AddModal(props:AddModalProps){
    const {theme} = menuStore()
    
    const roleName = useRef("")
    return(
        <Modal visible={props.visible} animationType="fade" transparent={true} onRequestClose={()=>{props.requestClose != undefined ? props.requestClose() : null}}>
            <Pressable style={{flex:1,justifyContent:"center"}} onPress={()=>{props.requestClose()}}>
                <View style={{alignSelf:"center",justifyContent:"center",height:"40%",width:"80%",backgroundColor:theme.accentColor,borderRadius:50}}>
                    
                    <TextInputBox title={"Nome da função: "} boxBelow={true} placeholder="Função..." onChangeText={(text)=>{roleName.current=text}}/>
                    <TextButton text={"Concluir"} press={()=>{;
                        if(roleName.current != "" && roleName.current != undefined && roleName.current != null){
                            props.roles.push(roleName.current)
                            props.visible = false
                            roleName.current = ""
                        }
                        else{
                            console.error("Invalid role name.")
                        }
                        props.onSubmit != undefined ? props.onSubmit() : null
                    }}/>
                </View>
            </Pressable>
            
        </Modal>
    )
}

type RowRoleProps = {
    role:string
    allRoles:Array<string>
    index:number
    deleteAction?:(...args:any) => any
}
/**
 * Botão de um RoleSet
 * @param props role=função; allRoles = todas as funções do conjunto; 
 * index = índice da função; deleteAction ?= ação ao deletar
 */
function RowRole(props:RowRoleProps){
    return(
        <View style={{flexDirection:"row",minHeight:"10%"}}>
            <Text style={textStyles.dataSection}>{props.role}</Text>
            <ImageButton img={ICONS.delete} imgStyle={uiStyles.buttonIconSmall} press={()=>{
                props.deleteAction()

            }}/>
        </View>
    )
}