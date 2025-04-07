import { ScrollView, View } from "react-native";
import { RowImageButton, UpperBar } from "../classes/NewComps";
import { LineupScreenOptions } from "./LineupScreen";
import { router } from "expo-router";
import { menuStore } from "../store/store";
import { MemberData, MemberType, SaveAcolyteData, SaveCoroinhaData } from "../classes/MemberData";
import { StructuredLineup } from "../classes/Lineup";
import { ICONS } from "../classes/AssetManager";

export class LineupList{
    static lines = [];
}
// Tela
export default function LineupListScreen(){
    let lines = FetchLineupList();
    return(
        <View style={{flex:1}}>
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
    
    let lineupList:Array<StructuredLineup>
    let lineups = []
    let index = 0;

    switch (type){
        case MemberType.ACOLYTE:lineupList = MemberData.allLineupsAcolytes;break
        case MemberType.COROINHA:lineupList = MemberData.allLineupsCoroinhas;break
    }

    if(lineupList == null){return []}
    lineupList.forEach((line) =>{
        if(line == null){
            console.error("Invalid lineup. Erasing it.")
            lineupList.splice(index,1)
            
            switch(type){
                case MemberType.ACOLYTE:SaveAcolyteData();break
                case MemberType.COROINHA:SaveCoroinhaData();break
            }

            return
        }
        lineups.push(
        <RowImageButton img={ICONS.escala} text={line.name} key={index} press={(i = this.key)=>{
            LineupScreenOptions.LoadLineup(line), 
            LineupScreenOptions.loaded=true,
            LineupScreenOptions.loadedLineIndex=i, 
            router.push("/screens/LineupScreen")}}/>)
        index++;
    })
    return lineups
}