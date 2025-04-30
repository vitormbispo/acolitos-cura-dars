import { View,Text } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CheckBox, GetMemberIcon, TextButton, UpperBar, UpperButton, TextInputBox, ConfirmationModal, TextCheckBox, DataSection } from "../classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { AbbreviateText, GetMemberArray, OrganizeMemberArrayAlpha} from "../classes/Methods"
import { contextStore, menuStore } from "../store/store";
import { Member, MemberData, MemberType } from "../classes/MemberData";
import { Dates } from "../classes/Dates";
import { PlaceAvailability, WeekendAvailability } from "./NewMember";
import { textStyles} from "../styles/GeneralStyles";
import { ICONS } from "../classes/AssetManager";
import { useState } from "react";

export class EditMemberScreen{
    static id:number = 0
}

export default function EditMember(){
    const { theme,type } = menuStore()
    const { memberID } = contextStore()
    const [confirmDeleteVisible,setConfirmDeleteVisible] = useState(false)
    
    let members:Array<Member> = []
    let typeName:string

    switch (type){
        case MemberType.ACOLYTE:
            typeName = "Acólito"
            members = MemberData.allAcolytes
            break
        case MemberType.COROINHA:
            typeName = "Coroinha"
            members = MemberData.allCoroinhas
            break
    }

    let curMember:Member = JSON.parse(JSON.stringify(members))[memberID] // É necessário criar uma cópia para edição. As mudanças só são aplicadas quando o usuário clica em "Concluir"

    let availabilities:Array<React.JSX.Element> = []
    for(let i = 0; i < Dates.defaultWeekends.length;i++){
        let curWeekend:string = Dates.defaultWeekends[i]
        let available:React.JSX.Element = <WeekendAvailability member={curMember} weekend={curWeekend} key={curWeekend+i}/>
        availabilities.push(available)
    }

    const originalName = curMember.name
    const originalNick = curMember.nick
    const [nameAvailable,setNameAvailable] = useState(true) // Estado apenas para avisos de nome indisponível
    const [nickAvailable,setNickAvailable] = useState(true) //

    return(
        <View style={{flex:1}}>
            <View style={{flexDirection:'row'}}>
                <UpperBar icon={GetMemberIcon()} screenName={AbbreviateText("Editando - "+curMember.nick,25)}/>
                <UpperButton img={ICONS.delete} press={()=>{
                    setConfirmDeleteVisible(!confirmDeleteVisible)
                }}
                        
                    backgroundColor={theme.accentColor}/>
            </View>

            <KeyboardAwareScrollView style={{flex:1,flexDirection:"column"}}>
                
                
            {!nameAvailable ? 
                <Text style={
                    [textStyles.dataTitle,{color:theme.reject}]}>Já existe um {typeName.toLocaleLowerCase()} com esse nome!</Text>
                    :
                    null
            }
            <TextInputBox 
                title={"-Nome: "} 
                enabled={true} 
                onChangeText={(text:any)=>curMember.name=text.toString()} 
                placeholder="Nome..."
                default={curMember.name}
                onBlur={()=>{
                    if(curMember.name != originalName){
                        setNameAvailable(MemberData.IsNameAvailable(curMember.name,members))
                    }
                    
                }}/>

            {!nickAvailable ? 
                <Text style={
                    [textStyles.dataTitle,{color:theme.reject}]}>Já existe um {typeName.toLocaleLowerCase()} com esse apelido!</Text>
                    :
                    null
            }
            <TextInputBox 
                title={"-Apelido: "} 
                enabled={true} 
                maxLength={20}
                onChangeText={(text:any)=>curMember.nick=text.toString()} 
                placeholder="Apelido..."
                default={curMember.nick}
                onBlur={()=>{
                    if(curMember.nick != originalNick){
                        setNickAvailable(MemberData.IsNickAvailable(curMember.nick,members))
                    }
                    
                }}/>

    
                <TextInputBox 
                    title={"-Responsável: "} 
                    enabled={type == MemberType.COROINHA} 
                    default={curMember.parents}
                    placeholder={curMember.parents}
                    onChangeText={(text:any)=>curMember.parents=text.toString()}/>
    
                <TextInputBox 
                    title={"-Contato: "} 
                    enabled={true} placeholder={curMember.contact} 
                    keyboardType="numeric"
                    default={curMember.contact}
                    onChangeText={(text:string)=>curMember.contact = text.toString()}/>
    
                
                <DataSection text={"- Disponibilidade -"} centered={true} />
                
                <Text style={textStyles.dataTitle}>- Local:</Text>
                <PlaceAvailability member={curMember}/>
                {/** */}
    
                <View style={{paddingTop:20}}>              
                    <View style={{marginTop:30}}>             
                        {availabilities}
                    </View>
    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Disponível: </Text>
                        <CheckBox checked={curMember.onLineup}press = {()=>
                            {curMember.onLineup = !curMember.onLineup}}/>
                    </View>
                </View>         
            </KeyboardAwareScrollView>
            {/*} Botão concluir {*/}
            <TextButton text="Concluir" textStyle={textStyles.textButtonText} buttonStyle={{alignSelf:"center"}} disabled={!(nickAvailable && nameAvailable)}
                press={()=>{
                    SaveChanges(curMember,memberID,type)
                }}/>

            <ConfirmationModal 
                visible={confirmDeleteVisible}
                confirmationText={"Deseja excluir o acólito \n"+"\""+curMember.nick+"\"?"} 
                confirmAction={()=>EraseMember(memberID,type)} 
                declineAction={()=>{setConfirmDeleteVisible(!confirmDeleteVisible)}}
                requestClose={()=>(setConfirmDeleteVisible(!confirmDeleteVisible))}
            /> 
        </View>
        
    )
}
/**
 * Salva as alterações feitas no membro.
 *  
 * @param memberID ID do membro original
 * @param curMember Membro editado
 * @param type Tipo do membro
 */ 
export function SaveChanges(curMember:Member,memberID:number,type:MemberType){
    let storageData:string // Nome da chave do AsyncStorage
    let members:Array<any> // Lista de todos os acólitos ou coroinhas
    
    if(type == MemberType.ACOLYTE){
        members = MemberData.allAcolytes
        storageData = "AcolyteData"    
    }
    else if(type == MemberType.COROINHA){
        members = MemberData.allCoroinhas
        storageData = "CoroinhaData"    
    }
    
    members[memberID] = curMember
    members = OrganizeMemberArrayAlpha(members)

    AsyncStorage.setItem(storageData,JSON.stringify(members))
    router.back()
                    
}
/**
 * Apaga o membro com o determinado ID e volta à lista de membros
 * @param id índice do membro
 * @param type tipo de membro (MemberType)
 */
export function EraseMember(id:number,type:MemberType){
    let members:Array<Member> = GetMemberArray(type)
    let data:string

    switch (type){
        case MemberType.ACOLYTE:
            data = "AcolyteData";break
        case MemberType.COROINHA:
            data = "CoroinhaData";break
    }

    members.splice(id,1)
    members = OrganizeMemberArrayAlpha(members)
    AsyncStorage.setItem(data,JSON.stringify(members))
    router.back()
    router.back()
}

