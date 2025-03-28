import { useEffect, useRef, useState } from "react";
import { View,Text,Image, Pressable, TextInput, KeyboardTypeOptions, Modal, ScrollView, ActivityIndicator} from "react-native"
import { Href, router} from "expo-router"
import { textStyles, uiStyles } from "../styles/GeneralStyles";
import { contextStore, menuStore } from "../store/store";
import { Member, MemberData, MemberType } from "./MemberData";
import { ICONS } from "./AssetManager";
import { Lineup } from "./Lineup";

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
  const {theme} = menuStore()
  if(props.press == undefined){
    props.press = ()=>{}
  }
    return(
      <Pressable onPress={props.press} style={[uiStyles.rowButton,{backgroundColor:theme.neutral},props.rowStyle]}>
        <Image source={props.img} style={[uiStyles.buttonIcon,props.imgStyle]}/>
        <Text style={{paddingLeft:10, fontFamily:"Inter-Light",fontSize:20,color:theme.primaryText}}>{props.text}</Text>       
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
  const {theme} = menuStore()
  return (
      <Pressable style={[uiStyles.textButton,{backgroundColor:theme.neutral},props.buttonStyle]} onPress={props.press}>
          <Text style={[textStyles.textButton,props.textStyle]}>{props.text}</Text>
      </Pressable>
      
    );
}

type CheckBoxProps = {
  checked:boolean,
  press: (...args:any) => any
  boxStyle?:object
  topText?:string
  topTextStyle?:object
  bottomText?:string
  bottomTextStyle?:object
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

  let topText:React.JSX.Element = props.topText != undefined ? 
    <Text style={[props.topTextStyle,textStyles.imageButtonText,{position:"absolute",bottom:40}]}>{props.topText}</Text> : null
  
  let bottomText:React.JSX.Element = props.bottomText != undefined ?
    <Text style={[props.bottomTextStyle,textStyles.imageButtonText,{position:"absolute",top:40}]}>{props.bottomText}</Text> : null

  return(
  <Pressable style={[{flex:1,alignItems:"center"},props.boxStyle]} onPress={()=>{
    props.press()
    changeImage()
  }}>
    {topText}
    <Image source={images[check]} style={{height:32,width:32}}/>
    {bottomText}
  </Pressable>
  )
}

type TextCheckBoxProps = {
  checked:boolean,
  press: (...args:any) => any
  text:string
  textStyle?:object
  before?:boolean
}
/**
 * Botão em formato de caixa de checagem.
 * @param props Propriedades:
 * checked = caixa marcada ou não.     
 * press = ação ao pressionar
 * before = Texto deve aparecer antes da caixa? 
 * @returns 
 */
