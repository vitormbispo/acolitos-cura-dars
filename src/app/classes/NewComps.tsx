import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useState } from "react";
import {View,Text,Image,StyleSheet, Button, TouchableOpacity, ImageSourcePropType, TouchableHighlight} from "react-native"
import {Link, router} from "expo-router"
import { AcolyteProfileScreen } from "../screens/AcolyteProfile";
import { AcolyteData } from "./AcolyteData";
import { CoroinhaProfileScreen } from "../screens/coroinhas/CoroinhaProfile";
import { CoroinhaData } from "./CoroinhaData";
import { Global } from "../Global";
import { textStyles, uiStyles } from "../styles/GeneralStyles";
import { menuStore } from "../store/store";
import { MemberType } from "./Member";

/**
 * Botão com imagem
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * buttonStyle = Estilo do componente TouchableOpacity     
 * press = Ação quando o botão é pressionado     
 * @returns
 */
export function ImageButton(props:any) {
  return (
    
       <TouchableOpacity style={props.buttonStyle} onPress={props.press}>
          <Image source={props.img} style={props.imgStyle}/>
       </TouchableOpacity>
      );
  }

  /**
 * Botão com imagem e link para outra tela
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * buttonStyle = Estilo do componente TouchableOpacity     
 * press = Ação quando o botão é pressionado     
 * link = Link para outra tela        
 * @returns
 */
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

/**
 * Botão com imagem que ocupa uma linha inteira
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * rowStyle = Estilo do componente TouchableOpacity     
 * text = Texto escrito na linha
 * press = Ação quando o botão é pressionado         
 * @returns
 */
export function RowImageButton(props:any){
    return(
      <TouchableOpacity onPress={props.press} style={[{flexDirection:"row", alignContent:"center",alignItems:"center", backgroundColor:"#9BFFF9",padding:10},props.rowStyle]}>
        <Image source={props.img} style={[{width:64,height:64,resizeMode:"contain"},props.imgStyle]}/>
        <Text style={{paddingLeft:10, fontFamily:"Inter-Light",fontSize:20}}>{props.text}</Text>       
      </TouchableOpacity>
    )
  }

/**
 * Botão com imagem que ocupa uma linha inteira e possui link para outra tela.
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * rowStyle = Estilo do componente TouchableOpacity     
 * text = Texto escrito na linha
 * press = Ação quando o botão é pressionado       
 * link = Link para outra tela  
 * @returns
 */
  export function LinkRowImageButton(props:any){
    return(
        <TouchableOpacity style={{flexDirection:"row", alignContent:"center",alignItems:"center", backgroundColor:"#9BFFF9",padding:10}} onPress={() => router.push(props.link)}>
          <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
          <Text style={props.textStyle}>{props.text}</Text>       
        </TouchableOpacity>
    )
  }

  /**
   * Botão em formato de linha para representar um acólito.
   * @param props Propriedade:
   * id = Índice do acólito na lista principal.
   * img = Imagem     
   * nick = Apelido do acólito
   * textStyle = Estilo do texto
   * @returns 
   */
export function RowAcolyte(props:any){
return(
  <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={() => OpenAcolyteProfile(props.id)}>
    <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
    <Text style={props.textStyle}>{props.nick}</Text>
  </TouchableOpacity>
)
}
  /**
   * Botão em formato de linha para representar um coroinha.
   * @param props Propriedade:
   * id = Índice do coroinha na lista principal.
   * img = Imagem     
   * nick = Apelido do coroinha
   * textStyle = Estilo do texto
   * @returns 
   */
export function RowCoroinha(props:any){
return(
  <TouchableOpacity style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={() =>   {OpenCoroinhaProfile(props.id)}
  }>
    <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
    <Text style={props.textStyle}>{props.nick}</Text>
  </TouchableOpacity>
  )
}

/**
 * Abre o perfil do acólito de índice *id* na lista geral.
 * @param id Índice
 */
function OpenAcolyteProfile(id:any){
  router.push("/screens/AcolyteProfile")
  AcolyteProfileScreen.id = id
}

