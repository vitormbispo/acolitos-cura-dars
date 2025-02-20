import { useState } from "react";
import { View,Text,Image, Pressable, TextInput} from "react-native"
import { router} from "expo-router"
import { textStyles, uiStyles } from "../styles/GeneralStyles";
import { contextStore, menuStore } from "../store/store";
import { MemberType } from "./MemberData";

const USER_ICONS = [require("@/src/app/item_icons/users_icomdpi.png"),require("@/src/app/shapes/coroinha_ico.png")]

/**
 * Botão com imagem
 * @param props Propriedades: 
 * img = Imagem     
 * imgStyle = Estilo do componente de imagem     
 * buttonStyle = Estilo do componente Pressable     
 * press = Ação quando o botão é pressionado     
 * @returns
 */
export function ImageButton(props:any) {
  if(props.press == undefined){
    props.press = ()=>{}
  }
  return (
    
       <Pressable style={props.buttonStyle} onPress={props.press}>
          <Image source={props.img} style={props.imgStyle}/>
       </Pressable>
      );
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
export function RowImageButton(props:any){
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



/**
   * Botão em formato de linha para representar um acólito.
   * @param props Propriedade:
   * id = Índice do acólito na lista principal.
   * img = Imagem     
   * nick = Apelido do acólito
   * textStyle = Estilo do texto
   * @returns 
   */
export function RowMember(props:any){
  const {updateMemberID} = contextStore()
  return(
    <Pressable style={{flexDirection:"row",alignItems:"center",padding:10,flex:1}} onPress={() => {updateMemberID(props.id) ; OpenMemberProfile(props.id)}}>
      <Image source={props.img} style={{width:64,height:64,resizeMode:"contain"}}/>
      <Text style={props.textStyle}>{props.nick}</Text>
    </Pressable>
  )
  }

/**
 * Abre o perfil do membro de índice *id* na lista geral.
 * @param id Índice
 */
function OpenMemberProfile(id:any){
  router.push("/screens/MemberProfile")
}

/** Botão com texto
 * 
 * @param props Propriedades:
   * text = Texto      
   * familyFont = Família da fonte do texto     
   * sizeFonte = Tamanho do texto     
   * press = Ação ao tocar     
   * textStyle = Estilo do texto     
   * buttonStyle = Estilo da Pressable
 * @returns 
 */
export function TextButton(props:any) {
  if(props.press == undefined){
    props.press = ()=>{}
  }
  return (
      <Pressable style={props.buttonStyle+{alignItems:"center"}} onPress={props.press}>
          <Image source={require("@/src/app/shapes/button0.png")} style={{height:64, width:128, position:"absolute",alignSelf:"center"}}/>
          <Text style={[{alignSelf:"center",textAlign:"center",textAlignVertical:"center",width:128,height:64,fontFamily:props.familyFont, fontSize:props.sizeFont},props.textStyle]}>{props.text}</Text>
      </Pressable>
      
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

/**
 * Botão no formato caixa de checagem única
 * @param props Propriedades:
 * press = Ação ao tocar     
 * topText = Texto acima da caixa     
 * img = Imagem
 * @returns 
 */
export function SingleCheck(props:any){
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

/**
 * 
 * @param props img = Imagem do botão
 * style = Estilo do botão
 * link = Link para outra tela. Deixe null para usar como um botão convencional
 * press = Ação ao tocar
 * backgroundColor = Cor do fundo
 */
export function UpperButton(props:any){
  return(
    <View style = {{flex:1,justifyContent:'flex-end',flexDirection:'row',alignItems:'center',padding:10,backgroundColor:props.backgroundColor}}>
      <LinkImageButton img={props.img} imgStyle={[uiStyles.buttonIcon,{width:48},props.style]} link={props.link} press={()=>{props.press == null ? ()=>{} : props.press()}}/>
    </View>
  )
}

/**
 * 
 * @param props enabled = Componente ativado
 * @returns 
 */
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
export function LinkRowImageButton(props:any){
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
  export function LinkImageButton(props:any) {
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

/**
 * 
 * @param props title = Título da caixa de entrada
 * default = valor padrão da caixa
 * keyboardType = tipo de teclado
 * onChangeText = ação ao usar a caixa
 * @returns 
 */
export function TextInputBox(props:any) {
  if(!props.enabled){return}

  return(
    <View style={{flexDirection:"row", padding:10,alignItems:"center"}}>
      <Text style={{fontFamily:"Inter-Light",fontSize:22}}>{props.title}</Text>
        <TextInput 
          style={uiStyles.inputField}
          defaultValue={props.default}
          keyboardType={props.keyboardType}
          onChangeText={props.onChangeText}
          maxLength={props.maxLength}/>
      </View>
  )
}

/**
 * Exibe um dado em formato de texto
 * @param props dataTitle = nome do dado; data = valor do dado
 */
export function DataDisplay(props:any) {
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
* @returns Ícon de usuário
*/
export function GetMemberIcon() {
  const {type} = menuStore()
  return USER_ICONS[type]
}


  