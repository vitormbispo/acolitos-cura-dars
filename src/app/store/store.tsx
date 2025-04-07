import { Member, MemberType } from '../classes/MemberData'
import { create } from 'zustand'
import { acolyteLight, coroinhaLight} from '../styles/Themes'
import { Lineup, LineupType } from '../classes/Lineup'
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
    appStarted:boolean
    memberID:number
    rolesetID:number
    lineupType:LineupType
    curWeekend:string
    curDay:string
    curGenOptions:GenerationOptionsType
    switchingMember:{role:string,lineup:Lineup,switching:boolean,update?:(...args:any)=>void}
    replacingMember:{role:string,lineup:Lineup,replacing:boolean,member:Member,update?:(...args:any)=>void}
    
    updateReplacingMember: (state:{role:string,lineup:Lineup,replacing:boolean,member:Member,update?:(...args:any)=>void}) => void
    updateSwitchingMember: (state:{role:string,lineup:Lineup,switching:boolean,update?:(...args:any)=>void}) => void
    updateAppStarted: (state:boolean) => void
    updateMemberID: (id:number) => void
    updateRolesetID: (id:number) => void
    setLineupType: (type:LineupType) => void
    updateWeekend: (weekend:string) => void
    updateDay: (day:string) => void
}

export type ThemeStates = {
    theme:{
        accentColor: string,
        primary:string,
        secondary: string,
        highlight: string,
        confirm: string,
        reject: string,
        neutral:string,
        primaryText: string,
        backgroundColor: string,
        disabled:string
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
    appStarted:false,
    memberID:0,
    rolesetID:0,
    lineupType:LineupType.SINGLE,
    curWeekend:Dates.defaultWeekends.slice()[0],
    curDay:Dates.defaultDays.slice()[0],
    curGenOptions:{
            "members":[],
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
            "places":[],
            "roleset":Roles.GetDefaultRoleset(MemberType.ACOLYTE),
            "exclusiveOptions":{}
        },
    switchingMember:{role:undefined,lineup:undefined,switching:false,update:undefined},
    replacingMember:{role:undefined,lineup:undefined,replacing:false,member:undefined,update:undefined},
    
    updateReplacingMember: (member) => set(()=>({replacingMember:member})),
    updateSwitchingMember: (member) => set(()=>({switchingMember:member})),
    updateAppStarted: (newState) => set(()=>({appStarted:newState})),
    updateMemberID: (newID) => set(()=>({memberID:newID})),
    updateRolesetID: (newID) => set(()=>({rolesetID:newID})),
    setLineupType: (newType:LineupType) => set(()=>({lineupType:newType})),
    updateWeekend: (newWeekend:string) => set(()=>({curWeekend:newWeekend})),
    updateDay: (newDay:string) => set(()=>({curDay:newDay})),
}))



