import { useState } from "react";
import { View,Text,Image, Pressable, TextInput, KeyboardTypeOptions} from "react-native"
import { Href, router} from "expo-router"
import { textStyles, uiStyles } from "../styles/GeneralStyles";
import { contextStore, menuStore } from "../store/store";
import { MemberType } from "./MemberData";
import { ICONS } from "./AssetManager";

const USER_ICONS = [require("@/src/app/item_icons/acolito_ico.png"),require("@/src/app/item_icons/coroinha_ico.png")]
const ADD_ICONS = [require("@/src/app/item_icons/add_acolito_ico.png"),require("@/src/app/item_icons/add_coroinha_ico.png")]
type ImageButtonProps = {
  img:any,
  imgStyle?:object,
  buttonStyle?:object,
  press?: (...args:any) => any
}
/**
 * Botão com imagem
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * buttonStyle = Estilo do componente Pressable     
 * press = Ação quando o botão é pressionado     
 * @returns
 */
export function ImageButton(props:ImageButtonProps) {
  if(props.press == undefined){
    props.press = ()=>{}
  }
  return (
    
       <Pressable style={props.buttonStyle} onPress={props.press}>
          <Image source={props.img} style={props.imgStyle}/>
       </Pressable>
      );
  }


type RowImageButtonProps = {
  img:any,
  text:string,
  imgStyle?:object,
  rowStyle?:object,
  press: (...args:any) => any
}
/**
 * Botão com imagem que ocupa uma linha inteira
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * rowStyle = Estilo do componente Pressable    
 * text = Texto escrito na linha
 * press = Ação quando o botão é pressionado         
 * @returns
 */
export function RowImageButton(props:RowImageButtonProps){
  if(props.press == undefined){
    props.press = ()=>{}
  }
    return(
      <Pressable onPress={props.press} style={[{flexDirection:"row", alignContent:"center",alignItems:"center", backgroundColor:"#9BFFF9",padding:10},props.rowStyle]}>
        <Image source={props.img} style={[{width:64,height:64,resizeMode:"contain"},props.imgStyle]}/>
        <Text style={{paddingLeft:10, fontFamily:"Inter-Light",fontSize:20}}>{props.text}</Text>       
      </Pressable>
    )
  }


