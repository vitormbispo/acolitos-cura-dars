import { View} from "react-native";
import { GetMemberIcon } from "../classes/NewComps";
import { uiStyles} from "../styles/GeneralStyles";
import { contextStore, menuStore} from "@/src/app/store/store";
import { ICONS } from "../classes/AssetManager";
import { UpperBar } from "../components/display/UpperBar";
import { ImageTextButton, TextPosition } from "../components/buttons/ImageTextButton";
import { TextButton } from "../components/buttons/TextButton";
import { MemberRepository } from "../classes/repository/MemberRepository";
import { Member } from "../classes/members/Member";
import { RotationRepository } from "../classes/repository/RotationRepository";
import { RoleRotation } from "../classes/members/RoleRotation";
import { MemberType } from "../classes/MemberData";
import { RotationTypes } from "../classes/members/Rotation";

// Tela//
export default function Home(){
    const {name,theme} = menuStore()
    return(
        <View style = {{flex:1,backgroundColor:theme.backgroundColor}}>
            <UpperBar screenName={"Tela inicial | "+name} icon={ICONS.home} toggleEnabled={true} hideGoBack={true}/>
            <AppBody/>
            
            <LowerBar/> 
        </View>
        
    )
}

// Corpo da tela
export function AppBody(){
    const {appStarted} = contextStore()

    return(
    appStarted ?
    <View style={{flex:1, flexDirection:"column",alignSelf:"center",padding:10}}>
        <TextButton text={"Inicializar"} press={() => {
            //MemberRepository.InitRepository()
            RotationRepository.InitRepository()
        }}/>

        <TextButton text={"Selecionar"} press={() => {
            //MemberRepository.FindAllMembersByType().then(result => {console.log(result)})
                console.log(MemberRepository.FindAllMembers())
            //RotationRepository.FindAllRotations().then(result => {console.log(result)})
        }}/>

        <TextButton text={"Inserir"} press={() => {
            let member = new Member()
            //MemberRepository.InsertMember(member).then(()=>console.log("Inserido"),e => console.log("Erro: "+e))

            //RotationRepository.InsertRotation(rotation).catch(e => console.error(e))
        }}/>

        <TextButton text={"Apagar tudo"} press={() => {
            RotationRepository.DeleteAll().then(()=>{console.log("Finish")})
            MemberRepository.DeleteAll()
        }}/>


    </View> : null
    )
}

// Rodapé
export const LowerBar = () => {
    const {type,theme} = menuStore()
    return(
        <View style = {[uiStyles.lowerBar,{backgroundColor:theme.accentColor}]}>
            <ImageTextButton img={ICONS.home} imgStyle={uiStyles.buttonIconSmall} text={"Início"} textPos={TextPosition.BOTTOM}/>
            <ImageTextButton img={GetMemberIcon()} imgStyle={uiStyles.buttonIconSmall} text={"Membros"} textPos={TextPosition.BOTTOM} link={"/screens/MemberListScreen"}/>
            <ImageTextButton img={ICONS.escala} imgStyle={uiStyles.buttonIconSmall} text={"Escalas"} textPos={TextPosition.BOTTOM} link={"/screens/LineupOptions"}/>
            <ImageTextButton img={ICONS.menu} imgStyle={uiStyles.buttonIconSmall} text={"Menu"} textPos={TextPosition.BOTTOM} link={"/screens/SettingsMenu"}/>
            
        </View>
    )
}