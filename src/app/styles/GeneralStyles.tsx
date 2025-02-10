import { StyleSheet } from "react-native";
import { themeStore } from "../store/store";
import { THEMES } from "./Themes";

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
    }
})


