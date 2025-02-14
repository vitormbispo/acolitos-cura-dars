import { View,Image,Text } from "react-native"
import { Global } from "../Global"
import { CheckBox, LinkRowImageButton, RowImageButton, SingleCheck, SingleCheckColor, TextButton, UpperBar } from "../classes/NewComps"
import { Lineup } from "../classes/Lineup"
import { GenerateLineup, GenerateRandomLineup } from "../classes/FlexLineupGenerator"
import { router } from "expo-router"
import { useState } from "react"
import { LineupScreenOptions } from "./LineupScreen"
import { menuStore } from "../store/store"
import { MemberType } from "../classes/MemberData"
import { Roles, RoleSet } from "../classes/Roles"

/*
export class SingleLineupScreen{
    
    static generateOptions= {
        "weekend":"1stWE",
        "day":null,
        "allowOut":false,
        "allRandom":false,
        "solemnity":false
    }
    static curLineup:any = null
}
*/
export default function LineupOptions(){
    let [weekend,setWeekend] = useState("1stWE")
    let[day,setDay] = useState("sabado")
    
    let[liturgicalColor,setColor] = useState("red")
    let generateOptions= {
        "weekend":"1stWE",
        "day":null,
        "allowOut":false,
        "allRandom":false,
        "solemnity":false
    }

    const {type} = menuStore()

    return(
        <View style={{flex:1}}>
            <UpperBar icon={require("@/src/app/item_icons/escala_icomdpi.png")} screenName={"Nova escala única"} toggleEnabled={false}/>
            
            <View style={{flex:1}}>
                
                <View style={{height:80,backgroundColor:"#9BFFF9"}}>
                    <Text style={Global.textStyles.dataSection}>-Celebração</Text>
                </View>
                
                <View style={{flexDirection:"row"}}>
                    <SingleCheckColor color={"green"} check={liturgicalColor == "green" ? true : false} press={()=>{setColor("green");}}/>
                    <SingleCheckColor color={"red"} check={liturgicalColor == "red" ? true : false} press={()=>{setColor("red");}}/>
                    <SingleCheckColor color={"pink"} check={liturgicalColor == "pink" ? true : false} press={()=>{setColor("pink");}}/>
                    <SingleCheckColor color={"white"} check={liturgicalColor == "white" ? true : false} press={()=>{setColor("white");}}/>
                    <SingleCheckColor color={"purple"} check={liturgicalColor == "purple" ? true : false} press={()=>{setColor("purple");}}/>
                </View>
                
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Solenidade</Text>
                    <CheckBox checked={false} press={()=>{generateOptions.solemnity = !generateOptions.solemnity}}/>
                </View>


                <View style={{height:80,backgroundColor:"#9BFFF9"}}>
                    <Text style={Global.textStyles.dataSection}>-Opções</Text>
                </View>
             
                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Fim de semana</Text>
                    <SingleCheck img={CheckImage(weekend,"1stWE")} topText="1°" press={()=>{setWeekend("1stWE")}}/>
                    <SingleCheck img={CheckImage(weekend,"2ndWE")} topText="2°" press={()=>{setWeekend("2ndWE")}}/>
                    <SingleCheck img={CheckImage(weekend,"3rdWE")} topText="3°" press={()=>{setWeekend("3rdWE")}}/>
                    <SingleCheck img={CheckImage(weekend,"4thWE")} topText="4°" press={()=>{setWeekend("4thWE")}}/>
                    <SingleCheck img={CheckImage(weekend,"5thWE")} topText="5°" press={()=>{setWeekend("5thWE")}}/>
                    <SingleCheck img={CheckImage(weekend,"Outro")} topText="Outro" press={()=>{setWeekend("Outro"), setDay("Outro")}}/>
                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Horário</Text>
                    <SingleCheck img={CheckImage(day,"sabado")} topText="Sáb.19h" press={()=>{setDay("sabado")}}/>
                    <SingleCheck img={CheckImage(day,"domingoAM")} topText="Dom.08h" press={()=>{setDay("domingoAM")}}/>
                    <SingleCheck img={CheckImage(day,"domingoPM")} topText="Dom.19h" press={()=>{setDay("domingoPM")}}/>
                    <SingleCheck img={CheckImage(day,"Outro")} topText="Outro" press={()=>{setDay("Outro"),setWeekend("Outro")}}/>

                </View>

                <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={{fontFamily:"Inter-Light",fontSize:20,padding:10}}>Aleatório</Text>
                    <CheckBox checked={false} press={()=>{generateOptions.allRandom = !generateOptions.allRandom}}/>
                </View>


                <TextButton text="Gerar escala" press={()=>{
                
                let roles = []
                let roleset:RoleSet
                
                
                switch(type){
                    case MemberType.ACOLYTE:
                        if(generateOptions.solemnity){
                            roles = Roles.getRoleSet("default",MemberType.ACOLYTE).set
                            roleset = Roles.getRoleSet("default",MemberType.ACOLYTE)              
                        }
                        else{
                            roles = Roles.getRoleSet("minimal",MemberType.ACOLYTE).set
                            roleset = Roles.getRoleSet("minimal",MemberType.ACOLYTE)
                        }
                        break
                    case MemberType.COROINHA:
                        if(generateOptions.solemnity){
                            roles = Roles.getRoleSet("default",MemberType.COROINHA).set
                            roleset = Roles.getRoleSet("default",MemberType.COROINHA)              
                        }
                        else{
                            roles = Roles.getRoleSet("minimal",MemberType.COROINHA).set
                            roleset = Roles.getRoleSet("minimal",MemberType.COROINHA)
                        }
                        break
                }
                
                LineupScreenOptions.roles = roles
                LineupScreenOptions.lineups = []
                let lineup:Lineup

                generateOptions.allRandom ? 
                    lineup = GenerateRandomLineup(roleset,type,weekend,day):
                    lineup = GenerateLineup(weekend,day,roleset,type)
                
                LineupScreenOptions.lineups.push(lineup)
                
                LineupScreenOptions.loaded = false,
                LineupScreenOptions.lineupType="Single",
                router.push("/screens/LineupScreen")
                               
                }} buttonStyle={{alignSelf:"center"}}/>
            </View>

        </View>
        )
    }
    

function CheckImage(value:any,id:any){
    if(value == id){
      return(require("@/src/app/shapes/check_true.png"))
    }
    else{
      return(require("@/src/app/shapes/check_false.png"))
    }
  }

