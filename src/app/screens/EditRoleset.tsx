import { Modal, ScrollView, Text, View } from "react-native";
import { RowImageButton, TextButton, TextInputBox, UpperBar } from "../classes/NewComps";
import { useRef, useState } from "react";
import { ICONS } from "../classes/AssetManager";
import { contextStore, menuStore } from "../store/store";
import { textStyles, uiStyles } from "../styles/GeneralStyles";
import { Roles, RoleSet } from "../classes/Roles";
import { router } from "expo-router";
import { MemberType } from "../classes/MemberData";
import { AbbreviateText, DeepCopyObject } from "../classes/Methods";
import { ImageButton } from "../components/ImageButton";

export default function EditRoleset(){
    const [modalVisible,setModalVisible] = useState(false)
    
    const {type,theme} = menuStore()
    const {rolesetID} = contextStore()
    
    let setsArray:Array<RoleSet>

    switch (type){
        case MemberType.ACOLYTE:
            setsArray = Roles.acolyteRoleSets; break
        case MemberType.COROINHA:
            setsArray = Roles.coroinhaRoleSets; break
    }
    const [curSet] = useState(DeepCopyObject(setsArray[rolesetID]))  
    const [newSet,setNewSet] = useState(new RoleSet(curSet.name,curSet.type,curSet.set.slice(),curSet.isDefault))
    
    let rolesComps:Array<React.JSX.Element> = []
    
    for(let i = 0; i < newSet.set.length;i++){
        let newComp = <RowRole allRoles={newSet.set} role={newSet.set[i]} index={i} key={i} deleteAction={()=>{
            newSet.RemoveRole(newSet.set[i]);
            setNewSet(new RoleSet(newSet.name,newSet.type,newSet.set,newSet.isDefault))}}/>
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
                setsArray[rolesetID] = newSet
                Roles.SaveRolesets()
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
            <View style={{flex:1,justifyContent:"center"}}>
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
            </View>
            
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