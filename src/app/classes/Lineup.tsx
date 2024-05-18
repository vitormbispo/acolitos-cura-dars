import { Acolyte } from "./AcolyteData";
import { Coroinha } from "./CoroinhaData";

interface RolesDict{
    [key:string]:any
}

export class Lineup{
    line = new Map<string,Acolyte>()
    acolytes:any=[]

    day:any
    weekend:any
}

