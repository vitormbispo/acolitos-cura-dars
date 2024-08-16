import { View,Image,Text, ScrollView } from "react-native";
import { Global } from "../Global";
import { ImageButton,LinkImageButton, LinkRowImageButton, RowAcolyte, RowImageButton } from "../classes/NewComps";
import { AcolyteData } from "../classes/AcolyteData";

export default function List(){
    
    Global.currentScreen={screenName:"Acólitos",iconPath:""}
    
    const acolytes = []
    if(AcolyteData.allAcolytes!=null){
        for(let i =0;i<AcolyteData.allAcolytes.length;i++){
            acolytes.push(<RowAcolyte nick={AcolyteData.allAcolytes[i].nick} id={i} img={require("../item_icons/users_icomdpi.png")} key={i} textStyle=
            {{fontFamily:"Inter-Bold",
               fontSize:20
            }}/>)
        }
    }
    
    
    
    return(
        
        <View style={{flex:1,flexDirection:"column"}}>
            <UpperBar/>

        <ScrollView style={{flex:1}}>
        <LinkRowImageButton link={"/screens/NewAcolyte"} 
            textStyle=
                {{paddingLeft:10, 
                fontFamily:"Inter-Light",
                fontSize:20}} 
                
            text="- Adicionar novo acólito!"
            img={require("../item_icons/add_ico.png")}
            />
            
            {acolytes}
            
        </ScrollView>   
        
            
        </View>
    )
}

export const UpperBar = () => {
    return(
        <View style = {Global.styles.rowContainer}>
            <Image 
            style = 
            
            {{width:64,
            height:64,
            padding:26,
            paddingRight:40,
            paddingLeft:40,
            resizeMode:"contain"}} 
            
            source={require("../item_icons/users_icomdpi.png")}/>
            
            <Text style = {Global.textStyles.menuTitle}>- {Global.currentScreen.screenName}</Text>
            
        </View>
    )
}

