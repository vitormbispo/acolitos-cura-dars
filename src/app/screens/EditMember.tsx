import { View,Text, TextInput } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Acolyte, AcolyteData } from "../classes/AcolyteData";
import { CheckBox, GetMemberIcon, TextButton, UpperBar, UpperButton, TextInputBox } from "../classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { OrganizeMemberArrayAlpha, GetMemberTypeIndex, GetMemberByName} from "../classes/Methods"
import { contextStore, menuStore } from "../store/store";
import { Coroinha, CoroinhaData } from "../classes/CoroinhaData";
import { MemberType } from "../classes/Member";
import { uiStyles } from "../styles/GeneralStyles";
import { MemberProfileScreen } from "./MemberProfile";
import { loadAcolyteData } from "..";



export class EditMemberScreen{
    static id:number = 0
}

export default function EditMember(){
    const {theme,type} = menuStore()
    const {memberID,updateMemberID} = contextStore()
    let originalMembers = type == MemberType.ACOLYTE ? AcolyteData.allAcolytes : CoroinhaData.allCoroinhas
    let curMember = JSON.parse(JSON.stringify(originalMembers))[memberID] // É necessário criar uma cópia para edição. As mudanças só são aplicadas quando o usuário clica em "Concluir"

    return(
        
        <KeyboardAwareScrollView style={{flex:1,flexDirection:"column"}}>
                
                <View style={{flexDirection:'row'}}>
                    <UpperBar icon={GetMemberIcon()} screenName={"Editando - "+curMember.nick}/>
                    <UpperButton img={require("@/src/app/shapes/delete_ico.png")} press={()=>{EraseMember(memberID,type)}} backgroundColor={theme.accentColor}/>
                </View>
                
                <TextInputBox 
                    title={"-Nome: "} 
                    enabled={true} 
                    default={curMember.name} 
                    onChangeText={(text:string)=>curMember.name=text.toString()}/>

                <TextInputBox 
                    title={"-Apelido: "} 
                    enabled={true} 
                    default={curMember.nick} 
                    onChangeText={(text:string)=>curMember.nick=text.toString()}
                    maxLength={12}/>

                <TextInputBox 
                    title={"-Responsável: "} 
                    enabled={type == MemberType.COROINHA} 
                    default={curMember.parents}
                    onChangeText={(text:any)=>curMember.parents=text.toString()}/>

                <TextInputBox 
                    title={"-Contato: "} 
                    enabled={true} default={curMember.contact} 
                    keyboardType="numeric" 
                    onChangeText={(text:string)=>curMember.contact = text.toString()}/>

                
                <View style={{flex:0.1,backgroundColor:"#FFEBA4"}}>
                    <Text style={{fontFamily:"Inther-Bold",padding:20,alignSelf:"center",fontSize:24}}>-Disponibilidade-</Text>
                </View>
                
                <View style={{paddingTop:20}}>
                    <View style={{flexDirection:"row",alignContent:"space-between",paddingLeft:90}}>
                        <Text style={{flex:1}}>Sábado - 19h</Text>
                        <Text style={{flex:1}}>Domingo - 08h</Text>
                        <Text style={{flex:1}}>Domingo - 19h</Text>
                    </View>
                    
                    <View>
                        
                        {/*PRIMEIRO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Primeiro</Text>
                            
                            <CheckBox checked={curMember.disp["1stWE"].sabado} press = {()=>
                                {curMember.disp["1stWE"].sabado = !curMember.disp["1stWE"].sabado}}/>
                            <CheckBox checked={curMember.disp["1stWE"].domingoAM} press = {()=>
                                {curMember.disp["1stWE"].domingoAM = !curMember.disp["1stWE"].domingoAM}}/>
                            <CheckBox checked={curMember.disp["1stWE"].domingoPM} press = {()=>
                                {curMember.disp["1stWE"].domingoPM = !curMember.disp["1stWE"].domingoPM}}/>
                        </View>
                        
                        {/*SEGUNDO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Segundo</Text>
                            
                            <CheckBox checked={curMember.disp["2ndWE"].sabado} press = {()=>
                                {curMember.disp["2ndWE"].sabado = !curMember.disp["2ndWE"].sabado}}/>
                            <CheckBox checked={curMember.disp["2ndWE"].domingoAM} press = {()=>
                                {curMember.disp["2ndWE"].domingoAM = !curMember.disp["2ndWE"].domingoAM}}/>
                            <CheckBox checked={curMember.disp["2ndWE"].domingoPM} press = {()=>
                                {curMember.disp["2ndWE"].domingoPM = !curMember.disp["2ndWE"].domingoPM}}/>
                        </View>

                        {/*TERCEIRO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Terceiro</Text>
                            
                            <CheckBox checked={curMember.disp["3rdWE"].sabado} press = {()=>
                                {curMember.disp["3rdWE"].sabado = !curMember.disp["3rdWE"].sabado}}/>
                            <CheckBox checked={curMember.disp["3rdWE"].domingoAM} press = {()=>
                                {curMember.disp["3rdWE"].domingoAM = !curMember.disp["3rdWE"].domingoAM}}/>
                            <CheckBox checked={curMember.disp["3rdWE"].domingoPM} press = {()=>
                                {curMember.disp["3rdWE"].domingoPM = !curMember.disp["3rdWE"].domingoPM}}/>
                        </View>
                        
                        {/*QUARTO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Quarto</Text>
                            
                            <CheckBox checked={curMember.disp["4thWE"].sabado} press = {()=>
                                {curMember.disp["4thWE"].sabado = !curMember.disp["4thWE"].sabado}}/>
                            <CheckBox checked={curMember.disp["4thWE"].domingoAM} press = {()=>
                                {curMember.disp["4thWE"].domingoAM = !curMember.disp["4thWE"].domingoAM}}/>
                            <CheckBox checked={curMember.disp["4thWE"].domingoPM} press = {()=>
                                {curMember.disp["4thWE"].domingoPM = !curMember.disp["4thWE"].domingoPM}}/>
                        </View>
                        
                        {/*QUINTO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Quinto</Text>
                            
                            <CheckBox checked={curMember.disp["5thWE"].sabado} press = {()=>
                                {curMember.disp["5thWE"].sabado = !curMember.disp["5thWE"].sabado}}/>
                            <CheckBox checked={curMember.disp["5thWE"].domingoAM} press = {()=>
                                {curMember.disp["5thWE"].domingoAM = !curMember.disp["5thWE"].domingoAM}}/>
                            <CheckBox checked={curMember.disp["5thWE"].domingoPM} press = {()=>
                                {curMember.disp["5thWE"].domingoPM = !curMember.disp["5thWE"].domingoPM}}/>
                        </View>
  
                    </View>

                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Escalável?</Text>
                        <CheckBox checked={curMember.onLineup}press = {()=>
                            {curMember.onLineup = !curMember.onLineup}}/>
                    </View>
                </View>
                
                {/*} Botão concluir {*/}
                <TextButton buttonStyle={{alignSelf:"center"}} text="Concluir" press={()=>{
                    let storageData:string // Nome da chave do AsyncStorage
                    let members:Array<any> // Lista de todos os acólitos ou coroinhas

                    if(type == MemberType.ACOLYTE){
                        members = AcolyteData.allAcolytes
                        storageData = "AcolyteData"    
                    }
                    else if(type == MemberType.COROINHA){
                        members = CoroinhaData.allCoroinhas
                        storageData = "CoroinhaData"    
                    }
                    
                    members[memberID] = curMember
                    members = OrganizeMemberArrayAlpha(members)

                    AsyncStorage.setItem(storageData,JSON.stringify(members))
                    router.back()
                    
                    }}/>          
        </KeyboardAwareScrollView>
    )
}

/**
 * Apaga o membro com o determinado ID e volta à lista de membros
 * @param id índice do membro
 * @param type tipo de membro (MemberType)
 */
export function EraseMember(id:number,type:MemberType){
    let members:Array<Acolyte|Coroinha>
    let data:string

    if(type == MemberType.ACOLYTE){
        members = AcolyteData.allAcolytes
        data = "AcolyteData"
    }
    else{
        members = CoroinhaData.allCoroinhas
        data = "CoroinhaData"
    }

    members.splice(id,1)
    members = OrganizeMemberArrayAlpha(members)
    AsyncStorage.setItem(data,JSON.stringify(members))
    router.back()
    router.back()
}


