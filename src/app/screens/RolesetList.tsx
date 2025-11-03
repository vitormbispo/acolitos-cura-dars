import { View, Image, Text, Pressable } from "react-native";
import { ICONS } from "../../classes/AssetManager";
import { contextStore, menuStore } from "../../store/store";
import { router } from "expo-router";
import { uiStyles } from "../../styles/GeneralStyles";
import { useState } from "react";
import { ImageButton } from "../../components/buttons/ImageButton";
import { RowImageButton } from "../../components/buttons/RowImageButton";
import { UpperBar } from "../../components/display/UpperBar";
import { RolesData } from "../../classes/roles/RolesData";
import { RoleSetRepository } from "../../classes/repository/RoleSetRepository";
import { RoleSet } from "../../classes/roles/RoleSet";
export default function RolesetList(){
    
    const {type,theme} = menuStore()
    const [rolesets,setRolesets] = useState({set:[]})
    let setsComps = []

    rolesets.set = RolesData.GetRoleSetsByType(type)
    
    for(let i = 0; i < rolesets.set.length; i++){
        let newComp = 
        <RowRoleset name={rolesets.set[i].name} id={rolesets.set[i].id} roleset={rolesets.set[i]} key={rolesets.set[i].name+i} deleteAction={()=>{
            rolesets.set.splice(i,1)
            RoleSetRepository.DeleteRoleSetByID(rolesets.set[i].id)
            setRolesets({set:rolesets.set})
        }}/>
        setsComps.push(newComp)
    }

    return(
        <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
            <UpperBar icon={ICONS.acolito} screenName={"Funções"} toggleEnabled={true}/>
            <RowImageButton img={ICONS.acolito} text={"Adicionar novo conjunto"} press={()=>{
                router.push("/screens/NewRoleset")
            }}/>
            <View style={{flex:1}}>
                {setsComps}
            </View>
            
        </View>
    )
}

type RowRolesetProps = {
    name:string
    id:number
    roleset:RoleSet
    deleteAction: (...args:any) => any
}
function RowRoleset(props:RowRolesetProps){
    const {updateRolesetID} = contextStore()
    return(
        <Pressable style={{alignContent:"center",alignItems:"center",flexDirection:"row",height:"15%",width:"100%",backgroundColor:"#FFFFFF"}} onPress={()=>{
            updateRolesetID(props.id)
            router.push("/screens/EditRoleset")
        }}>
            <Image style={uiStyles.buttonIcon} source={ICONS.acolito}/>
            <Text>{props.name}</Text>
            <View style={{flex:1}}/>
            
            {!props.roleset.isDefault ? 
            <ImageButton buttonStyle={{alignSelf:"center"}}imgStyle={[uiStyles.buttonIcon]} img={ICONS.delete} press={()=>{
                props.deleteAction()
            }}/> 
            : null}
            
        </Pressable>
    )
}