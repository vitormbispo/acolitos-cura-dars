import { View,Text,Image, TextInput, Modal } from "react-native"
import { Global } from "@/src/app/Global"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CoroinhaData } from "@/src/app/classes/CoroinhaData";
import { CheckBox, DeepCopyArray, ImageButton, LinkImageButton, RowImageButton, TextButton } from "@/src/app/classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import { Coroinha } from "@/src/app/classes/CoroinhaData";


var currentData:Coroinha = new Coroinha()
export class EditCoroinhaScreen{
    static id:number = 0
}

export default function EditAcolyte(){
    
    let coroinhasClone = JSON.parse(JSON.stringify(CoroinhaData.allCoroinhas))
    currentData = coroinhasClone[EditCoroinhaScreen.id]
    let curCor = coroinhasClone[EditCoroinhaScreen.id]
    Global.currentScreen = {screenName:"Editando - "+curCor.nick,iconPath:""}
    

    const navigation = useNavigation()

    let [popupVisible,setPopupVisible] = useState(true)
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
                    defaultValue={curCor.name}
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
                    padding:10}}
                    defaultValue={curCor.nick}
                    onChangeText={(text)=>currentData.nick=text.toString()}
                    maxLength={12}></TextInput>
                </View>

                <View style={{flexDirection:"row", padding:10,alignItems:"center"}}>
                 <Text style={{fontFamily:"Inter-Light",fontSize:22}}>-Responsável:  </Text>
                    <TextInput 
                    style=
                    {{backgroundColor:"#9BFFF9",
                    fontSize:22,fontFamily:"Inter-Regular",
                    width:200,padding:10}} 
                    defaultValue={curCor.parents}
                    onChangeText={(text)=>currentData.parents = text.toString()}></TextInput>
                </View>

                <View style={{flexDirection:"row", padding:10,alignItems:"center"}}>
                 <Text style={{fontFamily:"Inter-Light",fontSize:22}}>-Contato:  </Text>
                    <TextInput 
                    style=
                    {{backgroundColor:"#9BFFF9",
                    fontSize:22,fontFamily:"Inter-Regular",
                    width:200,padding:10}} 
                    defaultValue={curCor.contact}
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
                            
                            <CheckBox checked={currentData.disp["1stWE"].sabado} press = {()=>
                                {currentData.disp["1stWE"].sabado = !currentData.disp["1stWE"].sabado}}/>
                            <CheckBox checked={currentData.disp["1stWE"].domingoAM} press = {()=>
                                {currentData.disp["1stWE"].domingoAM = !currentData.disp["1stWE"].domingoAM}}/>
                            <CheckBox checked={currentData.disp["1stWE"].domingoPM} press = {()=>
                                {currentData.disp["1stWE"].domingoPM = !currentData.disp["1stWE"].domingoPM}}/>
                        </View>
                        
                        {/*SEGUNDO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Segundo</Text>
                            
                            <CheckBox checked={currentData.disp["2ndWE"].sabado} press = {()=>
                                {currentData.disp["2ndWE"].sabado = !currentData.disp["2ndWE"].sabado}}/>
                            <CheckBox checked={currentData.disp["2ndWE"].domingoAM} press = {()=>
                                {currentData.disp["2ndWE"].domingoAM = !currentData.disp["2ndWE"].domingoAM}}/>
                            <CheckBox checked={currentData.disp["2ndWE"].domingoPM} press = {()=>
                                {currentData.disp["2ndWE"].domingoPM = !currentData.disp["2ndWE"].domingoPM}}/>
                        </View>

                        {/*TERCEIRO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Terceiro</Text>
                            
                            <CheckBox checked={currentData.disp["3rdWE"].sabado} press = {()=>
                                {currentData.disp["3rdWE"].sabado = !currentData.disp["3rdWE"].sabado}}/>
                            <CheckBox checked={currentData.disp["3rdWE"].domingoAM} press = {()=>
                                {currentData.disp["3rdWE"].domingoAM = !currentData.disp["3rdWE"].domingoAM}}/>
                            <CheckBox checked={currentData.disp["3rdWE"].domingoPM} press = {()=>
                                {currentData.disp["3rdWE"].domingoPM = !currentData.disp["3rdWE"].domingoPM}}/>
                        </View>
                        
                        {/*QUARTO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Quarto</Text>
                            
                            <CheckBox checked={currentData.disp["4thWE"].sabado} press = {()=>
                                {currentData.disp["4thWE"].sabado = !currentData.disp["4thWE"].sabado}}/>
                            <CheckBox checked={currentData.disp["4thWE"].domingoAM} press = {()=>
                                {currentData.disp["4thWE"].domingoAM = !currentData.disp["4thWE"].domingoAM}}/>
                            <CheckBox checked={currentData.disp["4thWE"].domingoPM} press = {()=>
                                {currentData.disp["4thWE"].domingoPM = !currentData.disp["4thWE"].domingoPM}}/>
                        </View>
                        
                        {/*QUINTO FINAL DE SEMANA*/}
                        <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                            <Text style={{padding:10,flex:1}}>Quinto</Text>
                            
                            <CheckBox checked={currentData.disp["5thWE"].sabado} press = {()=>
                                {currentData.disp["5thWE"].sabado = !currentData.disp["5thWE"].sabado}}/>
                            <CheckBox checked={currentData.disp["5thWE"].domingoAM} press = {()=>
                                {currentData.disp["5thWE"].domingoAM = !currentData.disp["5thWE"].domingoAM}}/>
                            <CheckBox checked={currentData.disp["5thWE"].domingoPM} press = {()=>
                                {currentData.disp["5thWE"].domingoPM = !currentData.disp["5thWE"].domingoPM}}/>
                        </View>
                         
                    </View>

                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Escalável?</Text>
                        <CheckBox checked={currentData.onLineup}press = {()=>
                            {currentData.onLineup = !currentData.onLineup}}/>
                    </View>

                </View>
                
                <TextButton buttonStyle={{alignSelf:"center"}} text="Concluir" press={()=>{
                    CoroinhaData.allCoroinhas[EditCoroinhaScreen.id] = currentData
                    AsyncStorage.setItem("CoroinhaData",JSON.stringify(CoroinhaData.allCoroinhas))
                    router.back()
                    
                    }}/>
                

                
                
        </KeyboardAwareScrollView>
        
        


    )
}


export const UpperBar = () => {
    const navigation = useNavigation()
    return(
        <View style = {{flex:0.1,
            flexDirection:"row",
            alignContent:"center",
            alignItems:"center",
            backgroundColor: "#fca4a4",
            padding:10}}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            resizeMode:"contain"}}  source={require("@/src/app/shapes/add_coroinha.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
            
            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
                <ImageButton img={require("@/src/app/shapes/delete_ico.png")} imgStyle={[Global.styles.buttonIcons,{width:48}]} press={()=>{EraseCoroinha(EditCoroinhaScreen.id)}}/>
            </View>
        </View>
    )
}

export function EraseCoroinha(id:number){
    CoroinhaData.allCoroinhas.splice(id,1)
    AsyncStorage.setItem("CoroinhaData",JSON.stringify(CoroinhaData.allCoroinhas))
    router.back()
    router.back()
}