import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { RowImageButton, TextButton, TextInputBox, UpperBar } from "../classes/NewComps";
import { useRef, useState } from "react";
import { ICONS } from "../classes/AssetManager";
import { menuStore } from "../store/store";
import { textStyles, uiStyles } from "../styles/GeneralStyles";
import { Roles} from "../classes/Roles";
import { router } from "expo-router";
import { ImageButton } from "../components/ImageButton";


export default function NewRoleset(){
    const [newSet,updateSet] = useState({name:"",roles:[]})
    const [modalVisible,setModalVisible] = useState(false)
    const {type,theme} = menuStore()
    let rolesComps:Array<React.JSX.Element> = []
    
    for(let i = 0; i < newSet.roles.length;i++){
        let newComp = <RowRole allRoles={newSet.roles} role={newSet.roles[i]} index={i} key={i} deleteAction={()=>{newSet.roles.splice(i,1); router.replace("/screens/NewRoleset")}}/>
        rolesComps.push(newComp)
    }

    return(
        <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
            <UpperBar icon={ICONS.acolito} screenName={"Novo conjunto"}/>
            <TextInputBox title={"Nome: "} placeholder="Conjunto..." onChangeText={(text)=>{newSet.name=text}}/>
            <RowImageButton img={ICONS.acolito} text={"Adicionar função..."} press={()=>{
                setModalVisible(!modalVisible)
            }}
            />
            <AddModal visible={modalVisible} roles={newSet.roles} requestClose={()=>{setModalVisible(!modalVisible)}} onSubmit={()=>setModalVisible(!modalVisible)}/>
            
            <ScrollView style={{flex:1}}>
                {rolesComps}
            </ScrollView>
            
            <TextButton  buttonStyle={{margin:30}}text={"Concluir"} press={()=>{
                Roles.AddRoleSet(newSet.name,newSet.roles,type)
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