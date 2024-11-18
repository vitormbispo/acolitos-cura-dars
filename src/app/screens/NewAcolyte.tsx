import { View,Text,Image, TextInput } from "react-native"
import { Global } from "../Global"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Acolyte, AcolyteData } from "../classes/AcolyteData";
import { CheckBox, TextButton } from "../classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { OrganizeMemberArrayAlpha } from "../classes/Methods"


var currentData:Acolyte = new Acolyte()

export default function NewAcolyte(){
    Global.currentScreen = {screenName:"Novo acólito",iconPath:""}
    currentData = new Acolyte()

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
                 <Text style={{fontFamily:"Inter-Light",fontSize:22}}>-Contato:  </Text>
                    <TextInput 
                    style=
                    {{backgroundColor:"#9BFFF9",
                    fontSize:22,fontFamily:"Inter-Regular",
                    width:200,padding:10}} 
                    
                    keyboardType="numeric"
                    onChangeText={(text)=>currentData.contact = text.toString()}></TextInput>
                </View>

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
                
                <TextButton buttonStyle={{alignSelf:"center"}} text="Adicionar acólito" press={SubmitNewAcolyte}/>
        </KeyboardAwareScrollView>
        
        


    )
}

function SubmitNewAcolyte(){
    if(AcolyteData.allAcolytes == null){
        AcolyteData.allAcolytes = []
    }

    let newAco = new Acolyte()
    newAco.name = currentData.name
    newAco.nick = currentData.nick
    newAco.contact = currentData.contact
    newAco.disp = currentData.disp
    

    AcolyteData.allAcolytes = AcolyteData.allAcolytes.concat(newAco)
    AcolyteData.allAcolytes = OrganizeMemberArrayAlpha(AcolyteData.allAcolytes)
    AsyncStorage.setItem("AcolyteData",JSON.stringify(AcolyteData.allAcolytes))

    router.back()
}


export const UpperBar = () => {
    return(
        <View style = {Global.styles.rowContainer}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            resizeMode:"contain"}}  source={require("../item_icons/add_ico.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
        </View>
    )
}