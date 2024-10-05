import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useState } from "react";
import {View,Text,Image,StyleSheet, Button, TouchableOpacity, ImageSourcePropType, TouchableHighlight} from "react-native"
import {Link, router} from "expo-router"
import { AcolyteProfileScreen } from "../screens/AcolyteProfile";
import { AcolyteData } from "./AcolyteData";
import { CoroinhaProfileScreen } from "../screens/coroinhas/CoroinhaProfile";
import { CoroinhaData } from "./CoroinhaData";
import { Global } from "../Global";


export function ImageButton(props:any) {
  return (
    
       <TouchableOpacity style={props.buttonStyle} onPress={props.press}>
          <Image source={props.img} style={props.imgStyle}/>
       </TouchableOpacity>
      );
  }

export function LinkImageButton(props:any) {
  if(props.press == undefined){
      props.press = ()=>{}
  }
  return (
      <View style={props.viewStyle}>
        <TouchableOpacity style={props.buttonStyle} onPress={() => {router.push(props.link)
          props.press()
        }}>
          <Image source={props.img} style={props.imgStyle}/>
        </TouchableOpacity>
      </View>
        
      );
  }

export function RowImageButton(props:any){
    return(
      <TouchableOpacity style={[{flexDirection:"row", alignContent:"center",alignItems:"center", backgroundColor:"#9BFFF9",padding:10},props.rowStyle]}>
        <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
        <Text style={{paddingLeft:10, fontFamily:"Inter-Light",fontSize:20}}>{props.text}</Text>       
      </TouchableOpacity>
    )
  }

  export function LinkRowImageButton(props:any){
    return(
        <TouchableOpacity style={{flexDirection:"row", alignContent:"center",alignItems:"center", backgroundColor:"#9BFFF9",padding:10}} onPress={() => router.push(props.link)}>
          <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
          <Text style={props.textStyle}>{props.text}</Text>       
        </TouchableOpacity>
    )
  }

export function RowAcolyte(props:any){
return(
  <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={() => OpenAcolyteProfile(props.id)}>
    <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
    <Text style={props.textStyle}>{props.nick}</Text>
  </TouchableOpacity>
)
}

export function RowCoroinha(props:any){
return(
  <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={() =>   {OpenCoroinhaProfile(props.id)
    console.log("ID is: "+CoroinhaProfileScreen.id)
    console.log("Coroinha is: "+CoroinhaData.allCoroinhas[CoroinhaProfileScreen.id].nick)}
  }>
    <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
    <Text style={props.textStyle}>{props.nick}</Text>
  </TouchableOpacity>
)
}

function OpenAcolyteProfile(id:any){
console.log("Opening: "+AcolyteData.allAcolytes[id].nick)
router.push("/screens/AcolyteProfile")
AcolyteProfileScreen.id = id
}

function OpenCoroinhaProfile(id:any){
CoroinhaProfileScreen.id = id
console.log(CoroinhaData.allCoroinhas[id].disp)
router.push("/screens/coroinhas/CoroinhaProfile")

}

export function TextButton(props:any) {
  return (
    
      <TouchableOpacity style={props.buttonStyle} onPress={props.press}>
          <Image source={require("@/src/app/shapes/button0.png")} style={{height:64, width:128, position:"absolute"}}/>
          <Text style={[{textAlign:"center",textAlignVertical:"center",width:128,height:64,fontFamily:props.familyFont, fontSize:props.sizeFont},props.textStyle]}>{props.text}</Text>
      </TouchableOpacity>
      
    );
}

export function EscalaDiaria(props:any){
  return(
      <View style={{paddingVertical:10, alignSelf:"center", height:160,width:300}}>
        <Image source={require("@/src/app/shapes/escala_box.png")} style={{width:300,height:160,position:"absolute"}}/>
        <Text style={props.titleStyle}>{props.dayTitle}</Text>
      </View>
      
  )
}

export function CheckBox(props:any){
  
  var img = props.checked ? require("@/src/app/shapes/check_true.png") : require("@/src/app/shapes/check_false.png")
  
  const[check,setChecked] = props.checked ? useState(1) : useState(0)
  const images = [require("@/src/app/shapes/check_false.png"),require("@/src/app/shapes/check_true.png")]
  
  const changeImage = () =>{
    if(check === 1){
      setChecked(0)
    }
    else{
      setChecked(1)
    }
  }
  return(
  <TouchableOpacity style={{flex:1}} onPress={()=>{
    props.press()
    changeImage()
  }}>
    <Image source={images[check]} style={{height:32,width:32}}/>
  </TouchableOpacity>
  )
}

export function SingleCheck(props:any){
  

  const[img,setImg] = useState(require("@/src/app/shapes/check_false.png"))
  return(
    <TouchableOpacity style={{flex:1}} onPress={()=>{
      props.press()}}>
      <View style={{paddingBottom:26,alignContent:"center",alignItems:"center"}}>
        <Text style={{paddingBottom:10,fontFamily:"Inter-Light"}}>{props.topText}</Text>
        <Image style={{height:32,width:32}} source={props.img}/>
      </View>
      
    </TouchableOpacity>
    
  )
}

export function SingleCheckColor(props:any){
  
  const[check,setChecked] = useState(props.checked)
  const[liturgicalColors,setColor] = useState(props.color)
  const[img,setImg] = useState(require("@/src/app/shapes/check_false.png"))

  const checkNum = check ? 1 : 0
  const images:any = {
    "green":[require("@/src/app/shapes/check_green_f.png"),require("@/src/app/shapes/check_green_t.png")],
    "red":[require("@/src/app/shapes/check_red_f.png"),require("@/src/app/shapes/check_red_t.png")],
    "white":[require("@/src/app/shapes/check_white_f.png"),require("@/src/app/shapes/check_white_t.png")],
    "pink":[require("@/src/app/shapes/check_pink_f.png"),require("@/src/app/shapes/check_pink_t.png")],
    "purple":[require("@/src/app/shapes/check_purple_f.png"),require("@/src/app/shapes/check_purple_t.png")]}
  
  return(
    <TouchableOpacity style={{flex:1}} onPress={()=>{
      props.press()}}>
      <View style={{paddingBottom:26,alignContent:"center",alignItems:"center"}}>
        <Image style={{height:32,width:32}} source={images[liturgicalColors][checkNum]}/>
      </View>
      
    </TouchableOpacity>
    
  )
}

export function VisualCheckBox(props:any){

  return(
    <View style={[{flex:1,padding:10},props.boxStyle]}>
      <Image source={props.enabled 
        ? require("@/src/app/shapes/check_true.png")
        :require("@/src/app/shapes/check_false.png")} 
        
        style={[{width:32,height:32},props.imageStyle]}></Image>
    </View>
  )
}

export function DeepCopyArray(array:Array<any>):Array<any>{
    let newArray = new Array<any>
    for(let i = 0; i < array.length;i++){
      newArray.push(array[i])
    }

    return newArray
}

export function UpperBar(props:any){
  return(
      <View style = {Global.styles.rowContainer}>
          <Image style = {[Global.styles.buttonIcons]} source={props.icon}/>
          <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
      </View>
  )
}
  