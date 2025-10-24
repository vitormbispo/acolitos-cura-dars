import { ScrollView, View } from "react-native";
import { LineupScreenOptions } from "./LineupScreen";
import { router } from "expo-router";
import { menuStore } from "../store/store";
import { MemberData, MemberType } from "../classes/MemberData";
import { ICONS } from "../classes/AssetManager";
import { RowImageButton } from "../components/buttons/RowImageButton";
import { UpperBar } from "../components/display/UpperBar";
import { LineupGroup } from "../classes/lineups/LineupGroup";
import { LineupData } from "../classes/lineups/LineupData";

export class LineupList{
    static lines = [];
}
// Tela
export default function LineupListScreen(){
    let lines = FetchLineupList();
    const {theme} = menuStore()
    return(
        <View style={{flex:1,backgroundColor:theme.backgroundColor}}>
            <UpperBar icon={ICONS.escala} screenName="Escalas"/>
            <ScrollView style={{flex:1}}>
                {lines}
            </ScrollView>

        </View>
    )
}

/**
 * Monta a lista de escalas em componentes RowImageButton
 * @returns Array
 */
export function FetchLineupList(){
    const {type} = menuStore()
    
    let lineupList:Array<LineupGroup> = LineupData.savedLineups
    let lineups = []
    let index = 0;

    if(lineupList == null){return []}
    lineupList.forEach((line) =>{
        let currentIndex = index
        if(line.type == type) {
            lineups.push(
                <RowImageButton img={ICONS.escala} text={line.name} key={currentIndex} press={()=>{
                    LineupScreenOptions.LoadLineup(line), 
                    LineupScreenOptions.isLoaded=true,
                    LineupScreenOptions.loadedLineIndex=currentIndex, 
                    router.push("/screens/LineupScreen")}}/>)
        }
        index++
    })
    return lineups
}