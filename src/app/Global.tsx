import { StyleSheet } from "react-native"

export class Global{
    static styles = StyleSheet.create({
        icons: {
            width:64,
            height:64,
            padding:50,
            paddingRight:10,
            paddingLeft:10,
            resizeMode:"contain"
        },
        buttonIcons: {
            width:64,
            height:64,
            resizeMode:"contain"
        },
        rowContainer:{
            flex:0.1,
            flexDirection:"row",
            alignContent:"center",
            alignItems:"center",
            backgroundColor: '#FFEBA4',
            padding:10
        },
        columnContainer:{
            flex:0.1,
            flexDirection:"column",
            alignContent:"center",
            alignItems:"center"
        },
        titleSections:{
            flex:1,
            backgroundColor:"#9BFFF9",
            height:80}
    })
    
    static textStyles = StyleSheet.create({
        menuTitle:{
            fontFamily:"Inter-Light",
            fontSize:20,
            paddingLeft:20
        },

        dataSection:{
            fontFamily:"Inter-Bold", 
            fontSize:24,
            textAlignVertical:"center",
            textAlign:"left",
            flex:1,
            paddingLeft:10
        },
         
        dataTitle:{
            fontFamily:"Inter-Bold",
            fontSize:20,
            padding:10
        },
        dataText:{
            fontFamily:"Inter-Light",
            fontSize:20
        }
        
    })

    static currentScreen = {
        screenName: "Tela inicial",
        iconPath: "../item_icons/home_icomdpi.png"
    }

    static lastScreen = {
        scrollXPos: 0,
        scrollYPos:0
    }

    static nextGroup = 0
}
