import { View,Text,Image, ScrollView } from "react-native"
import { Global } from "@/src/app/Global"
import { CoroinhaData } from "@/src/app/classes/CoroinhaData"
import { ImageButton, LinkImageButton, VisualCheckBox } from "@/src/app/classes/NewComps"
import { EditCoroinhaScreen } from "./EditCoroinha"


export class CoroinhaProfileScreen{
    static id = 0
}

export default function CoroinhaProfile() {
    console.log("ON SCREEN")
    console.log("ID is: "+CoroinhaProfileScreen.id)
    console.log("Coroinha is: "+CoroinhaData.allCoroinhas[0])
    
    Global.currentScreen = {screenName:"Coroinha - "+CoroinhaData.allCoroinhas[CoroinhaProfileScreen.id].nick,iconPath:""}
    var curCoroinha = CoroinhaData.allCoroinhas[CoroinhaProfileScreen.id]
    
    return(
        
        <View style={{flex:1}}>
            <UpperBar/>

            <ScrollView style={{flex:1}}>
                <View style={{flex:1,backgroundColor:"#9BFFF9",height:80}}>
                    <Text style={Global.textStyles.dataSection}>-Dados Pessoais-</Text>
                </View>
                
                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={Global.textStyles.dataTitle}>Nome: </Text>
                    <Text style={Global.textStyles.dataText}>{CoroinhaData.allCoroinhas[CoroinhaProfileScreen.id].name}</Text>
                </View>
                
                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={Global.textStyles.dataTitle}>Apelido: </Text>
                    <Text style={Global.textStyles.dataText}>{CoroinhaData.allCoroinhas[CoroinhaProfileScreen.id].nick}</Text>
                </View>

                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={Global.textStyles.dataTitle}>Responsável: </Text>
                    <Text style={Global.textStyles.dataText}>{CoroinhaData.allCoroinhas[CoroinhaProfileScreen.id].parents}</Text>
                </View>

                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={Global.textStyles.dataTitle}>Contato: </Text>
                    <Text style={Global.textStyles.dataText}>{CoroinhaData.allCoroinhas[CoroinhaProfileScreen.id].contact}</Text>
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
                                <Text style={{padding:10,flex:1}}>Primeiro</Text>
                                
                                <VisualCheckBox enabled={curCoroinha.disp["1stWE"].sabado}/>
                                <VisualCheckBox enabled={curCoroinha.disp["1stWE"].domingoAM}/>
                                <VisualCheckBox enabled={curCoroinha.disp["1stWE"].domingoPM}/>
                            </View>
                            
                            {/*SEGUNDO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1}}>Segundo</Text>
                                
                                <VisualCheckBox enabled={curCoroinha.disp["2ndWE"].sabado}/>
                                <VisualCheckBox enabled={curCoroinha.disp["2ndWE"].domingoAM}/>
                                <VisualCheckBox enabled={curCoroinha.disp["2ndWE"].domingoPM}/>
                            </View>

                            {/*TERCEIRO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1}}>Terceiro</Text>
                                
                                <VisualCheckBox enabled={curCoroinha.disp["3rdWE"].sabado}/>
                                <VisualCheckBox enabled={curCoroinha.disp["3rdWE"].domingoAM}/>
                                <VisualCheckBox enabled={curCoroinha.disp["3rdWE"].domingoPM}/>
                            </View>
                            
                            {/*QUARTO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1}}>Quarto</Text>
                                
                                <VisualCheckBox enabled={curCoroinha.disp["4thWE"].sabado}/>
                                <VisualCheckBox enabled={curCoroinha.disp["4thWE"].domingoAM}/>
                                <VisualCheckBox enabled={curCoroinha.disp["4thWE"].domingoPM}/>
                            </View>
                            
                            {/*QUINTO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1}}>Quinto</Text>
                                
                                <VisualCheckBox enabled={curCoroinha.disp["5thWE"].sabado}/>
                                <VisualCheckBox enabled={curCoroinha.disp["5thWE"].domingoAM}/>
                                <VisualCheckBox enabled={curCoroinha.disp["5thWE"].domingoPM}/>
                            </View>
                        </View>

                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Escalável?</Text>
                            <VisualCheckBox enabled={curCoroinha.onLineup}/>
                        </View>

                 </View>
                 
                 <View style={{flex:0.1,backgroundColor:"#9BFFF9",height:80}}>
                    <Text style={Global.textStyles.dataSection}>-Rodízio-</Text>
                 </View>

                <View style={{padding:10,flexDirection:"row"}}>
                    <Text style={{fontFamily:"Inter-Bold",fontSize:20,alignSelf:"center"}}>Geral: </Text>
                    <Text style={{fontFamily:"Inter-Regular",fontSize:20,alignSelf:"center"}}>{curCoroinha.priority}</Text>

                </View>
                <View style={{flexDirection:"row",flex:1}}>
                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Vela 1</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curCoroinha.rodizio["cero1"]}</Text>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Vela 2</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curCoroinha.rodizio["cero2"]}</Text>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Cruz</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curCoroinha.rodizio["cruci"]}</Text>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Missal</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curCoroinha.rodizio["libri"]}</Text>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Turíbulo</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curCoroinha.rodizio["turib"]}</Text>
                    </View>

                    <View style={{flex:1}}>
                        <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>Naveta</Text>
                        <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{curCoroinha.rodizio["navet"]}</Text>
                    </View>
                    
                </View> 
                
            </ScrollView>
        </View>
        
    )
}

export const UpperBar = () => {
    return(
        <View style = {[Global.styles.rowContainer,{backgroundColor:"#fca4a4"}]}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            padding:26,
            paddingRight:40,
            paddingLeft:40,
            resizeMode:"contain"}}  source={require("@/src/app/shapes/coroinha_ico.png")}/>
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
            <View style={{flex:1,justifyContent:"flex-end",flexDirection:"row",paddingRight:10}}>
                <LinkImageButton img={require("@/src/app/shapes/edit_icomdpi.png")} imgStyle={[Global.styles.buttonIcons,{width:48}]} link={"/screens/coroinhas/EditCoroinha"} press={()=>{EditCoroinhaScreen.id = CoroinhaProfileScreen.id
                    console.log("Setting edit id to: "+CoroinhaProfileScreen.id)}
                }/>
            </View>
            
        </View>
    )
}