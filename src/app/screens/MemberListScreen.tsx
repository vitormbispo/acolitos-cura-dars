import { View, ScrollView } from "react-native";
import { GetMemberIcon, GetMemberAddIcon} from "../classes/NewComps";
import { useRef, useState } from "react";
import { menuStore } from "../store/store";
import { textStyles } from "../styles/GeneralStyles";
import { MemberData, MemberType } from "../classes/MemberData";
import { Member } from "../classes/members/Member";
import { ICONS } from "../classes/AssetManager";
import { RowMember } from "../components/buttons/RowMember";
import { UpperBar } from "../components/display/UpperBar";
import { LinkRowImageButton } from "../components/buttons/LinkRowImageButton";
import { MemberRepository } from "../classes/repository/MemberRepository";

export class MemberList{
    static scrollPos = 0;
    static scrollRef = null;
}

export default function List() {
    const {theme} = menuStore()
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

    let membersComponents = []
    const {name,type} = menuStore()
    let typeName:string

    switch (type){
        case MemberType.ACOLYTE:typeName = "Acólito"; break
        case MemberType.COROINHA:typeName = "Coroinha"; break
    }

    let members = MemberData.FindMembersByType(type)

    console.log("Members = "+members)
    for(let i =0;i < members.length;i++){
        membersComponents.push(<RowMember nick={members[i].getNick()} id={members[i].getId()} img={ICONS.acolito} key={i} 
        textStyle={textStyles.names}
        />)
    }
    
    return(
        <View style={{flex:1,flexDirection:"column",backgroundColor:theme.backgroundColor}}>
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
                        
                    text={"- Novo "+typeName}
                    img={GetMemberAddIcon()}
                    press={()=>{}}
                    />
                
                {membersComponents}
                
            </ScrollView>   
        </View>
    )
}