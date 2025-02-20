import { View,Text} from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CheckBox, GetMemberIcon, TextButton, UpperBar, UpperButton, TextInputBox } from "../classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { OrganizeMemberArrayAlpha} from "../classes/Methods"
import { contextStore, menuStore } from "../store/store";
import { Member, MemberData, MemberType } from "../classes/MemberData";
import { Dates } from "../classes/Dates";
import { WeekendAvailability } from "./NewMember";

export class EditMemberScreen{
    static id:number = 0
}

export default function EditMember(){
    const { theme,type } = menuStore()
    const { memberID } = contextStore()
    let originalMembers = type == MemberType.ACOLYTE ? MemberData.allAcolytes : MemberData.allCoroinhas
    let curMember = JSON.parse(JSON.stringify(originalMembers))[memberID] // É necessário criar uma cópia para edição. As mudanças só são aplicadas quando o usuário clica em "Concluir"

   let availabilities:Array<React.JSX.Element> = []
    for(let i = 0; i < Dates.defaultWeekends.length;i++){
        let curWeekend:string = Dates.defaultWeekends[i]
        let available:React.JSX.Element = <WeekendAvailability member={curMember} weekend={curWeekend} key={curWeekend+i}/>
        availabilities.push(available)
    }

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
                    {availabilities}
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
    let members:Array<Member>
    let data:string

    if(type == MemberType.ACOLYTE){
        members = MemberData.allAcolytes
        data = "AcolyteData"
    }
    else{
        members = MemberData.allCoroinhas
        data = "CoroinhaData"
    }

    members.splice(id,1)
    members = OrganizeMemberArrayAlpha(members)
    AsyncStorage.setItem(data,JSON.stringify(members))
    router.back()
    router.back()
}


