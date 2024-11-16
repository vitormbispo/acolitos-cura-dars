import { View,Image,Text, ScrollView } from "react-native";
import { useState, useRef } from "react";
import { Global } from "@/src/app/Global";
import { ImageButton,LinkImageButton, LinkRowImageButton, RowAcolyte, RowCoroinha, RowImageButton } from "@/src/app/classes/NewComps";
import { AcolyteData } from "@/src/app/classes/AcolyteData";
import { CoroinhaData } from "@/src/app/classes/CoroinhaData";
import { useLocalSearchParams } from "expo-router";

export class CoroinhaList{
    static scrollPos = 0;
    static scrollRef = null;
}
export default function List(){
    
    Global.currentScreen={screenName:"Coroinhas",iconPath:""}
    
    const coroinhas = []
    if(CoroinhaData.allCoroinhas!=null){
        for(let i =0;i<CoroinhaData.allCoroinhas.length;i++){
            coroinhas.push(<RowCoroinha nick={CoroinhaData.allCoroinhas[i].nick} id={i} img={require("@/src/app/shapes/coroinha_ico.png")} key={i} textStyle=
            {{fontFamily:"Inter-Bold",
               fontSize:20
            }}/>)
        }
    }
    

    const[scrollPosition, setScrollPosition] = useState(CoroinhaList.scrollPos);
    const scrollViewRef = useRef(CoroinhaList.scrollRef);

    const handleScroll = (event:any) => {
        let pos = event.nativeEvent.contentOffset.y
        setScrollPosition(pos);
        CoroinhaList.scrollPos = pos;
        CoroinhaList.scrollRef = scrollViewRef;
    }

    
    return(
        
        <View style={{flex:1,flexDirection:"column"}}>
            <UpperBar/>

        <ScrollView 
        ref={scrollViewRef}
        onScroll={handleScroll}
        onContentSizeChange={() => { scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false }); }}
        style={{flex:1}}>
        <LinkRowImageButton link={"/screens/coroinhas/NewCoroinha"} 
            textStyle=
                {{paddingLeft:10, 
                fontFamily:"Inter-Light",
                fontSize:20}} 
                
            text="- Adicionar novo coroinha!"
            img={require("@/src/app/shapes/add_coroinha.png")}
            />
            
            {coroinhas}
            
        </ScrollView>   
        
            
        </View>
    )
}

export const UpperBar = () => {
    return(
        <View style = {[Global.styles.rowContainer,{backgroundColor:"#fca4a4"}]}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            padding:26,
            paddingRight:40,
            paddingLeft:40,
            resizeMode:"contain"}} 
            
            source={require("@/src/app/shapes/coroinha_ico.png")}/>
            
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
            
        </View>
    )
}
