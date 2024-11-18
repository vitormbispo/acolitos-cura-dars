import { View,Text,Image, TextInput } from "react-native"
import { Global } from "@/src/app/Global"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Coroinha, CoroinhaData } from "@/src/app/classes/CoroinhaData";
import { CheckBox, TextButton } from "@/src/app/classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { OrganizeMemberArrayAlpha } from "../../classes/Methods";


var currentData:Coroinha = new Coroinha()

export default function NewCoroinha(){
    Global.currentScreen = {screenName:"Novo coroinha",iconPath:""}
    currentData = new Coroinha()

    return(
        
        <KeyboardAwareScrollView style={{flex:1,flexDirection:"column"}}>
                
                <UpperBar/>

                <View style={{flexDirection:"row", padding:10,alignItems:"center"}}>
                 <Text style={{fontFamily:"Inter-Light",fontSize:22}}>-Nome:  </Text>
                    <TextInput 
                    style=
                    {{backgroundColor:"#9BFFF9",
                    fontSize:22,
                    fontFamily:"Inter-Regular",
                    width:200,
                    padding:10}}
                    
                    onChangeText={(text)=>currentData.name=text.toString()}></TextInput>
                </View>

                <View style={{flexDirection:"row", padding:10,alignItems:"center"}}>
                 <Text style={{fontFamily:"Inter-Light",fontSize:22}}>-Apelido:  </Text>
                    <TextInput 
                    style=
                    {{backgroundColor:"#9BFFF9",
                    fontSize:22,
                    fontFamily:"Inter-Regular",
                    width:200,
                    padding:10,}}
                    maxLength={12}
                    onChangeText={(text)=>currentData.nick=text.toString()}></TextInput>
                </View>

                <View style={{flexDirection:"row", padding:10,alignItems:"center"}}>
                 <Text style={{fontFamily:"Inter-Light",fontSize:22}}>-Responsável:  </Text>
                    <TextInput 
                    style=
                    {{backgroundColor:"#9BFFF9",
                    fontSize:22,
                    fontFamily:"Inter-Regular",
                    width:200,
                    padding:10,}}
                    maxLength={12}
                    onChangeText={(text)=>currentData.parents=text.toString()}></TextInput>
                </View>

                <View style={{flexDirection:"row", padding:10,alignItems:"center"}}>
                 <Text style={{fontFamily:"Inter-Light",fontSize:22}}>-Contato:  </Text>
                    <TextInput 
                    style=
                    {{backgroundColor:"#9BFFF9",
                    fontSize:22,fontFamily:"Inter-Regular",
                    width:200,padding:10}} 
                    
                    keyboardType="numeric"
                    onChangeText={(text)=>currentData.contact = text.toString()}></TextInput>
                </View>

                <View style={{flex:0.1,backgroundColor:"#fca4a4"}}>
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
                
                <TextButton buttonStyle={{alignSelf:"center"}} text="Adicionar acólito" press={SubmitNewCoroinha}/>
        </KeyboardAwareScrollView>
        
        


    )
}

function SubmitNewCoroinha(){
    if(CoroinhaData.allCoroinhas == null){
        CoroinhaData.allCoroinhas = []
    }

    let newCor = new Coroinha()
    newCor.name = currentData.name
    newCor.nick = currentData.nick
    newCor.contact = currentData.contact
    newCor.disp = currentData.disp
    newCor.parents = currentData.parents

    CoroinhaData.allCoroinhas = CoroinhaData.allCoroinhas.concat(newCor)
    OrganizeMemberArrayAlpha(CoroinhaData.allCoroinhas)
    AsyncStorage.setItem("CoroinhaData",JSON.stringify(CoroinhaData.allCoroinhas))

    router.back()
}


export const UpperBar = () => {
    return(
        <View style = {[Global.styles.rowContainer,{backgroundColor:"#fca4a4"}]}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            resizeMode:"contain"}}  source={require("@/src/app/item_icons/add_ico.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
        </View>
    )
}