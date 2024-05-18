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
