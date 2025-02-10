import {create} from 'zustand'
import { acolyteDark, acolyteLight, coroinhaLight } from '../styles/Themes'

export enum MenuStyles{
    ACOLYTE_LIGHT,
    ACOLYTE_DARK,
    COROINHA_LIGHT,
    COROINHA_DARK
}

export type ThemeStates = {
    theme: MenuStyles
    themeObj:{
        accentColor: string,
        secondary: string,
        backgroundColor: string
    }
    updateTheme: (any) => void
    useLightAcolyteTheme: () => void
    useDarkAcolyteTheme: () => void
    useLightCoroinhaTheme: ()=> void
}
export const themeStore = create<ThemeStates>((set)=>({
    theme:MenuStyles.ACOLYTE_LIGHT,
    themeObj:acolyteLight,
    useLightAcolyteTheme: ()=>{set(()=>({themeObj:acolyteLight}))},
    useDarkAcolyteTheme: ()=>{set(()=>({themeObj:acolyteDark}))},
    useLightCoroinhaTheme: ()=>{set(()=>({themeObj:coroinhaLight}))},
    updateTheme: (newTheme) => set(()=>({theme:newTheme}))
}))



const themes = (set) => ({
    useLightAcolyteTheme: ()=>{set({theme:MenuStyles.ACOLYTE_LIGHT})},
    useDarkAcolyteTheme: ()=>{set({theme:MenuStyles.ACOLYTE_DARK})},
    useLightCoroinhaTheme: ()=>{set({theme:MenuStyles.COROINHA_LIGHT})},
    useDarkCoroinhaTheme: ()=>{set({theme:MenuStyles.COROINHA_DARK})}
})

