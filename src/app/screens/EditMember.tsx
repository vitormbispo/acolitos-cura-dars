import { View,Text } from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GetMemberIcon } from "../../classes/NewComps";
import { router } from "expo-router";
import { AbbreviateText } from "../../classes/Util"
import { contextStore, menuStore } from "../../store/store";
import { MemberData } from "../../classes/MemberData";
import { Dates } from "../../classes/Dates";
import { PlaceAvailability, WeekendAvailability } from "./NewMember";
import { textStyles} from "../../styles/GeneralStyles";
import { ICONS } from "../../classes/AssetManager";
import { useRef, useState } from "react";
import { TextButton } from "../../components/buttons/TextButton";
import { CheckBox } from "../../components/input/CheckBox";
import { UpperBar } from "../../components/display/UpperBar";
import { UpperButton } from "../../components/buttons/UpperButton";
import { TextInputBox } from "../../components/input/TextInputBox";
import { DataSection } from "../../components/display/DataSection";
import { ConfirmationModal } from "../../components/input/ConfirmationModal";
import { Member } from "../../classes/members/Member";
import { MemberType } from "../../classes/members/MemberType";

export class EditMemberScreen{
    static id:number = 0
}

export default function EditMember(){
    const { theme,type } = menuStore()
    const { memberID } = contextStore()
    const [confirmDeleteVisible,setConfirmDeleteVisible] = useState(false)
    
    let members:Array<Member> = MemberData.FindMembersByType(type)
    let typeName:string

    const curMember = useRef(MemberData.FindMemberById(memberID).clone()) // É necessário criar uma cópia para edição. As mudanças só são aplicadas quando o usuário clica em "Concluir"

    let availabilities:Array<React.JSX.Element> = []
    for(let i = 0; i < Dates.defaultWeekends.length;i++){
        let curWeekend:string = Dates.defaultWeekends[i]
        let available:React.JSX.Element = <WeekendAvailability member={curMember.current} weekend={curWeekend} key={curWeekend+i}/>
        availabilities.push(available)
    }

    const originalName = curMember.current.name
    const originalNick = curMember.current.nick
    const [nameAvailable,setNameAvailable] = useState(true) // Estado apenas para avisos de nome indisponível
    const [nickAvailable,setNickAvailable] = useState(true) //

    return(
        <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
            <View style={{flexDirection:'row'}}>
                <UpperBar icon={GetMemberIcon()} screenName={AbbreviateText("Editando - "+curMember.current.nick,25)}/>
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
                    onChangeText={(text:any)=>curMember.current.name = text.toString()} 
                    placeholder="Nome..."
                    default={curMember.current.name}
                    onBlur={()=>{
                        if(curMember.current.name != originalName){
                            setNameAvailable(MemberData.IsNameAvailable(curMember.current.name,members))
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
                    onChangeText={(text:any)=>curMember.current.nick = text.toString()} 
                    placeholder="Apelido..."
                    default={curMember.current.nick}
                    onBlur={()=>{
                        if(curMember.current.nick != originalNick){
                            setNickAvailable(MemberData.IsNickAvailable(curMember.current.nick,members))
                        }
                        
                    }}/>

                <TextInputBox 
                    title={"-Responsável: "} 
                    enabled={type == MemberType.COROINHA} 
                    default={curMember.current.parents}
                    placeholder={curMember.current.parents}
                    onChangeText={(text:any)=>curMember.current.parents = text.toString()}/>
    
                <TextInputBox 
                    title={"-Contato: "} 
                    enabled={true} placeholder={curMember.current.contact} 
                    keyboardType="numeric"
                    default={curMember.current.contact}
                    onChangeText={(text:string)=>curMember.current.contact = text.toString()}/>
    

                <DataSection text={"- Disponibilidade -"} centered={true} />
                
                <Text style={textStyles.dataTitle}>- Local:</Text>
                <PlaceAvailability member={curMember.current}/>

                <Text style={textStyles.dataTitle}>- Dias e Horários:</Text>

                <View style={{paddingTop:40}}>              
                    <View style={{marginTop:30}}>             
                        {availabilities}
                    </View>
    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Disponível: </Text>
                        <CheckBox checked={curMember.current.availability.isAvailable()} press = {()=>
                            {curMember.current.availability.setAvailable(!curMember.current.availability.isAvailable())}
                            }/>
                    </View>
                </View>         
            </KeyboardAwareScrollView>
            {/*} Botão concluir {*/}
            <TextButton text="Concluir" textStyle={textStyles.textButtonText} buttonStyle={{alignSelf:"center"}} disabled={!(nickAvailable && nameAvailable)}
                press={()=>{
                    SaveChanges(curMember.current,memberID,type)
                }}/>

            <ConfirmationModal 
                visible={confirmDeleteVisible}
                confirmationText={"Deseja excluir o acólito \n"+"\""+curMember.current.nick+"\"?"} 
                confirmAction={()=>EraseMember(memberID)} 
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
    MemberData.UpdateMemberOnDB(curMember)
    router.back()
                    
}
/**
 * Apaga o membro com o determinado ID e volta à lista de membros
 * @param id índice do membro
 * @param type tipo de membro (MemberType)
 */
export function EraseMember(id:number){
    MemberData.DeleteMemberByIDOnDB(id)
    router.back()
    router.back()
}

