import { View,Text, ScrollView } from "react-native"
import { GetMemberIcon, UpperBar, VisualCheckBox, UpperButton, DataDisplay } from "../classes/NewComps"
import { contextStore, menuStore } from "../store/store"
import { Member, MemberData, MemberType } from "../classes/MemberData"
import { textStyles} from "../styles/GeneralStyles"

export default function MemberProfile() {
    const {type,name,theme} = menuStore()
    const {memberID} = contextStore()
    
    let members:Array<Member>
    
    switch (type){
        case MemberType.ACOLYTE:
            members = MemberData.allAcolytes ; break
        case MemberType.COROINHA:
            members = MemberData.allCoroinhas ; break
    }
    
    let curMember:Member = members[memberID]
    
    const parents =  type == MemberType.COROINHA? 
                    <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                        <Text style={textStyles.dataTitle}>Responsável: </Text>
                        <Text style={textStyles.dataText}>{curMember.parents}</Text>
                    </View> : null

    const rodizio = []
    
    Object.keys(curMember.rodizio).forEach((role) => {
        rodizio.push(
        <DataDisplay dataTitle={role} data={curMember.rodizio[role]} key={role}/>)
    })
    
    return(
        <View style={{flex:1}}>
            <View style={{flexDirection:'row'}}>
                <UpperBar icon={GetMemberIcon()} screenName={curMember.nick+" | "+name}/>
                <UpperButton img={require("@/src/app/shapes/edit_icomdpi.png")} link={"/screens/EditMember"} backgroundColor={theme.accentColor}/>
            </View>
            

            <ScrollView style={{flex:1}}>
                <View style={{flex:1,backgroundColor:theme.secondary,height:80}}>
                    <Text style={textStyles.dataSection}>-Dados Pessoais-</Text>
                </View>
                
                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={textStyles.dataTitle}>Nome: </Text>
                    <Text style={textStyles.dataText}>{curMember.name}</Text>
                </View>
                
                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={textStyles.dataTitle}>Apelido: </Text>
                    <Text style={textStyles.dataText}>{curMember.nick}</Text>
                </View>

                {parents}

                <View style={{flex:0.06,flexDirection:"row",alignItems:"center"}}>
                    <Text style={textStyles.dataTitle}>Contato: </Text>
                    <Text style={textStyles.dataText}>{curMember.contact}</Text>
                </View>

                <View style={{flex:0.1,backgroundColor:theme.secondary,height:80}}>
                    <Text style={textStyles.dataSection}>-Disponibilidade-</Text>
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
                                
                                <VisualCheckBox enabled={curMember.disp["1stWE"].sabado}/>
                                <VisualCheckBox enabled={curMember.disp["1stWE"].domingoAM}/>
                                <VisualCheckBox enabled={curMember.disp["1stWE"].domingoPM}/>
                            </View>
                            
                            {/*SEGUNDO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1,fontFamily:"Inter-Light"}}>Segundo</Text>
                                
                                <VisualCheckBox enabled={curMember.disp["2ndWE"].sabado}/>
                                <VisualCheckBox enabled={curMember.disp["2ndWE"].domingoAM}/>
                                <VisualCheckBox enabled={curMember.disp["2ndWE"].domingoPM}/>
                            </View>

                            {/*TERCEIRO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1,fontFamily:"Inter-Light"}}>Primeiro</Text>
                                
                                <VisualCheckBox enabled={curMember.disp["3rdWE"].sabado}/>
                                <VisualCheckBox enabled={curMember.disp["3rdWE"].domingoAM}/>
                                <VisualCheckBox enabled={curMember.disp["3rdWE"].domingoPM}/>
                            </View>
                            
                            {/*QUARTO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1,fontFamily:"Inter-Light"}}>Quarto</Text>
                                
                                <VisualCheckBox enabled={curMember.disp["4thWE"].sabado}/>
                                <VisualCheckBox enabled={curMember.disp["4thWE"].domingoAM}/>
                                <VisualCheckBox enabled={curMember.disp["4thWE"].domingoPM}/>
                            </View>
                            
                            {/*QUINTO FINAL DE SEMANA*/}
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <Text style={{padding:10,flex:1,fontFamily:"Inter-Light"}}>Quinto</Text>
                                
                                <VisualCheckBox enabled={curMember.disp["5thWE"].sabado}/>
                                <VisualCheckBox enabled={curMember.disp["5thWE"].domingoAM}/>
                                <VisualCheckBox enabled={curMember.disp["5thWE"].domingoPM}/>
                            </View>
                        </View>
                        
                        <View style={{flexDirection:"row",alignItems:"center"}}>
                            <Text style={{fontFamily:"Inter-Bold",fontSize:20,padding:10,paddingRight:20}}>-Escalável?</Text>
                            <VisualCheckBox enabled={curMember.onLineup}/>
                        </View>
                 </View>

                 <View style={{flex:0.1,backgroundColor:theme.secondary,height:80}}>
                    <Text style={textStyles.dataSection}>-Rodízio-</Text>
                 </View>

                <View style={{padding:10,flexDirection:"row"}}>
                    <Text style={{fontFamily:"Inter-Bold",fontSize:20,alignSelf:"center"}}>Geral: </Text>
                    <Text style={{fontFamily:"Inter-Regular",fontSize:20,alignSelf:"center"}}>{curMember.priority}</Text>
                </View>
                {rodizio}
            </ScrollView>
        </View>
    )
}