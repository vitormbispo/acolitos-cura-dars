import { View,Text,Image, TextInput, Modal } from "react-native"
import { Global } from "../Global"
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Acolyte, AcolyteData } from "../classes/AcolyteData";
import { CheckBox, DeepCopyArray, ImageButton, LinkImageButton, RowImageButton, TextButton } from "../classes/NewComps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import { OrganizeAcolyteArrayAlpha, GetAcolyteByName, GetAcolyteIndex} from "../classes/Methods"
import AcolyteProfile, { AcolyteProfileScreen } from "./AcolyteProfile";


var currentData:Acolyte = new Acolyte()
export class EditAcolyteScreen{
    static id:number = 0
}

export default function EditAcolyte(){
    
    let acolytesClone = JSON.parse(JSON.stringify(AcolyteData.allAcolytes))
    currentData = acolytesClone[EditAcolyteScreen.id]
    let curAco = acolytesClone[EditAcolyteScreen.id]
    Global.currentScreen = {screenName:"Editando - "+curAco.nick,iconPath:""}
    

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
                    defaultValue={curAco.name}
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
                    defaultValue={curAco.nick}
                    onChangeText={(text)=>currentData.nick=text.toString()}
                    maxLength={12}></TextInput>
                </View>

                <View style={{flexDirection:"row", padding:10,alignItems:"center"}}>
                 <Text style={{fontFamily:"Inter-Light",fontSize:22}}>-Contato:  </Text>
                    <TextInput 
                    style=
                    {{backgroundColor:"#9BFFF9",
                    fontSize:22,fontFamily:"Inter-Regular",
                    width:200,padding:10}} 
                    defaultValue={curAco.contact}
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
                    AcolyteData.allAcolytes[EditAcolyteScreen.id] = currentData
                    AcolyteData.allAcolytes = OrganizeAcolyteArrayAlpha(AcolyteData.allAcolytes)

                    AcolyteProfileScreen.id = GetAcolyteIndex(GetAcolyteByName(currentData.name))
                    AsyncStorage.setItem("AcolyteData",JSON.stringify(AcolyteData.allAcolytes))
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
            backgroundColor: '#FFEBA4',
            padding:10}}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            resizeMode:"contain"}}  source={require("../item_icons/add_ico.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
            
            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
                <ImageButton img={require("@/src/app/shapes/delete_ico.png")} imgStyle={[Global.styles.buttonIcons,{width:48}]} press={()=>{EraseAcolyte(EditAcolyteScreen.id)}}/>
            </View>
        </View>
    )
}

export function EraseAcolyte(id:number){
    AcolyteData.allAcolytes.splice(id,1)
    AcolyteData.allAcolytes = OrganizeAcolyteArrayAlpha(AcolyteData.allAcolytes)
    AsyncStorage.setItem("AcolyteData",JSON.stringify(AcolyteData.allAcolytes))
    router.back()
    router.back()
}