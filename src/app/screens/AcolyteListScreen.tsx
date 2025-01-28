import { View, ScrollView } from "react-native";
import { Global } from "../Global";
import { UpperBar,LinkRowImageButton, RowAcolyte} from "../classes/NewComps";
import { AcolyteData } from "../classes/AcolyteData";
import { useRef, useState } from "react";


export class AcolyteList{
    static scrollPos = 0;
    static scrollRef = null;
}


export default function List(){
    
    Global.currentScreen={screenName:"Acólitos",iconPath:""}
    
    const[scrollPosition, setScrollPosition] = useState(AcolyteList.scrollPos);
    const scrollViewRef = useRef(AcolyteList.scrollRef);

    /**
     * Salva o estado do scroll da tela
     * @param event 
     */
    const handleScroll = (event:any) => {
        let pos = event.nativeEvent.contentOffset.y
        setScrollPosition(pos);
        AcolyteList.scrollPos = pos;
        AcolyteList.scrollRef = scrollViewRef;
    }
    

    const acolytes = []
    if(AcolyteData.allAcolytes!=null){
        for(let i =0;i<AcolyteData.allAcolytes.length;i++){
            acolytes.push(<RowAcolyte nick={AcolyteData.allAcolytes[i].nick} id={i} img={require("../item_icons/users_icomdpi.png")} key={i} 
            textStyle={{
                fontFamily:"Inter-Bold",
                fontSize:20
            }}/>)
        }
    }
    
    return(
        
        <View style={{flex:1,flexDirection:"column"}}>
            <UpperBar icon={require("@/src/app/item_icons/users_icomdpi.png")} screenName={"Acólitos"}/>

            <ScrollView 
            ref={scrollViewRef}
            onScroll={handleScroll}
            onContentSizeChange={() => { scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false }); }}
            style={{flex:1}}>
                <LinkRowImageButton link={"/screens/NewAcolyte"} 
                    textStyle=
                        {{paddingLeft:10, 
                        fontFamily:"Inter-Light",
                        fontSize:20}} 
                        
                    text="- Adicionar novo acólito!"
                    img={require("../item_icons/add_ico.png")}
                    press={()=>{}}
                    />
                
                {acolytes}
                
            </ScrollView>   
        </View>
    )
}