/**
 * Abre o perfil do coroinha de índice *id* na lista geral.
 * @param id Índice
 */
function OpenCoroinhaProfile(id:any){
  CoroinhaProfileScreen.id = id
  router.push("/screens/coroinhas/CoroinhaProfile")
}

/** Botão com texto
 * 
 * @param props Propriedades:
   * text = Texto      
   * familyFont = Família da fonte do texto     
   * sizeFonte = Tamanho do texto     
   * press = Ação ao tocar     
   * textStyle = Estilo do texto     
   * buttonStyle = Estilo da TouchableOpacity
 * @returns 
 */
export function TextButton(props:any) {
  return (
    
      <TouchableOpacity style={props.buttonStyle+{alignItems:"center"}} onPress={props.press}>
          <Image source={require("@/src/app/shapes/button0.png")} style={{height:64, width:128, position:"absolute",alignSelf:"center"}}/>
          <Text style={[{alignSelf:"center",textAlign:"center",textAlignVertical:"center",width:128,height:64,fontFamily:props.familyFont, fontSize:props.sizeFont},props.textStyle]}>{props.text}</Text>
      </TouchableOpacity>
      
    );
}

/**
 * Botão em formato de caixa de checagem.
 * @param props Propriedades:
 * checked = caixa marcada ou não.     
 * press = ação ao pressionar     
 * @returns 
 */
export function CheckBox(props:any){

  const[check,setChecked] = props.checked ? useState(1) : useState(0)
  const images = [require("@/src/app/shapes/check_false.png"),require("@/src/app/shapes/check_true.png")]
  
  const changeImage = () =>{
    setChecked((check === 1) ? 0 : 1)
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

/**
 * Botão no formato caixa de checagem única
 * @param props Propriedades:
 * press = Ação ao tocar     
 * topText = Texto acima da caixa     
 * img = Imagem
 * @returns 
 */
export function SingleCheck(props:any){
  
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

/**
 * 
 * @param props Propriedades:
 * checked = Checado ou não     
 * color = Cor     
 * press = Ação ao pressionar
 * 
 * @returns 
 */
export function SingleCheckColor(props:any){
  
  const[check,setChecked] = useState(props.checked)
  const[liturgicalColors,setColor] = useState(props.color)

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

/**
 * Caixa de checagem sem interação.
 * @param props Propriedades = 
 * boxStyle = Estilo do contêiner     
 * imageStyle = Estilo da imagem     
 * enabled = Ativado
 * 
 * @returns 
 */
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

/**
 * Faz uma cópia real da *array* dada.
 * @param array Lista
 * @returns 
 */
export function DeepCopyArray(array:Array<any>):Array<any>{
    let newArray = new Array<any>
    for(let i = 0; i < array.length;i++){
      newArray.push(array[i])
    }

    return newArray
}

/**
 * Barra superior
 * @param props Propriedades     
 * icon = Ícone
 * screenName = Nome da tela
 * toggleEnabled = botão para troca entre coroinha/acólito ativado. 
 * @returns 
 */
export function UpperBar(props:any){
  
  const {theme} = menuStore()
  return(
      <View style = {[uiStyles.upperBar,{backgroundColor:theme.accentColor}]}>
          <Image style = {[uiStyles.buttonIcon]} source={props.icon}/>
          <Text style = {textStyles.menuTitle}>- {props.screenName}</Text>
          <ToggleButton enabled={props.toggleEnabled}/>
      </View>
  )
}

export function ToggleButton(props:any) {
  if(!props.enabled){return null}
  const {type,toggleTheme} = menuStore()
  return(
  <View style = {{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
    <ImageButton img={
      type==MemberType.ACOLYTE ? 
      require("@/src/app/shapes/coroinha_ico.png"):
      require("@/src/app/item_icons/users_icomdpi.png")} 
      
      imgStyle={[uiStyles.buttonIcon,{margin:10}]} press={toggleTheme}/>
  </View>
  )
}
  