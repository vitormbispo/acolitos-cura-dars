import { Acolyte } from "./AcolyteData";
import { Coroinha } from "./CoroinhaData";

interface RolesDict{
    [key:string]:any
}


export class CoroinhaLineup{
    line = new Map<string,Coroinha>()
    coroinhas:any=[]

    day:any
    weekend:any
}

export class WeekendLineup{
    TYPE = "weekend"
    lines = new Map<string,CoroinhaLineup>
}

export class MonthLineup{
    name = "NewLineup"
    TYPE = "Month"
    lines = new Map<string,Array<CoroinhaLineup>>()
    monthLines = []
}
