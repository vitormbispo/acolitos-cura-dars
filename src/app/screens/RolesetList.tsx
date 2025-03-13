import { View, Image, Text, Pressable } from "react-native";
import { ImageButton, RowImageButton, UpperBar } from "../classes/NewComps";
import { ICONS } from "../classes/AssetManager";
import { menuStore } from "../store/store";
import { MemberType } from "../classes/MemberData";
import { Roles, RoleSet } from "../classes/Roles";
import { router } from "expo-router";
import { uiStyles } from "../styles/GeneralStyles";
import { useState } from "react";
export default function RolesetList(){
    
    const {type} = menuStore()
    const [rolesets,setRolesets] = useState({set:[]})
    let setsComps = []
    switch(type){
        case MemberType.ACOLYTE:
            rolesets.set = Roles.acolyteRoleSets; break
        case MemberType.COROINHA:
            rolesets.set = Roles.coroinhaRoleSets;break
    }
    
    // TODO Remover esse rerender forçado
    for(let i = 0; i < rolesets.set.length; i++){
        let newComp = <RowRoleset name={rolesets.set[i].name} index={i} roleset={rolesets.set[i]} deleteAction={()=>{
            rolesets.set.splice(i,1)
            router.replace("/screens/RolesetList")
        }}/>
        setsComps.push(newComp)
    }

    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.acolito} screenName={"Funções"}/>
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
    index:number
    roleset:RoleSet
    deleteAction: (...args:any) => any
}
function RowRoleset(props:RowRolesetProps){
    return(
        <Pressable style={{alignContent:"center",alignItems:"center",flexDirection:"row",height:"15%",width:"100%",backgroundColor:"#FFFFFF"}} onPress={()=>{

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