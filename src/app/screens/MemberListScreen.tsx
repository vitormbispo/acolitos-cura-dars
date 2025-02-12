import { View, ScrollView } from "react-native";
import { Global } from "../Global";
import { UpperBar,LinkRowImageButton, RowMember} from "../classes/NewComps";
import { AcolyteData } from "../classes/AcolyteData";
import { useRef, useState } from "react";
import { contextStore, menuStore } from "../store/store";
import { textStyles } from "../styles/GeneralStyles";
import { MemberType } from "../classes/Member";
import { CoroinhaData } from "../classes/CoroinhaData";


export class MemberList{
    static scrollPos = 0;
    static scrollRef = null;
}


export default function List(){
    
    const[scrollPosition, setScrollPosition] = useState(MemberList.scrollPos);
    const scrollViewRef = useRef(MemberList.scrollRef);
    
    /**
     * Salva o estado do scroll da tela
     * @param event 
     */
    const handleScroll = (event:any) => {
        let pos = event.nativeEvent.contentOffset.y
        setScrollPosition(pos);
        MemberList.scrollPos = pos;
        MemberList.scrollRef = scrollViewRef;
    }

    let members = []
    const {name,type} = menuStore()
    const {memberID,updateMemberID} = contextStore()

    if(type == MemberType.ACOLYTE){
        if(AcolyteData.allAcolytes!=null){
            for(let i =0;i<AcolyteData.allAcolytes.length;i++){
                members.push(<RowMember nick={AcolyteData.allAcolytes[i].nick} id={i} img={require("../item_icons/users_icomdpi.png")} key={i} 
                textStyle={textStyles.names}
                />)
            }
        }
    }
    else{
        if(CoroinhaData.allCoroinhas != null){
            for(let i = 0; i < CoroinhaData.allCoroinhas.length; i++){
                members.push(<RowMember nick={CoroinhaData.allCoroinhas[i].nick} id={i} img={require("../shapes/coroinha_ico.png")} key={i} 
                textStyle={textStyles.names}
                />)
            }
        }
    }
    

    
    return(
        
        <View style={{flex:1,flexDirection:"column"}}>
            <UpperBar icon={type==MemberType.ACOLYTE ? require("@/src/app/item_icons/users_icomdpi.png"):require("@/src/app/shapes/coroinha_ico.png")} screenName={name} toggleEnabled={true}/>

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
                    img={require("@/src/app/item_icons/add_ico.png")}
                    press={()=>{}}
                    />
                
                {members}
                
            </ScrollView>   
        </View>
    )
}