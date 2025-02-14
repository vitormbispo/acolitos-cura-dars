import { View, ScrollView } from "react-native";
import { UpperBar,LinkRowImageButton, RowMember, GetMemberIcon} from "../classes/NewComps";
import { useRef, useState } from "react";
import { contextStore, menuStore } from "../store/store";
import { textStyles } from "../styles/GeneralStyles";
import { MemberData, MemberType } from "../classes/MemberData";


export class MemberList{
    static scrollPos = 0;
    static scrollRef = null;
}

export default function List() {
    
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
    let typeName:string

    switch (type){
        case MemberType.ACOLYTE:
            typeName = "Acólito"; break
        case MemberType.COROINHA:
            typeName = "Coroinha"; break
    }

    if(type == MemberType.ACOLYTE) {
        if(MemberData.allAcolytes!=null){
            for(let i =0;i<MemberData.allAcolytes.length;i++){
                members.push(<RowMember nick={MemberData.allAcolytes[i].nick} id={i} img={require("../item_icons/users_icomdpi.png")} key={i} 
                textStyle={textStyles.names}
                />)
            }
        }
    }
    else if(type == MemberType.COROINHA) {
        if(MemberData.allCoroinhas != null){
            for(let i = 0; i < MemberData.allCoroinhas.length; i++){
                members.push(<RowMember nick={MemberData.allCoroinhas[i].nick} id={i} img={require("../shapes/coroinha_ico.png")} key={i} 
                textStyle={textStyles.names}
                />)
            }
        }
    }
    
    return(
        <View style={{flex:1,flexDirection:"column"}}>
            <UpperBar icon={GetMemberIcon()} screenName={name} toggleEnabled={true}/>

            <ScrollView 
            ref={scrollViewRef}
            onScroll={handleScroll}
            onContentSizeChange={() => { scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false }); }}
            style={{flex:1}}>
                <LinkRowImageButton link={"/screens/NewMember"} 
                    textStyle=
                        {{paddingLeft:10, 
                        fontFamily:"Inter-Light",
                        fontSize:20}} 
                        
                    text={"- Adicionar novo "+typeName}
                    img={require("@/src/app/item_icons/add_ico.png")}
                    press={()=>{}}
                    />
                
                {members}
                
            </ScrollView>   
        </View>
    )
}