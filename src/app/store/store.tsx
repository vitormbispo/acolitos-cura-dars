import { create } from 'zustand'
import { acolyteLight, coroinhaLight} from '../styles/Themes'
import { MemberType } from '../classes/Member'

export enum MenuStyles{
    ACOLYTE_LIGHT,
    ACOLYTE_DARK,
    COROINHA_LIGHT,
    COROINHA_DARK
}

export type ThemeStates = {
    theme:{
        accentColor: string,
        secondary: string,
        backgroundColor: string
    }
    name:string
    type:MemberType

    updateTheme: (theme:any) => void
    updateType: (type:any)=>void
    updateName:(name:any)=>void
    toggleTheme:(state:any)=>void
}

export const menuStore = create<ThemeStates>((set)=>({
    name:"Acólitos",
    type:MemberType.ACOLYTE,
    theme:acolyteLight,

    updateType: (newType)=>set(()=>({type:newType})),
    updateName: (newName)=>set(()=>({name:newName})),
    updateTheme: (newTheme)=>set(()=>({theme:newTheme})),
    toggleTheme: () => set((state)=>{
        if(state.type==MemberType.ACOLYTE){
            return({type:MemberType.COROINHA,name:"Coroinhas",theme:coroinhaLight})
        }
        else{
            return({type:MemberType.ACOLYTE,name:"Acólitos",theme:acolyteLight})
        }  
    })

}))


