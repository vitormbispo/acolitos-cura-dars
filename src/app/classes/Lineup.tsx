import { Acolyte } from "./AcolyteData";
import { Coroinha } from "./CoroinhaData";

interface RolesDict{
    [key:string]:any
}

export class Lineup{
    TYPE = "single"
    line = new Map<string,Acolyte>()
    acolytes:any=[]

    day:string = ""
    weekend:string = ""
}

export class WeekendLineup{
    TYPE = "weekend"
    lines = new Map<string,Lineup>
}

export class MonthLineup{
    TYPE = "weekend"
    lines = new Map<string,Map<string,Lineup>>
}

