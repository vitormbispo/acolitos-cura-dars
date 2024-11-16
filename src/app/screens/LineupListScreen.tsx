import { ScrollView, View } from "react-native";
import { RowImageButton, UpperBar } from "../classes/NewComps";
import { AcolyteData } from "../classes/AcolyteData";

import { ImageButton } from "../classes/NewComps";
import { RandomNumber } from "../classes/Methods";
import { LineupScreenOptions } from "./LineupScreen";
import { router } from "expo-router";
export class LineupList{
    static lines = [];
}
export default function LineupListScreen(){
    let lines = FetchLineupList();
    return(
        <View style={{flex:1}}>
            <UpperBar icon={require("@/src/app/item_icons/escala_icomdpi.png")}/>
            <ScrollView style={{flex:1}}>
                {lines}
            </ScrollView>

        </View>
    )
}

export function FetchLineupList(){
    let lineups = []
    let index = 0;
    AcolyteData.allEverLineups.forEach((line) =>{
        lineups.push(<RowImageButton img={require("@/src/app/item_icons/escala_icomdpi.png")} text={line.name} key={index} press={(i = this.key)=>{LineupScreenOptions.LoadLineup(line), LineupScreenOptions.loaded=true,LineupScreenOptions.loadedLineIndex=i, router.push("/screens/LineupScreen")}}/>)
        index++;
    })
    return lineups
}