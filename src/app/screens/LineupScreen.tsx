import { View,Text, ScrollView} from "react-native"
import { ConfirmationModal, GridLineupView, ImageButton, MemberSelectModal, TextButton, UpperBar, UpperButton} from "../classes/NewComps"
import { router } from "expo-router"
import { useRef, useState } from "react"
import { Lineup, StructuredLineup } from "../classes/Lineup"
import { CopyToClipboard, GenerateLineupPrompt, GetMemberIndex } from "../classes/Methods"
import { menuStore } from "../store/store"
import { Member, MemberData, MemberType, SaveAcolyteData, SaveCoroinhaData } from "../classes/MemberData"
import {ICONS} from "../classes/AssetManager"
import { textStyles, uiStyles } from "../styles/GeneralStyles"
import { MemberSelectScreenOptions } from "./MemberSelectScreen"

export class LineupScreenOptions{
    static name = "Nova escala"

    static lineups:Array<Lineup> = []
    static places = [] // Locais selecionados
    static monthLineups:object = {} // Ex.: "1stWE":[Lineup,Lineup,Lineup]

    static loaded:boolean = false; // A escala exibida é carregada?
    static loadedLineIndex:number = 0; // Índice da escala carregada

    /**
     * Salva os dados da lineup
     * @returns StructuredLineup
     */
    public static SaveLineup():StructuredLineup{
        let line = new StructuredLineup()
    
        line.lineups = LineupScreenOptions.lineups
        line.monthLineups = LineupScreenOptions.monthLineups
        line.name = LineupScreenOptions.name

        return line;
    }
    
    /**
     * Carrega os dados da lineup:
     * @param line 
     */
    public static LoadLineup(line:StructuredLineup){
        LineupScreenOptions.lineups = line.lineups
        LineupScreenOptions.monthLineups = line.monthLineups
        LineupScreenOptions.name = line.name
    }
}

// Gerenciador de trocas e substituições de membros
class SwitchHandler{
    static isSwitching = false
    static switchingRole:string // Função do membro que está sendo trocado
    static roleSwitched:string // Função do membro que entrará no lugar
    static switchingMemberLineup:Lineup
    static memberSwitchedLineup:Lineup

    static isReplacing = false
    static memberReplaced:Member // Membro substituído
    static replacingMember:Member // Membro que substituirá
}

export default function LineupScreen(){
    const {type, theme} = menuStore()
    const [confirmDeleteVisible,setConfirmDeleteVisible] = useState(false)
    const [memberSelectOpen, setMemberSelectOpen] = useState(false)
    const upperBtn = LineupScreenOptions.loaded ? 
    <UpperButton img={ICONS.delete} press={()=>{
        setConfirmDeleteVisible(!confirmDeleteVisible)
    }}/>:
    null

    return(
        <View style={{flex:1}}>
            <View style={{flexDirection:'row', backgroundColor:theme.accentColor}}>
                <UpperBar icon={ICONS.escala} screenName={"Escala:"}/>
                {upperBtn}
            </View>
            <GridLineupView allLineups={LineupScreenOptions.lineups} multiplePlace={LineupScreenOptions.places.length > 1}/>
            <MemberSelectModal visible={memberSelectOpen} title={"Substituir: "} multiselect={false}
                returnCallback={()=>{
                    SwitchHandler
                }}/>
            <TextButton text={"Salvar escalas"} press={()=>{
                MemberData.allLineupsAcolytes = [LineupScreenOptions.SaveLineup()].concat(MemberData.allLineupsAcolytes)
                MemberData.SaveMemberData()
            }}/>
        </View>
    )
}

/**
 * Exclui uma escala da lista do histórico de escalas dado o índice.
 * @param index Índice a ser excluído
 */
function EraseLineup(index:number,type:MemberType){
    let lineupsList:Array<StructuredLineup>
    switch (type){
        case MemberType.ACOLYTE:lineupsList = MemberData.allLineupsAcolytes;break
        case MemberType.COROINHA:lineupsList = MemberData.allLineupsCoroinhas;break
    }
    lineupsList.splice(index,1)
    
    switch(type){
        case MemberType.ACOLYTE:SaveAcolyteData();break
        case MemberType.COROINHA:SaveCoroinhaData();break
    }
}

/**
 * Salva todas as escalas.
 * @param type Tipo de membro
 */
function SaveAllLineups(type:MemberType){
    if(!LineupScreenOptions.loaded){
        switch(type){
            case MemberType.ACOLYTE:
                LineupScreenOptions.name = "Escala | Acólitos "+(MemberData.allLineupsAcolytes.length+1)
                MemberData.allLineupsAcolytes = [LineupScreenOptions.SaveLineup()].concat(MemberData.allLineupsAcolytes) // Inserindo nova escala no início. Poupa um sort
                SaveAcolyteData()
                break
            case MemberType.COROINHA:
                LineupScreenOptions.name = "Escala | Coroinhas "+(MemberData.allLineupsCoroinhas.length+1)
                MemberData.allLineupsCoroinhas = [LineupScreenOptions.SaveLineup()].concat(MemberData.allLineupsCoroinhas)
                SaveCoroinhaData()
                break
        }

        LineupScreenOptions.loaded = true
        LineupScreenOptions.loadedLineIndex = 0
    }
    else{
        switch(type){
            case MemberType.ACOLYTE:
                MemberData.allLineupsAcolytes[LineupScreenOptions.loadedLineIndex] = LineupScreenOptions.SaveLineup()
                SaveAcolyteData()
                break
            case MemberType.COROINHA:
                MemberData.allLineupsCoroinhas[LineupScreenOptions.loadedLineIndex] = LineupScreenOptions.SaveLineup()
                SaveCoroinhaData()
                break
        }
    }
}

/**
 * Copia um prompt para o Gemini à área de transferência.
 */
function CopyGeminiPrompt(){
    CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.lineups,[]))
}
