import { StyleSheet } from "react-native";

export const uiStyles = StyleSheet.create({
    lowerBar:{
        paddingTop:10,
        paddingBottom:10,
        paddingRight:30,
        paddingLeft:30,
        margin:20,
        borderRadius:100,
        gap:15,
        alignItems:"center",
        alignContent:"center",
        flexDirection:"row",
        alignSelf:"center", 
    },
    upperBar:{
        flexDirection:'row',
        alignItems:'center',
        height:100,
        paddingLeft:15,
    },
    buttonIcon:{
        height:64,
        width:64,
        resizeMode:'contain'
    },
    buttonIconSmall:{
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
    },

    inputField:{
        backgroundColor:"#FFFFFF",
        fontSize:22,
        fontFamily:"Inter-Regular",
        width:200,
        padding:10,
        borderRadius:100,
        borderColor:"#1E1E1E99",
        borderWidth:1
    },
    rowButtonContainer:{
        alignSelf:"center",
        alignContent:"center",
        alignItems:"center",
        margin:10,
        flexDirection:"row",
        gap:10
    },
    textButton:{
        alignItems:"center",
        alignSelf:"center",
        backgroundColor:"#ABDCE3",
        borderRadius:100,
        borderWidth:1,
        borderColor:"#1E1E1E",
    }

    
})

export const textStyles = StyleSheet.create({
    menuTitle:{
        fontFamily:"Inter-Light",
        fontSize:18,
        paddingLeft:20
    },
    names:{
        fontFamily:"Inter-Bold",
        fontSize:20
    },
    textButtonText:{
        fontSize:16,
        fontFamily:"Inter-Regular" 
    },
    lineupTitle:{
        fontFamily:"Inter-Bold",
        fontSize:20,
        textAlign:"center",
        padding:10
    },
    dataTitle:{
        fontFamily:"Inter-Bold",
        fontSize:20,
        padding:10
    },
    dataText:{
        fontFamily:"Inter-Light",
        fontSize:20
    },
    dataSection:{
        fontFamily:"Inter-Bold", 
        fontSize:24,
        textAlignVertical:"center",
        textAlign:"left",
        flex:1,
        paddingLeft:10
    },
    buttonText:{
        paddingLeft:10, 
        fontFamily:"Inter-Light",
        fontSize:20
    },
    imageButtonText:{
        fontFamily:"Inter-Light",
        fontSize:14,
        textAlign:"center",
    },
    functionTitle:{
        fontFamily:"Inter-Bold",
        fontSize:18,
        alignSelf:"center",
        flex:1
    },
    memberNick:{
        fontFamily:"Inter-Light",
        fontSize:18,
        alignSelf:"center",
        flex:1
    },
    textButton:{
        alignSelf:"center",
        textAlign:"center",
        textAlignVertical:"center",
        marginLeft:25,
        marginRight:25,
        marginTop:15,
        marginBottom:15   
    }
})


