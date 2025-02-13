import { View,Text} from "react-native"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Acolyte, AcolyteData } from "../classes/AcolyteData";
import { CheckBox, TextButton, TextInputBox, UpperBar } from "../classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { OrganizeMemberArrayAlpha } from "../classes/Methods"
import { menuStore } from "../store/store";
import { MemberType } from "../classes/Member";
import { Coroinha, CoroinhaData } from "../classes/CoroinhaData";

export default function NewAcolyte(){
    const {theme, type} = menuStore()
    let currentData:any = type==MemberType.ACOLYTE ? new Acolyte() : new Coroinha()
    let typeName = type==MemberType.ACOLYTE ? "Acólito":"Coroinha" // "Acólito"/"Coroinha"
    return(
        
        <KeyboardAwareScrollView style={{flex:1,flexDirection:"column"}}>
                
                <UpperBar icon={require("@/src/app/item_icons/add_ico.png")}screenName={"-Novo "+typeName} backgroundColor={theme.accentColor}/>

                <TextInputBox 
                    title={"-Nome: "} 
                    enabled={true} 
                    onChangeText={(text:any)=>currentData.name=text.toString()} 
                    placeholder="Nome..."/>

                <TextInputBox 
                    title={"-Apelido: "} 
                    enabled={true} 
                    onChangeText={(text:any)=>currentData.nick=text.toString()} 
                    placeholder="Apelido..."/>

                <TextInputBox 
                    title={"-Responsável: "} 
                    enabled={type == MemberType.COROINHA} 
                    onChangeText={(text:any)=>currentData.parents=text.toString()}/>
                <TextInputBox 
                    title={"-Contato: "} 
                    enabled={true} 
                    keyboardType={"numeric"} 
                    onChangeText={(text:any)=>currentData.contact=text.toString()} 
                    placeholder="Contato..."/>
                
                <View style={{flex:0.1,backgroundColor:theme.secondary}}>
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
                            
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["1stWE"].sabado = !currentData.disp["1stWE"].sabado}}/>
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["1stWE"].domingoAM = !currentData.disp["1stWE"].domingoAM}}/>
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["1stWE"].domingoPM = !currentData.disp["1stWE"].domingoPM}}/>
                        </View>
                        
                        {/*SEGUNDO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Segundo</Text>
                            
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["2ndWE"].sabado = !currentData.disp["2ndWE"].sabado}}/>
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["2ndWE"].domingoAM = !currentData.disp["2ndWE"].domingoAM}}/>
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["2ndWE"].domingoPM = !currentData.disp["2ndWE"].domingoPM}}/>
                        </View>

                        {/*TERCEIRO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Terceiro</Text>
                            
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["3rdWE"].sabado = !currentData.disp["3rdWE"].sabado}}/>
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["3rdWE"].domingoAM = !currentData.disp["3rdWE"].domingoAM}}/>
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["3rdWE"].domingoPM = !currentData.disp["3rdWE"].domingoPM}}/>
                        </View>
                        
                        {/*QUARTO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Quarto</Text>
                            
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["4thWE"].sabado = !currentData.disp["4thWE"].sabado}}/>
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["4thWE"].domingoAM = !currentData.disp["4thWE"].domingoAM}}/>
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["4thWE"].domingoPM = !currentData.disp["4thWE"].domingoPM}}/>
                        </View>
                        
                        {/*QUINTO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Quinto</Text>
                            
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["5thWE"].sabado = !currentData.disp["5thWE"].sabado}}/>
                            <CheckBox checked={true} press = {()=>
                                {currentData.disp["5thWE"].domingoAM = !currentData.disp["5thWE"].domingoAM}}/>
                            <CheckBox checked={true}press = {()=>
                                {currentData.disp["5thWE"].domingoPM = !currentData.disp["5thWE"].domingoPM}}/>
                        </View>
                    </View>
                    
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Escalável?</Text>
                        <CheckBox checked={true}press = {()=>
                            {currentData.onLineup = !currentData.onLineup}}/>
                    </View>
                </View>
                
                <TextButton buttonStyle={{alignSelf:"center"}} text={"Adicionar "+typeName} press={()=>{SubmitNewMember(currentData,type)}}/>
        </KeyboardAwareScrollView>
    )
}

function SubmitNewMember(member:any,type:MemberType){
    let members:Array<any>
    let storageData:string

    if(type == MemberType.ACOLYTE){
        members = AcolyteData.allAcolytes
        storageData = "AcolyteData"
    }
    else if (type == MemberType.COROINHA){
        members = CoroinhaData.allCoroinhas
        storageData = "CoroinhaData"
    }
    if(members == null){
        members = []
    }

    let newMember:any = type==MemberType.ACOLYTE ? new Acolyte() : new Coroinha
    newMember.name = member.name
    newMember.nick = member.nick
    newMember.contact = member.contact
    newMember.disp = member.disp
    
    if(type == MemberType.COROINHA){
        newMember.parents = member.parents
    }

    members.push(newMember)
    members = OrganizeMemberArrayAlpha(members)
    AsyncStorage.setItem(storageData,JSON.stringify(members))

    if(type == MemberType.ACOLYTE){
        AcolyteData.allAcolytes = members
    }
    else if (type == MemberType.COROINHA){
        CoroinhaData.allCoroinhas = members
    }

    router.back()
}