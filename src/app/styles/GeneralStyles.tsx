import { StyleSheet } from "react-native";

export const uiStyles = StyleSheet.create({
    upperBar:{
        flexDirection:'row',
        alignItems:'center',
        height:100
    },
    buttonIcon:{
        height:64,
        width:64,
        resizeMode:'contain'
    },

    icons: {
        width:64,
        height:64,
        padding:26,
        paddingRight:10,
        paddingLeft:10,
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
    }

    
})

export const textStyles = StyleSheet.create({
    menuTitle:{
        fontFamily:"Inter-Light",
        fontSize:20,
        paddingLeft:20
    },
    names:{
        fontFamily:"Inter-Bold",
        fontSize:20
    }
})


