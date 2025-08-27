import { ScrollView, View, Text, VirtualizedList, Modal, ActivityIndicator } from "react-native";
import { MemberData } from "../classes/MemberData";
import { Dates } from "../classes/Dates";
import { Lineup } from "../classes/Lineup";
import { ICONS } from "../classes/AssetManager";
import { Suspense, useEffect, useRef, useState } from "react";
import { UpperBar } from "../components/display/UpperBar";
import { GridLineupView } from "../components/frames/GridLineupView";

export default function TestScreen(){
     
    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.escala} screenName={"- Escala"}/>
            <GridLineupView allLineups={MemberData.allLineupsAcolytes[0].lineups} multiplePlace={false}/>
        </View>
        
    )
}

