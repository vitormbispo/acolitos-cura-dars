import { MemberType } from '../classes/MemberData'
import { create } from 'zustand'
import { acolyteLight, coroinhaLight} from '../styles/Themes'
import { LineupType } from '../classes/Lineup'
import { Roles } from '../classes/Roles'
import { Dates, DateSet } from '../classes/Dates'
import { GenerationOptionsType } from '../screens/LineupGenerationOptions'


export enum MenuStyles{
    ACOLYTE_LIGHT,
    ACOLYTE_DARK,
    COROINHA_LIGHT,
    COROINHA_DARK
}

export type ContextStates = {
    memberID:number
    rolesetID:number
    lineupType:LineupType
    curWeekend:string
    curDay:string
    curGenOptions:GenerationOptionsType
    updateMemberID: (id:number) => void
    updateRolesetID: (id:number) => void
    setLineupType: (type:LineupType) => void
    updateWeekend: (weekend:string) => void
    updateDay: (day:string) => void
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
    rolesetID:0,
    lineupType:LineupType.SINGLE,
    curWeekend:Dates.defaultWeekends.slice()[0],
    curDay:Dates.defaultDays.slice()[0],
    curGenOptions:{
            "weekend":"1stWE",
            "day":null,
            "allowOut":false,
            "allRandom":false,
            "solemnity":false,
            "randomness":1.6,
            "lineupType":LineupType.SINGLE,
            "monthDays":Dates.DefaultMonthDays(),
            "dayRotation":true,
            "dateset":new DateSet(),
            "place":"",
            "roleset":Roles.GetDefaultRoleset(MemberType.ACOLYTE)
        },
    updateMemberID: (newID) => set(()=>({memberID:newID})),
    updateRolesetID: (newID) => set(()=>({rolesetID:newID})),
    setLineupType: (newType:LineupType) => set(()=>({lineupType:newType})),
    updateWeekend: (newWeekend:string) => set(()=>({curWeekend:newWeekend})),
    updateDay: (newDay:string) => set(()=>({curDay:newDay})),
}))



