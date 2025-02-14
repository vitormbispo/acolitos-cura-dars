import { MemberType } from '../classes/MemberData'
import { create } from 'zustand'
import { acolyteLight, coroinhaLight} from '../styles/Themes'


export enum MenuStyles{
    ACOLYTE_LIGHT,
    ACOLYTE_DARK,
    COROINHA_LIGHT,
    COROINHA_DARK
}

export type ContextStates = {
    memberID:number
    updateMemberID: (id:number) => void
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

export const contextStore = create<ContextStates>((set)=>({
    memberID:0,
    updateMemberID: (newID) => set(()=>({memberID:newID}))
}))



