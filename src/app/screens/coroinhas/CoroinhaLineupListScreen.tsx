import { ScrollView, View } from "react-native";
import { RowImageButton, UpperBar } from "@/src/app/classes/NewComps";
import { CoroinhaData } from "@/src/app/classes/CoroinhaData";

import { ImageButton } from "@/src/app/classes/NewComps";
import { RandomNumber } from "@/src/app/classes/Methods";
import { CoroinhaLineupScreenOptions } from "@/src/app/screens/coroinhas/CoroinhaLineupScreen";
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
    console.log("All")
    console.log(CoroinhaData.allLineups)
    CoroinhaData.allLineups.forEach((line) =>{
        lineups.push(<RowImageButton img={require("@/src/app/item_icons/escala_icomdpi.png")} text={line.name} key={index} press={(i = this.key)=>{CoroinhaLineupScreenOptions.LoadLineup(line), CoroinhaLineupScreenOptions.loaded=true,CoroinhaLineupScreenOptions.loadedLineIndex=i, router.push("/screens/coroinhas/CoroinhaLineupScreen")}}/>)
        index++;
    })
    return lineups
}