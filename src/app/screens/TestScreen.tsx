import { ScrollView, View, Text, VirtualizedList } from "react-native";
import { MemberData } from "../classes/MemberData";
import { CompactLineup, UpperBar } from "../classes/NewComps";
import { Dates } from "../classes/Dates";
import { Lineup } from "../classes/Lineup";
import { ICONS } from "../classes/AssetManager";

export default function TestScreen(){
     
    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.escala} screenName={"- Escala"}/>
            <GridLineupView allLineups={MemberData.allLineupsAcolytes[0].lineups} multiplePlace={false}/>
        </View>
        
    )
}

type GridLineupViewProps = {
    allLineups:Array<Lineup>
    multiplePlace:boolean
}
/**
 * allLineups
 * multiplePlace
 */
function GridLineupView(props:GridLineupViewProps){

    let rows:Array<React.JSX.Element> = []
    let sortedLines = {}

    if(!props.multiplePlace){
        for(let i = 0; i < props.allLineups.length; i++){
            let curLine:Lineup = props.allLineups[i]
            if(sortedLines[curLine.weekend] == undefined){
                sortedLines[curLine.weekend] = []
            }

            sortedLines[curLine.weekend].push(
                <CompactLineup line={curLine} key={i}/>
            )
        }
    }

    let keys = Object.keys(sortedLines)
    for(let i = 0; i < keys.length;i++){
        rows.push(
            <View style={{flexDirection:"row"}} key={i}>
                {sortedLines[keys[i]]}
            </View>
        )
    }

    return(
        <View>
            <ScrollView horizontal={true}>
                <View>
                    <ScrollView style={{flex:1}}>
                        {rows}
                    </ScrollView>
                </View>
                
            </ScrollView>
        </View>
    )

}