import { ScrollView, View, Text, VirtualizedList, Modal, ActivityIndicator } from "react-native";
import { MemberData } from "../classes/MemberData";
import { CompactLineup, GridLineupView, UpperBar } from "../classes/NewComps";
import { Dates } from "../classes/Dates";
import { Lineup } from "../classes/Lineup";
import { ICONS } from "../classes/AssetManager";
import { Suspense, useEffect, useRef, useState } from "react";

export default function TestScreen(){
     
    return(
        <View style={{flex:1}}>
            <UpperBar icon={ICONS.escala} screenName={"- Escala"}/>
            <GridLineupView allLineups={MemberData.allLineupsAcolytes[0].lineups} multiplePlace={false}/>
        </View>
        
    )
}