export function TextCheckBox(props:TextCheckBoxProps){

  const[check,setChecked] = props.checked ? useState(1) : useState(0)
  const images = [require("@/src/app/shapes/check_false.png"),require("@/src/app/shapes/check_true.png")]
  
  const changeImage = () =>{
    setChecked((check === 1) ? 0 : 1)
  }

  if(props.press == undefined){
    props.press = ()=>{}
  }
  if(props.before == undefined){
    props.before = false
  }

  let text:React.JSX.Element = <Text style={[props.textStyle,textStyles.imageButtonText,{marginLeft:20}]}>{props.text}</Text>

  return(
  <Pressable style={{flexDirection:"row",alignItems:"center"}} onPress={()=>{
    props.press()
    changeImage()
  }}>
    {props.before ? text : null}
    <Image source={images[check]} style={{height:32,width:32}}/>
    {!props.before ? text : null}
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
  topText?:string
  bottomText?:string
  topTextStyle?:object
  bottomTextStyle?:object
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
  let topText = props.topText != undefined ? <Text style={[props.topTextStyle,textStyles.imageButtonText,{position:"absolute",bottom:40}]}>{props.topText}</Text> : null
  let bottomText = props.bottomText != undefined ? <Text style={[props.topTextStyle,textStyles.imageButtonText,{position:"absolute",top:40}]}>{props.bottomText}</Text> : null

  return(
    <View style={[{flex:1,padding:10,alignItems:"center"},props.boxStyle]}>
      {topText}
      <Image source={props.enabled 
        ? require("@/src/app/shapes/check_true.png")
        :require("@/src/app/shapes/check_false.png")} 
        
        style={[{width:32,height:32},props.imageStyle]}></Image>
      {bottomText}
    </View>
  )
}


type TextVisualCheckBoxProps = {
  enabled:boolean
  text:string
  before?:boolean
  textStyle?:object
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
export function TextVisualCheckBox(props:TextVisualCheckBoxProps){ 

  let text = <Text style={[{padding:10},props.textStyle,textStyles.imageButtonText]}>{props.text}</Text>

  return(
    <View style={{alignItems:"center",flexDirection:"row"}}>
      {props.before ? text : null}
      <Image source={props.enabled 
        ? require("@/src/app/shapes/check_true.png")
        :require("@/src/app/shapes/check_false.png")} 
        
        style={[{width:32,height:32},props.imageStyle]}></Image>
      {!props.before || props.before==undefined ? text : null}
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
  const {theme} = menuStore()
  return(
      <Pressable style={[uiStyles.rowButton,{backgroundColor:theme.neutral,flexWrap:"wrap"}]} onPress={() => {
        if(props.press != null){
          props.press() 
        }
        
        router.push(props.link)}
        }>
        <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
        <Text style={[textStyles.buttonText,props.textStyle]}>{props.text}</Text>       
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
  boxBelow?:boolean
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
  if(props.enabled === false){return}

  return(
    <View style={{flexDirection:!props.boxBelow ? "row":"column", padding:10,alignItems:"center"}}>
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
  titleStyle?:object
  dataStyle?:object
}
/**
 * Exibe um dado em formato de texto
 * @param props dataTitle = nome do dado; data = valor do dado
 */
export function DataDisplay(props:DataDisplayProps) {
  return(
  <View style={{flex:1,flexDirection:"row", padding:10, alignItems:"center"}}>
    <Text style={[{flex:1,fontFamily:"Inter-Bold",fontSize:16,alignSelf:"center"},props.titleStyle]}>{props.dataTitle}</Text>
    <Text style={[{flex:1,fontFamily:"Inter-Regular",fontSize:16,alignSelf:"center"},props.dataStyle]}>{props.data}</Text>
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

type ConfirmationModalProps = {
  visible:boolean
  confirmationText:string
  confirmAction: (...args:any)=>any
  declineAction: (...args:any)=>any
  requestClose?: (...args:any)=>any
  alert?:boolean
  modalStyle?:object
}
/**
 * Modal para confirmar determinada ação
 * @param props
 * visible = Modal visível, confirmationText = Texto pedindo confirmação da ação,
 * confirmAction = ação ao confirmar, declineAction: ação ao cancelar.
 * requestClose = ação ao solicitar fechamento do modal
 * @returns 
 */
export function ConfirmationModal(props:ConfirmationModalProps){
  const {theme} = menuStore()
  return(
    <Modal
      animationType="fade"
      visible={props.visible}
      transparent={true}
      onRequestClose={props.requestClose != null ? props.requestClose : null}>
      
      <View style={{flex:1,justifyContent:"center",backgroundColor:"#0000005F"}}>
          <View style={[{backgroundColor:theme.primary},uiStyles.modal,props.modalStyle]}>
              
              {props.alert ? 
              <View>
                <Image source={ICONS.alert} style={{width:64,height:64,alignSelf:"center"}}/>
                <Text style={{fontFamily:'Inter-Bold',textAlign:"center",alignSelf:"center",fontSize:24,color:"#EE2D24"}}>ATENÇÃO!</Text>
              </View>:null}
              
              <Text style={[textStyles.dataText,{alignSelf:"center",textAlign:"center"}]}>{props.confirmationText}</Text>

              <View style={{flexDirection:"row",alignSelf:"center",gap:10,marginTop:30}}>
                  <TextButton text="Sim" buttonStyle={{backgroundColor:theme.confirm}} press={props.confirmAction}/>
                  <TextButton text="Não" buttonStyle={{backgroundColor:theme.reject}} press={props.declineAction}/>
              </View>
          </View>
          
      </View>
  </Modal>
  )
}

type DataSectionProps = {
  text:string
  textStyle?:object
  color?:string
  centered?:boolean
}
/**
 * Exibe um divisor de seção
 * @param props text = texto da seção
 * color = cor
 */
export function DataSection(props:DataSectionProps){
  const {theme} = menuStore()
  return(
    <View style={{backgroundColor:theme.neutral,minHeight:70,margin:10,borderColor:"#CCCCCC99",borderWidth:1,borderRadius:10}}>
      <Text style={[textStyles.dataSection,{backgroundColor:props.color,textAlign:props.centered?"center":"auto"},props.textStyle]}>{props.text}</Text>
    </View>
  )
}

type DropDownTypes = {
  options?:Array<string>
  actions?:Array<(...args:any)=>any>
  placeholder?:string
  offset?:{x:number,y:number}
}
/**
 * Menu no estilo dropdown de escolha única.
 * @param props options = nomes das opções do menu;
 * actions = ações ao selecionar cada opção (a ordem deve conferir com 'options');
 * placeholder = texto exibido antes de selecionar uma função
 * offset = desvio da posição da caixa de opções
 * @returns 
 */

export function DropDown(props:DropDownTypes){
  const [modalOpened,setModalOpened] = useState(false)
  const viewRef = useRef<View>(null)
  const [position,setPosition] = useState({x:0,y:0})
  const dropDownOffset = props.offset != null ? props.offset : {x:0,y:0}
  const [selectedOption, setSelectedOption] = useState(props.placeholder != undefined ? props.placeholder : props.options[0])
  const {theme} = menuStore()

  let options = []
  for(let i = 0; i < props.options.length;i++){
    let selected = props.options[i] == selectedOption
    let op = 
    <Pressable style={{backgroundColor:selected ? theme.neutral : "FFFFFF"}} key={i}onPress={
      ()=>{
        setSelectedOption(props.options[i])
        setModalOpened(!modalOpened)
        props.actions[i]()
      }
    }>
      <Text style={[textStyles.dataText,{marginLeft:20}]}>{props.options[i]}</Text>
      <View style={{marginTop:5,borderWidth:0.5,borderColor:"#1E1E1EF0"}}/>
    </Pressable>

    options.push(op)
  }

  
  return(
    <View style={{margin:10, maxWidth:"70%",maxHeight:"10%"}}>
      <Pressable ref={viewRef} style={{flexDirection:"row",marginBottom:50,justifyContent:"flex-start",minWidth:"50%",minHeight:50,borderRadius:10,borderColor:"#1E1E1E",borderWidth:1}} 
      onPress={()=>{
        setModalOpened(!modalOpened)
        viewRef.current.measure((x,y,width,height,pageX,pageY)=>{
          setPosition({x:pageX+dropDownOffset.x,y:pageY+dropDownOffset.y})
        })
        }}>
        <Text style={[{marginLeft:10, alignSelf:"center"},textStyles.dataText]}>{selectedOption}</Text>
        
        <Modal visible={modalOpened} transparent={true} onRequestClose={()=>setModalOpened(!modalOpened)}>
          <Pressable style={{flex:1}} onPress={()=>{setModalOpened(false)}}>
            <ScrollView style={{backgroundColor:"#FFFFFF",borderRadius:10,zIndex:-1,top:position.y+dropDownOffset.y,left:position.x+dropDownOffset.x,width:"50%",maxHeight:"20%",borderColor:"#1E1E1E",borderWidth:1}}>
              {options}
            </ScrollView>
          </Pressable>
          
        </Modal>
      </Pressable>
    </View>
  )
}

type ExpandableViewProps = {
  expanded:boolean
  title:string
  content:React.JSX.Element
  action?:(...args:any)=>any
  textStyle?:object
  color?:string,
  centered?:boolean
}
/**
 * Componente expansível
 * @param props expanded = está expandido?; title = título do botão; content = conteúdo do componente expandido; action = ação ao tocar no botão
 * @returns 
 */
export function ExpandableView(props:ExpandableViewProps){
  const [expanded,setExpanded] = useState(props.expanded)
  let content = expanded ? props.content : null
  return(
    <View style={{}}>
      <Pressable style={[uiStyles.dataSection,{backgroundColor:props.color}]} onPress={()=>{props.action != undefined ? props.action() : null;setExpanded(!expanded)}}>
        <Text style={[textStyles.dataSection,{textAlign:props.centered?"center":"auto"},props.textStyle]}>{props.title}</Text>
      </Pressable>
      {content}
    </View>
    
  )
}

type CompactLineupProps = {
  line:Lineup
}
/**
 * 
 * @param props 
 */
export function CompactLineup(props:CompactLineupProps){
  
  let roles:Array<React.JSX.Element> = []
  const {theme} = menuStore()
  const {switchingMember,updateSwitchingMember} = contextStore()
  const [lineup,updateLineup] = useState(props.line)
  for(let i = 0; i < lineup.members.length; i++){
    
    let role = Object.keys(lineup.line)[i]
    let member:Member = lineup.GetRoleMember(role)

    let component = 
    <View style={{flexDirection:"row", alignItems:"center"}} key={i}>
      <Text style={{fontFamily:"Inter-Bold",fontSize:10,flex:1/2}}>{role+""}</Text>
      <Text style={{fontFamily:"Inter-Regular",fontSize:10,flex:1/2}}>{member.nick}</Text>
      
      
      <ImageButton img={ICONS.switch} imgStyle={{width:24,height:24,resizeMode:"contain"}}
        press={()=>{
          
          if(switchingMember.switching){
            props.line.SwitchMembers(switchingMember.role,switchingMember.lineup,role,()=>{
              switchingMember.update()
            })
            switchingMember.switching = false
            
            let newState:Lineup = new Lineup()
            updateLineup(Object.assign(newState,props.line))
            console.log("Switched!")
          }
          else{
            updateSwitchingMember({role:role,lineup:props.line,switching:true,update:()=>{
              let newState:Lineup = new Lineup()
              updateLineup(Object.assign(newState,props.line))
            }})
            console.log("Switching")
            
          }
        }}/>
      <ImageButton img={ICONS.subs} imgStyle={{width:24,height:24,resizeMode:"contain"}}/>
      
      
      </View>

    roles.push(component)
  }
  return(
    <View style={{width:200,backgroundColor:theme.backgroundColor,borderRadius:15,margin:10}}>
      <View style={{backgroundColor:theme.primary,borderRadius:15,margin: 10}}>
        <Text style={{fontFamily:"Inter-Bold",fontSize:15,textAlign:"center",marginTop:5}}>{props.line.weekend + props.line.day}</Text>
        
        {props.line.place != undefined ?
          <Text style={{fontFamily:"Inter-Regular",fontSize:15,textAlign:"center",marginTop:5}}>{props.line.place}</Text> 
        : null}
      </View>
      
      
      <View style={{flex:1,margin:10,gap:5}}>
        {roles}
      </View>
      
    </View>
  )
}

type GridLineupViewProps = {
    allLineups:Array<Lineup>
    multiplePlace:boolean
}

/**
 * Exibe todas as escalas de uma lista em formato de grade.
 * @param props allLineups = lista de escalas; multiplePlace = organizar por local?
 * @returns 
 */
export function GridLineupView(props:GridLineupViewProps){
    // OBS: Esse componente utiliza renderização em etapas
    const isRendering = useRef(false) // Está renderizando?
    const renderPhase = useRef(0) // Estágio da renderização
    const [renderComplete,setRenderComplete] = useState(false) // Renderização completa
    
    // Construir componentes
    let rows:Array<React.JSX.Element> = []
    let sortedLines = {}
    const [components,setComponents] = useState([])

    for(let i = 0; i < props.allLineups.length; i++){
        let curLine:Lineup = props.allLineups[i] // Escala
        let mapKey = props.multiplePlace ? curLine.weekend+curLine.day : curLine.weekend

        if(sortedLines[mapKey] == undefined){
            sortedLines[mapKey] = []
        }

        sortedLines[mapKey].push(
            <CompactLineup line={curLine} key={i}/>
        )
    }
    
    let keys = Object.keys(sortedLines)
    for(let i = 0; i < keys.length;i++){
    rows.push(
        <View style={{flexDirection:"row"}} key={i}>
            {sortedLines[keys[i]]}
        </View>
        )
    }

    useEffect(()=>{
        if(!isRendering.current){
            isRendering.current = true
            setTimeout(()=>{         
                components.push(rows[renderPhase.current])

                if(renderPhase.current < rows.length){
                    renderPhase.current += 1
                    isRendering.current = false
                }
                else{
                    setRenderComplete(true)
                }
                
                setComponents(components.slice())
            },10)
        }
    })
    return(
      <View style={{flex:1}}>
        <ScrollView horizontal={true} style={{flex:1}}>    
          <ScrollView style={{flex:1}}>
            {components}                    
          </ScrollView>               
        </ScrollView>

        {/* Carregamento */}
        <Modal visible={!renderComplete} transparent={true}>
          <View style={{flex:1,alignContent:"center",alignItems:"center",justifyContent:"center",top:100,backgroundColor:"white"}}>
            <View style={{top:-100}}>
              <ActivityIndicator size="large"/>
            </View>
          </View>
        </Modal>
      </View>
    )
}

type LoadingModalProps = {
  visible:boolean
}
export function LoadingModal(props:LoadingModalProps){
  {/* Carregamento */}
  return(
    <Modal visible={props.visible} transparent={true}>
      <View style={{flex:1,alignContent:"center",alignItems:"center",justifyContent:"center",top:100,backgroundColor:"white"}}>
        <View style={{top:-100}}>
          <ActivityIndicator size="large"/>
        </View>
      </View>
    </Modal>
  )
}
type MemberSelectModalProps = {
  visible:boolean
  title:string
  returnCallback:(...args:any)=>void
  exeptions?:Array<Member>
  allSelected?:boolean
  multiselect?:boolean
  requestClose?:(...args:any)=>void
  onSubmit?:(...args:any)=>void
}
/**
 * Janela para seleção de membros
 * @param props Propriedades:
 * @param visible = visível; @param title título da janela; @param returnCallback função de retorno que recebe a lista de 
 * membros selecionados como argumento; @param exceptions membros excluídos da lista; @param allSelected todos os membros selectionados?
 * @param multiselect seleção de múltiplos membros ativa?; @param requestClose ação ao solicitar fechamento do modal; @param onSubmit ação ao confirmar
 * @returns 
 */
export function MemberSelectModal(props:MemberSelectModalProps){
  const {theme,type} = menuStore()
  let members:Array<Member> = []
  let exeptions = props.exeptions != null ? props.exeptions.slice() : []
  
  switch(type){
    case MemberType.ACOLYTE:
      members = MemberData.allAcolytes; break
    case MemberType.COROINHA:
      members = MemberData.allCoroinhas; break
  }
  
  const [selected,setSelected] = useState(props.allSelected ? members.slice():[])

  let memberComps = []
  for(let i = 0; i < members.length;i++){
    let curMember = members[i]
    let newComp =
    <Pressable style={{height:100,alignItems:"center",justifyContent:"center",flex:1,flexDirection:"row",backgroundColor:selected.includes(curMember) && !props.multiselect ? theme.neutral:"#FFFFFF"}} onPress={()=>{
      setSelected([curMember])
    }} key={i} disabled={props.multiselect}>
      <Image source={GetMemberIcon()} style={uiStyles.buttonIcon}/>
      <Text style={textStyles.memberNick}>{curMember.nick}</Text>
      
      {props.multiselect ?
      <CheckBox checked={selected.includes(curMember)} press={()=>{
        selected.includes(curMember) ?
          selected.splice(selected.indexOf(curMember),1)
          :
          selected.push(curMember)
          }}/>:null}
      
    </Pressable>;
    memberComps.push(newComp)
  }

  return(
    <Modal visible={props.visible} transparent={true} animationType="fade" onRequestClose={props.requestClose}>
      <View style={{flex:1,backgroundColor:"#00000099"}}>
        <View style={{flex:1,backgroundColor:"#FFFFFF",marginHorizontal:20,marginVertical:40,borderRadius:15}}>
          <View style={{backgroundColor:theme.primary,height:100,borderRadius:15,margin:10,justifyContent:"center",alignItems:"center"}}>
            <Text style={textStyles.dataTitle}>{props.title}</Text>
          </View>

          <ScrollView>
            {memberComps}
          </ScrollView>

          <TextButton text={"Concluir"} press={()=>{
            props.returnCallback(selected)
            props.onSubmit()
          }}/>
        </View>
      </View>
    </Modal>
  )
}