type RowMemberProps = {
  id:number,
  img:any,
  nick:string,
  textStyle?:object
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
export function RowMember(props:RowMemberProps){
  const {updateMemberID} = contextStore()
  return(
    <Pressable style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={() => {updateMemberID(props.id) ; OpenMemberProfile()}}>
      <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
      <Text style={props.textStyle}>{props.nick}</Text>
    </Pressable>
  )
  }

/**
 * Abre o perfil do membro de índice *id* na lista geral.
 * @param id Índice
 */
function OpenMemberProfile(){
  router.push("/screens/MemberProfile")
}


type TextButtonProps = {
  text:string
  press: (...args:any) => any
  textStyle?:object,
  buttonStyle?:object,
}
/** Botão com texto
 * 
 * @param props Propriedades:
   * text = Texto        
   * press = Ação ao tocar     
   * textStyle = Estilo do texto     
   * buttonStyle = Estilo da Pressable
 * @returns 
 */
export function TextButton(props:TextButtonProps) {
  if(props.press == undefined){
    props.press = ()=>{}
  }
  return (
      <Pressable style={[props.buttonStyle,uiStyles.textButton]} onPress={props.press}>
          <Text style={[textStyles.textButton,props.textStyle]}>{props.text}</Text>
      </Pressable>
      
    );
}

type CheckBoxProps = {
  checked:boolean,
  press: (...args:any) => any
}
/**
 * Botão em formato de caixa de checagem.
 * @param props Propriedades:
 * checked = caixa marcada ou não.     
 * press = ação ao pressionar     
 * @returns 
 */
export function CheckBox(props:CheckBoxProps){

  const[check,setChecked] = props.checked ? useState(1) : useState(0)
  const images = [require("@/src/app/shapes/check_false.png"),require("@/src/app/shapes/check_true.png")]
  
  const changeImage = () =>{
    setChecked((check === 1) ? 0 : 1)
  }

  if(props.press == undefined){
    props.press = ()=>{}
  }

  return(
  <Pressable style={{flex:1}} onPress={()=>{
    props.press()
    changeImage()
  }}>
    <Image source={images[check]} style={{height:32,width:32}}/>
  </Pressable>
  )
}

type SingleCheckProps = {
  img:any,
  press: (...args:any) => any,
  topText?:string
}
/**
 * Botão no formato caixa de checagem única
 * @param props Propriedades:
 * press = Ação ao tocar     
 * topText = Texto acima da caixa     
 * img = Imagem
 * @returns 
 */
export function SingleCheck(props:SingleCheckProps){
  if(props.press == undefined){
    props.press = ()=>{}
  }

  return(
    <Pressable style={{flex:1}} onPress={()=>{
      props.press()}}>
      <View style={{paddingBottom:26,alignContent:"center",alignItems:"center"}}>
        <Text style={{paddingBottom:10,fontFamily:"Inter-Light"}}>{props.topText}</Text>
        <Image style={{height:32,width:32}} source={props.img}/>
      </View>
    </Pressable>
    
  )
}

type SingleCheckColorProps = {
  checked:boolean,
  color:string
  press: (...args:any) => any
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
export function SingleCheckColor(props:SingleCheckColorProps){
  
  const[check,setChecked] = useState(props.checked)
  const[liturgicalColors,setColor] = useState(props.color)

  const checkNum = check ? 1 : 0
  const images:any = {
    "green":[require("@/src/app/shapes/check_green_f.png"),require("@/src/app/shapes/check_green_t.png")],
    "red":[require("@/src/app/shapes/check_red_f.png"),require("@/src/app/shapes/check_red_t.png")],
    "white":[require("@/src/app/shapes/check_white_f.png"),require("@/src/app/shapes/check_white_t.png")],
    "pink":[require("@/src/app/shapes/check_pink_f.png"),require("@/src/app/shapes/check_pink_t.png")],
    "purple":[require("@/src/app/shapes/check_purple_f.png"),require("@/src/app/shapes/check_purple_t.png")]}
  
  if(props.press == undefined){
    props.press = ()=>{}
  }

  return(
    <Pressable style={{flex:1}} onPress={()=>{
      props.press()}}>
      <View style={{paddingBottom:26,alignContent:"center",alignItems:"center"}}>
        <Image style={{height:32,width:32}} source={images[liturgicalColors][checkNum]}/>
      </View>
      
    </Pressable>
    
  )
}

type VisualCheckBoxProps = {
  enabled:boolean
  imageStyle?:object
  boxStyle?:object
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
export function VisualCheckBox(props:VisualCheckBoxProps){

  return(
    <View style={[{flex:1,padding:10},props.boxStyle]}>
      <Image source={props.enabled 
        ? require("@/src/app/shapes/check_true.png")
        :require("@/src/app/shapes/check_false.png")} 
        
        style={[{width:32,height:32},props.imageStyle]}></Image>
    </View>
  )
}

type UpperBarProps = {
  icon:any
  screenName:string,
  toggleEnabled?:boolean
}
/**
 * Barra superior
 * @param props Propriedades     
 * icon = Ícone
 * screenName = Nome da tela
 * toggleEnabled = botão para troca entre coroinha/acólito ativado. 
 * @returns 
 */
export function UpperBar(props:UpperBarProps){
  
  const {theme} = menuStore()
  return(
      <View style = {[uiStyles.upperBar,{backgroundColor:theme.accentColor}]}>
          <Image style = {[uiStyles.buttonIcon]} source={props.icon}/>
          <Text style = {textStyles.menuTitle}>- {props.screenName}</Text>
          <ToggleButton enabled={props.toggleEnabled}/>
      </View>
  )
}

type UpperButtonProps = {
  img:any
  press?: (...args:any) => any,
  backgroundColor?:string,
  link?:Href<string|object>,
  style?:object
}
/**
 * 
 * @param props 
 * img = Imagem do botão
 * style = Estilo do botão
 * link = Link para outra tela. Deixe null para usar como um botão convencional
 * press = Ação ao tocar
 * backgroundColor = Cor do fundo
 */
export function UpperButton(props:UpperButtonProps){
  return(
    <View style = {{flex:1,justifyContent:'flex-end',flexDirection:'row',alignItems:'center',padding:10,backgroundColor:props.backgroundColor}}>
      <LinkImageButton img={props.img} imgStyle={[uiStyles.buttonIcon,props.style]} link={props.link} press={()=>{props.press == null ? ()=>{} : props.press()}}/>
    </View>
  )
}

type ToggleButtonProps = {
  enabled:boolean
}
/**
 * 
 * @param props enabled = Componente ativado
 * @returns 
 */
export function ToggleButton(props:ToggleButtonProps) {
  if(!props.enabled){return null}
  const {type,toggleTheme} = menuStore()
  return(
  <View style = {{flex:1,flexDirection:"row",justifyContent:"flex-end"}}>
    <ImageButton img={
      type==MemberType.ACOLYTE ? 
      ICONS.coroinha:
      ICONS.acolito} 
      
      imgStyle={[uiStyles.buttonIcon,{margin:10}]} press={toggleTheme}/>
  </View>
  )
}

type LinkRowImageButtonProps = {
  img:any,
  text:string,
  link:Href<string|object>,
  press?: (...args:any) => any,
  imgStyle?:object,
  rowstyle?:object,
  textStyle?:object
}
/**
 * Botão com imagem que ocupa uma linha inteira e possui link para outra tela.
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * rowStyle = Estilo do componente Pressable    
 * text = Texto escrito na linha
 * press = Ação quando o botão é pressionado       
 * link = Link para outra tela  
 * @returns
 */
export function LinkRowImageButton(props:LinkRowImageButtonProps){
  return(
      <Pressable style={{flexDirection:"row", alignContent:"center",alignItems:"center", backgroundColor:"#9BFFF9",padding:10}} onPress={() => {
        console.log(props.press)
        if(props.press != null){
          props.press() 
        }
        
        router.push(props.link)}
        }>
        <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
        <Text style={props.textStyle}>{props.text}</Text>       
      </Pressable>
  )
}

type LinkImageButtonProps = {
  img:any,
  link:Href<string|object>,
  press?: (...args:any) => any,
  imgStyle?:object,
  buttonStyle?:object,
  viewStyle?:object
}
/**
 * Botão com imagem e link para outra tela
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * buttonStyle = Estilo do componente Pressable     
 * press = Ação quando o botão é pressionado     
 * link = Link para outra tela        
 * @returns
 */
  export function LinkImageButton(props:LinkImageButtonProps) {
    return (
        <View style={props.viewStyle}>
          <Pressable style={props.buttonStyle} onPress={() => {
            props.press == null ? ()=>{} : props.press()
            
            if(props.link != null) {
              router.push(props.link)
            }
            
          }}>
            <Image source={props.img} style={props.imgStyle}/>
          </Pressable>
        </View>
          
        );
    }

type TextInputBoxProps = {
  title:string,
  enabled?:boolean,
  default?:string,
  placeholder?:string,
  maxLength?:number
  keyboardType?:KeyboardTypeOptions,
  onChangeText?: (...args:any) => any
}
/**
 * 
 * @param props title = Título da caixa de entrada
 * default = valor padrão da caixa
 * keyboardType = tipo de teclado
 * onChangeText = ação ao usar a caixa
 * @returns 
 */
export function TextInputBox(props:TextInputBoxProps) {
  if(!props.enabled){return}

  return(
    <View style={{flexDirection:"row", padding:10,alignItems:"center"}}>
      <Text style={{fontFamily:"Inter-Light",fontSize:22}}>{props.title}</Text>
        <TextInput 
          style={uiStyles.inputField}
          placeholder={props.placeholder}
          defaultValue={props.default}
          keyboardType={props.keyboardType}
          onChangeText={props.onChangeText}
          maxLength={props.maxLength}/>
      </View>
  )
}
type DataDisplayProps = {
  dataTitle:string,
  data:string
}
/**
 * Exibe um dado em formato de texto
 * @param props dataTitle = nome do dado; data = valor do dado
 */
export function DataDisplay(props:DataDisplayProps) {
  return(
  <View style={{flex:1,flexDirection:"row", padding:10, alignItems:"center"}}>
    <Text style={{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"}}>{props.dataTitle}</Text>
    <Text style={{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"}}>{props.data}</Text>
  </View>
  )
}

/** Retorna o ícone de usuário referente ao tipo de menu atual contido
 * na menuStore: acólito ou coroinha
* 
* @returns Ícone de usuário
*/
export function GetMemberIcon() {
  const {type} = menuStore()
  return USER_ICONS[type]
}

/** Retorna o ícone de adicionar usuário referente ao tipo de menu atual contido
 * na menuStore: acólito ou coroinha
* 
* @returns Ícone de adicionar usuário
*/
export function GetMemberAddIcon(){
  const {type} = menuStore()
  return ADD_ICONS[type]
}



export enum TextPosition{
  BOTTOM,
  TOP
}
type ImageTextButtonProps = {
  img:any
  text:string
  textPos:TextPosition
  press?: (...args:any) => any
  imgButtonStyle?:object
  textStyle?:object
  imgStyle?:object
  link?:Href<string|object>
}
/**
 * Botão com imagem e texto superior ou inferior.
 * @param props img = Imagem, text = Texto, 
 * textPos = Posição do texto(Cima ou baixo), press ?= Ação
 * imgButtonStyle ?= Estilo do botão, imgStyle ?= Estilo da imagem
 * textStyle ?= Estilo do texto link ?= Link para outra tela
 * @returns 
 */
export function ImageTextButton(props:ImageTextButtonProps):React.JSX.Element{
  let textComp:React.JSX.Element = <Text style={[props.textStyle,textStyles.imageButtonText]}>{props.text}</Text>
  
  let bottomText:React.JSX.Element = props.textPos == TextPosition.BOTTOM ? textComp : null
  let topText:React.JSX.Element = props.textPos == TextPosition.TOP ? textComp : null

  return(
    <View style={{alignItems:"center"}}>
      {topText}
      <LinkImageButton img={props.img} link={props.link} imgStyle={props.imgStyle} buttonStyle={props.imgButtonStyle} press={props.press!=null ? props.press : null}/>
      {bottomText}
    </View>
  )
}

  