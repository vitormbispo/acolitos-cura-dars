import { ToastAndroid, View} from "react-native"
import { router } from "expo-router"
import { useState } from "react"
import { Lineup } from "../../classes/lineups/Lineup"
import { CopyToClipboard, GenerateLineupPrompt} from "../../classes/Util"
import { menuStore } from "../../store/store"
import {ICONS} from "../../classes/AssetManager"
import { TextButton } from "../../components/buttons/TextButton"
import { UpperBar } from "../../components/display/UpperBar"
import { UpperButton } from "../../components/buttons/UpperButton"
import { GridLineupView } from "../../components/frames/GridLineupView"
import { ConfirmationModal } from "../../components/input/ConfirmationModal"
import { LineupGroup } from "../../classes/lineups/LineupGroup"
import { LineupData } from "../../classes/lineups/LineupData"
import { LineupGroupRepository } from "../../classes/repository/LineupGroupRepository"
import { MemberType } from "../../classes/members/MemberType"

export class LineupScreenOptions{
    public static name = "Nova escala"

    public static lineups:Array<Lineup> = []
    public static places = [] // Locais selecionados
    public static monthLineups:object = {} // Ex.: "1stWE":[Lineup,Lineup,Lineup]

    public static isLoaded:boolean = false; // A escala exibida é carregada?
    public static loadedLineIndex:number = 0; // Índice da escala carregada

    /**
     * Salva os dados da lineup
     * @returns LineupGroup
     */
    public static SaveLineup(type:MemberType):LineupGroup{
        let line = new LineupGroup(LineupScreenOptions.name)
    
        line.lineups = LineupScreenOptions.lineups
        line.places = LineupScreenOptions.places
        line.monthLineupsMap = LineupScreenOptions.monthLineups
        line.type = type

        if(LineupScreenOptions.isLoaded) {
            let loaded = LineupData.savedLineups[LineupScreenOptions.loadedLineIndex]
            line.id = loaded.id
        }

        return line;
    }
    
    /**
     * Carrega os dados da lineup:
     * @param line 
     */
    public static LoadLineup(line:LineupGroup){
        LineupScreenOptions.lineups = line.lineups
        LineupScreenOptions.monthLineups = line.monthLineupsMap
        LineupScreenOptions.name = line.name
        LineupScreenOptions.places = line.places
    }
}

export default function LineupScreen(){
    const {type, theme} = menuStore()
    const [confirmDeleteVisible,setConfirmDeleteVisible] = useState(false)

    return(
        <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
            <View style={{flexDirection:'row', backgroundColor:theme.accentColor}}>
                <UpperBar icon={ICONS.escala} screenName={"Escala:"}/>
                {LineupScreenOptions.isLoaded ?
                 <UpperButton img={ICONS.delete} press={()=>{
                     setConfirmDeleteVisible(!confirmDeleteVisible)
                }}/>:null}
            </View>

            <GridLineupView allLineups={LineupScreenOptions.lineups} multiplePlaces={LineupScreenOptions.places.length > 1}/>
            
            <View style={{flexDirection:"row",justifyContent:"center"}}>
                <TextButton text={"Salvar escalas"} press={()=>{
                    SaveAllLineups(type)
                }}/>
                <TextButton text={"Copiar prompt gemini"} press={()=>{
                    CopyGeminiPrompt()
                }}/>
            </View>
            

            <ConfirmationModal 
                visible={confirmDeleteVisible} 
                confirmationText={"Deseja excluir a escala: \""+LineupScreenOptions.name+"\"?"} 
                confirmAction={() => {
                    EraseLineup(LineupScreenOptions.loadedLineIndex)
                    router.back()}}  
                declineAction={()=>{
                    setConfirmDeleteVisible(!confirmDeleteVisible)
                }}/> 
        </View>
    )
}

/**
 * Exclui uma escala da lista do histórico de escalas dado o índice.
 * @param index Índice a ser excluído
 */
function EraseLineup(index:number) {
    LineupData.RemoveGroupByIndex(index)
}

/**
 * Salva todas as escalas.
 * @param type Tipo de membro
 */
function SaveAllLineups(type:MemberType){
    if(!LineupScreenOptions.isLoaded){
        let saved:LineupGroup
        let savedId:number = -1

        switch(type){
            case MemberType.ACOLYTE:
                LineupScreenOptions.name = "Escala | Acólitos "+(LineupData.FindLineupsByType(type).length+1)
                break
            case MemberType.COROINHA:
                LineupScreenOptions.name = "Escala | Coroinhas "+(LineupData.FindLineupsByType(type).length+1)
                break
        }
        
        saved = LineupScreenOptions.SaveLineup(type)
        savedId = LineupGroupRepository.Insert(saved).lastInsertRowId
        saved.id = savedId
        LineupData.AddLineups(saved)
        
        LineupScreenOptions.isLoaded = true
        LineupScreenOptions.loadedLineIndex = 0
        ToastAndroid.show("Escalas salvas!",2)
    }
    else{
        let saved = LineupScreenOptions.SaveLineup(type)

        LineupData.UpdateLineupsByIndex(LineupScreenOptions.loadedLineIndex,saved)
        LineupGroupRepository.Update(saved)
        ToastAndroid.show("Escalas salvas!",2)
    }
}

/**
 * Copia um prompt para o Gemini à área de transferência.
 */
function CopyGeminiPrompt(){
    CopyToClipboard(GenerateLineupPrompt(LineupScreenOptions.lineups))
}
