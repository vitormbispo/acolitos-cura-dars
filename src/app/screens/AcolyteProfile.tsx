import { View,Text,Image, ScrollView } from "react-native"
import { Global } from "../Global"
import { AcolyteData } from "../classes/AcolyteData"
import { LinkImageButton, VisualCheckBox } from "../classes/NewComps"
import { EditAcolyteScreen } from "./EditAcolyte"


export class AcolyteProfileScreen{
    static id = 0
}

export default function AcolyteProfile() {
    Global.currentScreen = {screenName:"Acólito - "+AcolyteData.allAcolytes[AcolyteProfileScreen.id].nick,iconPath:""}
    var curAcolyte = AcolyteData.allAcolytes[AcolyteProfileScreen.id]
    
    return(
        
        <View style={{flex:1}}>
            <UpperBar/>

            <ScrollView style={{flex:1}}>
                <View style={{flex:1,backgroundColor:"#9BFFF9",height:80}}>
                    <Text style={Global.textStyles.dataSection}>-Dados Pessoais-</Text>
                </View>
                
                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={Global.textStyles.dataTitle}>Nome: </Text>
                    <Text style={Global.textStyles.dataText}>{AcolyteData.allAcolytes[AcolyteProfileScreen.id].name}</Text>
                </View>
                
                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={Global.textStyles.dataTitle}>Apelido: </Text>
                    <Text style={Global.textStyles.dataText}>{AcolyteData.allAcolytes[AcolyteProfileScreen.id].nick}</Text>
                </View>

                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={Global.textStyles.dataTitle}>Contato: </Text>
                    <Text style={Global.textStyles.dataText}>{AcolyteData.allAcolytes[AcolyteProfileScreen.id].contact}</Text>
                </View>

                <View style={{flex:0.1,backgroundColor:"#9BFFF9",height:80}}>
                    <Text style={Global.textStyles.dataSection}>-Disponibilidade-</Text>
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
                                <Text style={{padding:10,flex:1,fontFamily:"Inter-Light"}}>Primeiro</Text>
                                
                                <VisualCheckBox enabled={curAcolyte.disp["1stWE"].sabado}/>
                                <VisualCheckBox enabled={curAcolyte.disp["1stWE"].domingoAM}/>
                                <VisualCheckBox enabled={curAcolyte.disp["1stWE"].domingoPM}/>
                            </View>
                            
                            {/*SEGUNDO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1,fontFamily:"Inter-Light"}}>Segundo</Text>
                                
                                <VisualCheckBox enabled={curAcolyte.disp["2ndWE"].sabado}/>
                                <VisualCheckBox enabled={curAcolyte.disp["2ndWE"].domingoAM}/>
                                <VisualCheckBox enabled={curAcolyte.disp["2ndWE"].domingoPM}/>
                            </View>

                            {/*TERCEIRO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1,fontFamily:"Inter-Light"}}>Primeiro</Text>
                                
                                <VisualCheckBox enabled={curAcolyte.disp["3rdWE"].sabado}/>
                                <VisualCheckBox enabled={curAcolyte.disp["3rdWE"].domingoAM}/>
                                <VisualCheckBox enabled={curAcolyte.disp["3rdWE"].domingoPM}/>
                            </View>
                            
                            {/*QUARTO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1,fontFamily:"Inter-Light"}}>Quarto</Text>
                                
                                <VisualCheckBox enabled={curAcolyte.disp["4thWE"].sabado}/>
                                <VisualCheckBox enabled={curAcolyte.disp["4thWE"].domingoAM}/>
                                <VisualCheckBox enabled={curAcolyte.disp["4thWE"].domingoPM}/>
                            </View>
                            
                            {/*QUINTO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1,fontFamily:"Inter-Light"}}>Quinto</Text>
                                
                                <VisualCheckBox enabled={curAcolyte.disp["5thWE"].sabado}/>
                                <VisualCheckBox enabled={curAcolyte.disp["5thWE"].domingoAM}/>
                                <VisualCheckBox enabled={curAcolyte.disp["5thWE"].domingoPM}/>
                            </View>
                        </View>
                        
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Escalável?</Text>
                            <VisualCheckBox enabled={curAcolyte.onLineup}/>
                        </View>
                 </View>

                 <View style={{flex:0.1,backgroundColor:"#9BFFF9",height:80}}>
                    <Text style={Global.textStyles.dataSection}>-Rodízio-</Text>
                 </View>

                <View style={{padding:10,flexDirection:"row"}}>
                    <Text style={{fontFamily:"Inter-Bold",fontSize:20,alignSelf:"center"}}>Geral: </Text>
                    <Text style={{fontFamily:"Inter-Regular",fontSize:20,alignSelf:"center"}}>{curAcolyte.priority}</Text>
                </View>

                <View style={{flexDirection:"row",flex:1}}>
                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Vela 1</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curAcolyte.rodizio["cero1"]}</Text>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Vela 2</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curAcolyte.rodizio["cero2"]}</Text>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Cruz</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curAcolyte.rodizio["cruci"]}</Text>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Missal</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curAcolyte.rodizio["libri"]}</Text>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Turíbulo</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curAcolyte.rodizio["turib"]}</Text>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Naveta</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curAcolyte.rodizio["navet"]}</Text>
                    </View>
                </View> 
            </ScrollView>
        </View>
    )
}

export const UpperBar = () => {
    return(
        <View style = {Global.styles.rowContainer}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            padding:26,
            paddingRight:40,
            paddingLeft:40,
            resizeMode:"contain"}}  source={require("../item_icons/users_icomdpi.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
            <View style={{flex:1,justifyContent:"flex-end",flexDirection:"row",paddingRight:10}}>
                <LinkImageButton img={require("@/src/app/shapes/edit_icomdpi.png")} imgStyle={[Global.styles.buttonIcons,{width:48}]} link={"/screens/EditAcolyte"} press={()=>{EditAcolyteScreen.id = AcolyteProfileScreen.id}
                }/>
            </View>
            
        </View>
    )
}